const { GoogleGenAI } = require('@google/genai');

const analyzeResume = async (req, res) => {
  const { resumeText, jobDescription } = req.body;

  if (!resumeText || !jobDescription) {
    return res.status(400).json({ message: "Resume text and Job Description are required" });
  }

  // Check if user is premium
  if (!req.user.isPremium) {
    return res.status(403).json({ message: "This feature is locked. Please upgrade to Premium to use the AI Resume Analyzer." });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(400).json({
      feedback: "### Configuration Required\n\nTo see real AI analysis, you must add your `GEMINI_API_KEY` to the `.env` file in the server directory.\n\n1. Go to [Google AI Studio](https://aistudio.google.com/) and create a free API key.\n2. Add `GEMINI_API_KEY=your_key_here` to `server/.env`.\n3. Restart your server."
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const prompt = `
You are an expert ATS (Applicant Tracking System) scanner and technical tech recruiter.
Analyze the following technical resume against the job description and provide a professional feedback report in Markdown format.
Include these exact headers in your response exactly as written:

### AI Resume Analysis Report

#### Match Score: [Provide a percentage from 0-100% based on strict evaluation. e.g. 🟢 85% or 🟡 65% or 🔴 30%]

#### Strengths (Found Keywords):
- [List 3 to 5 actual bullet points explaining why the candidate is a good fit, explicitly calling out matched keywords from the JD]

#### Areas for Improvement (Missing Keywords):
- [List 3 to 5 critical keywords or technologies the JD mentions but are missing or poorly emphasized in the resume]

#### Recommendation:
- [A couple of sentences of actionable advice to improve the resume for this specific job]

Review strictly. If the job requires Python/FastAPI and the resume only has Node.js, the score should be very low.

-----
Resume:
${resumeText}

-----
Job Description:
${jobDescription}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });

    const feedback = response.text;

    res.json({ feedback });
  } catch (error) {
    console.error("AI Analysis error:", error);
    res.status(500).json({ message: "Failed to analyze resume" });
  }
};

module.exports = {
  analyzeResume
};
