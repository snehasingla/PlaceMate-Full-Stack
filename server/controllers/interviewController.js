const { GoogleGenAI } = require('@google/genai');
const MockInterview = require('../models/MockInterview');

// 1. Generate Interview Questions
const generateQuestions = async (req, res) => {
  const { jobRole, jobDescription, experience, resumeText } = req.body;

  if (!jobRole || !jobDescription) {
    return res.status(400).json({ message: "Job Role and Job Description are required" });
  }

  if (!req.user.isPremium) {
    return res.status(403).json({ message: "This feature is locked. Please upgrade to Premium to use the AI Mock Interview Simulator." });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ message: "GEMINI_API_KEY is not configured on the server." });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    let resumeContext = "";
    if (resumeText) {
      resumeContext = `\nThe candidate's Resume is provided below. You must heavily base the questions on BOTH the Job Description and the Resume. Challenge them on claims made in their resume that match the Job Description.\nResume:\n${resumeText}\n`;
    }

    const prompt = `
You are an expert technical interviewer and HR manager. 
Generate exactly 5 interview questions for a candidate applying for the role of "${jobRole}" with experience level "${experience || 'Fresher'}".
The questions should be heavily based on the following Job Description:
${jobDescription}
${resumeContext}

IMPORTANT GUIDELINES:
1. Make the questions concise, punchy, and to the point (maximum 1-2 sentences per question). Do not make them too long or overly verbose.
2. The questions should feel like a real, practical interview. Focus on core concepts, problem-solving scenarios, or past experiences.
3. Include 3 Technical questions and 2 HR/Behavioral questions.

Return ONLY a valid JSON array of objects, where each object has "question" (string) and "type" (string, either "Technical" or "HR"). No markdown blocks, no other text.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    let text = response.text.trim();

    let questions;
    try {
      const match = text.match(/\[[\s\S]*\]/);
      if (match) text = match[0];
      questions = JSON.parse(text);
    } catch (parseErr) {
      console.error("Failed to parse JSON for questions:", text);
      return res.status(500).json({ message: "AI returned invalid JSON format. Please try again." });
    }

    res.json({ questions });
  } catch (error) {
    console.error("Error generating questions:", error);
    res.status(500).json({ message: "Failed to generate questions. Please try again." });
  }
};

// 2. Evaluate Answers & Save Session
const evaluateAnswers = async (req, res) => {
  const { jobRole, jobDescription, experience, resumeText, qaList } = req.body;

  if (!qaList || qaList.length === 0) {
    return res.status(400).json({ message: "No questions and answers provided." });
  }

  if (!req.user.isPremium) {
    return res.status(403).json({ message: "This feature is locked. Please upgrade to Premium to use the AI Mock Interview Simulator." });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ message: "GEMINI_API_KEY is not configured on the server." });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    let resumeContext = "";
    if (resumeText) {
      resumeContext = `\nCandidate's Resume:\n${resumeText}\n`;
    }

    const prompt = `
You are an expert technical interviewer evaluating a candidate for the role of "${jobRole}".
Here are the candidate's answers to the interview questions.
Evaluate each answer strictly out of 10 and provide constructive feedback on how to improve.
${resumeContext}
Candidate Answers Data (JSON format):
${JSON.stringify(qaList, null, 2)}

Return ONLY a valid JSON array of objects corresponding to each question in the exact same order.
Each object should have:
- "feedback" (string): Detailed constructive feedback for the answer.
- "rating" (number): A score from 1 to 10.

Do not wrap the output in markdown code blocks, return ONLY raw JSON array.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    let text = response.text.trim();

    let evaluations;
    try {
      const match = text.match(/\[[\s\S]*\]/);
      if (match) text = match[0];
      evaluations = JSON.parse(text);

      if (!Array.isArray(evaluations)) {
        // Sometimes it wraps in an object
        evaluations = evaluations.evaluations || evaluations.results || evaluations.data || [];
      }
    } catch (parseErr) {
      console.error("Failed to parse JSON for evaluations:", text);
      // Fallback so user doesn't lose their session
      evaluations = qaList.map(() => ({ feedback: "AI failed to generate feedback.", rating: 5 }));
    }

    // Merge evaluations with qaList
    let totalScore = 0;
    const finalQaList = qaList.map((qa, index) => {
      const evalData = evaluations[index] || { feedback: "No feedback generated", rating: 5 };
      totalScore += evalData.rating;
      return {
        ...qa,
        feedback: evalData.feedback,
        rating: evalData.rating
      };
    });

    const averageScore = Math.round((totalScore / qaList.length) * 10) / 10;

    // Save to Database
    const mockInterview = new MockInterview({
      user: req.user._id,
      jobRole,
      jobDescription,
      resumeText: resumeText || "",
      experience: experience || 'Fresher',
      qaList: finalQaList,
      overallScore: averageScore
    });

    await mockInterview.save();

    res.json(mockInterview);
  } catch (error) {
    console.error("Error evaluating answers:", error);
    res.status(500).json({ message: "Failed to evaluate answers." });
  }
};

// 3. Get User's Interview Sessions
const getMySessions = async (req, res) => {
  try {
    const sessions = await MockInterview.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ sessions });
  } catch (error) {
    console.error("Error fetching sessions:", error);
    res.status(500).json({ message: "Failed to fetch mock interviews." });
  }
};

// 4. Get specific session by ID
const getSessionById = async (req, res) => {
  try {
    const session = await MockInterview.findOne({ _id: req.params.id, user: req.user._id });
    if (!session) {
      return res.status(404).json({ message: "Interview session not found." });
    }
    res.json({ session });
  } catch (error) {
    console.error("Error fetching session:", error);
    res.status(500).json({ message: "Failed to fetch mock interview details." });
  }
};

module.exports = {
  generateQuestions,
  evaluateAnswers,
  getMySessions,
  getSessionById
};
