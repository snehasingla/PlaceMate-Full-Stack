import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../components/common/Spinner';

const InterviewSession = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { jobRole, jobDescription, resumeText, experience, questions } = location.state || {};

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [answers, setAnswers] = useState([]);
  
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes per question
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  // Speech Recognition state
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event) => {
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            const transcript = event.results[i][0].transcript;
            setCurrentAnswer(prev => prev + transcript + ' ');
          }
        }
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (!recognitionRef.current) {
        alert("Your browser does not support Speech Recognition. Please try using Google Chrome.");
        return;
      }
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  useEffect(() => {
    if (!questions || questions.length === 0) {
      navigate('/mock/new');
    }
  }, [questions, navigate]);

  // Timer logic
  useEffect(() => {
    if (isSubmitting || results || !questions) return;
    
    if (timeLeft === 0) {
      handleNext(); // Auto-next when time is up
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isSubmitting, results, questions]);

  if (!questions) return null;

  const currentQuestion = questions[currentQuestionIndex];

  // Prevent accidental page reload or tab close
  useEffect(() => {
    if (isSubmitting || results || !questions) return;
    
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = 'Are you sure you want to leave? Your progress will be lost.';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isSubmitting, results, questions]);

  const handleNext = () => {
    if (!currentAnswer.trim()) return;

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }

    const newAnswers = [
      ...answers,
      {
        question: currentQuestion.question,
        questionType: currentQuestion.type,
        answer: currentAnswer
      }
    ];

    setAnswers(newAnswers);
    setCurrentAnswer('');
    setTimeLeft(120); // Reset timer

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      submitInterview(newAnswers);
    }
  };

  const submitInterview = async (finalAnswers) => {
    if (finalAnswers.length === 0) {
      navigate('/mock');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const response = await axios.post('/api/interviews/evaluate', {
        jobRole,
        jobDescription,
        resumeText,
        experience,
        qaList: finalAnswers
      }, { withCredentials: true });

      setResults(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to evaluate answers. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEndEarly = () => {
    const confirm = window.confirm("Are you sure you want to end the interview early? Only the questions you've answered so far will be evaluated.");
    if (confirm) {
      if (isListening) {
        recognitionRef.current?.stop();
        setIsListening(false);
      }
      submitInterview(answers);
    }
  };

  if (isSubmitting) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
        <h2 className="text-xl font-semibold mt-6 text-gray-900 dark:text-white">Evaluating your answers...</h2>
        <p className="text-gray-500 mt-2">Our AI is analyzing your responses and generating feedback.</p>
      </div>
    );
  }

  if (results) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Interview Results</h1>
          <div className="px-4 py-2 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-lg font-bold">
            Score: {results.overallScore} / 10
          </div>
        </div>
        
        <div className="space-y-6">
          {results.qaList.map((qa, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                  Q{index + 1}: {qa.question}
                </h3>
                <span className="ml-4 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded-md text-gray-600 dark:text-gray-300 font-medium whitespace-nowrap">
                  {qa.questionType} • {qa.rating}/10
                </span>
              </div>
              
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Your Answer:</h4>
                <p className="text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg text-sm border border-gray-100 dark:border-gray-700">
                  {qa.answer}
                </p>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-1">AI Feedback:</h4>
                <p className="text-gray-800 dark:text-gray-200 bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg text-sm border border-indigo-100 dark:border-indigo-800/30 whitespace-pre-wrap">
                  {qa.feedback}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={() => navigate('/mock')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mock Interview</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{jobRole}</p>
        </div>
        <div className="text-sm font-medium px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-300">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
        {error && (
          <div className="mb-4 text-red-500 text-sm p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
            {error}
          </div>
        )}

        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="inline-block px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-semibold rounded">
              {currentQuestion.type} Question
            </span>
            <span className={`text-sm font-bold flex items-center ${timeLeft < 30 ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </span>
          </div>
          <h2 className="text-xl font-medium text-gray-900 dark:text-white">
            {currentQuestion.question}
          </h2>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Your Answer
            </label>
            <button 
              onClick={toggleListening}
              className={`flex items-center text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                isListening 
                  ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 animate-pulse' 
                  : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50'
              }`}
            >
              {isListening ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-red-600 dark:bg-red-400 mr-2"></span>
                  Stop Recording
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                  Speak Answer
                </>
              )}
            </button>
          </div>
          <textarea
            rows={8}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
            placeholder={isListening ? "Listening... start speaking..." : "Type your answer here or click 'Speak Answer' to use your microphone."}
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
          />
        </div>

        <div className="mt-8 flex justify-between items-center">
          <button
            onClick={handleEndEarly}
            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30 px-4 py-2 rounded-lg font-medium transition-colors text-sm"
          >
            End Interview Early
          </button>
          
          <button
            onClick={handleNext}
            disabled={!currentAnswer.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Submit Interview'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewSession;
