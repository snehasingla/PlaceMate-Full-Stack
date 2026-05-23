import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/common/Spinner';
import PaymentModal from '../components/common/PaymentModal';
import { Sparkles } from 'lucide-react';

const NewInterview = () => {
  const [jobRole, setJobRole] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [experience, setExperience] = useState('Fresher');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPayment, setShowPayment] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuth();

  const handleStart = async (e) => {
    e.preventDefault();
    
    if (!user?.isPremium) {
      setShowPayment(true);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/interviews/generate', {
        jobRole,
        jobDescription,
        resumeText,
        experience
      }, { withCredentials: true });

      const { questions } = response.data;
      
      // Navigate to session and pass questions and context in state
      navigate('/mock/session', { 
        state: { 
          jobRole, 
          jobDescription, 
          resumeText,
          experience, 
          questions 
        } 
      });

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to generate questions.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Start New Interview Session</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Tell us about the role you are preparing for, and our AI will generate personalized technical and HR questions to practice with.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        {error && (
          <div className="mb-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm border border-red-200 dark:border-red-800">
            {error}
          </div>
        )}

        <form onSubmit={handleStart}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Job Role / Position
              </label>
              <input
                type="text"
                placeholder="e.g. Frontend Developer, Data Scientist"
                required
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Job Description (JD) / Technologies
              </label>
              <textarea
                rows={5}
                placeholder="Paste the job description or list the technologies (e.g. React, Node.js, Express, MongoDB)..."
                required
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Your Resume (Optional)
              </label>
              <textarea
                rows={4}
                placeholder="Paste your resume text here to get personalized questions based on your background..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Experience Level
              </label>
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="Fresher">Fresher (0 years)</option>
                <option value="1-3 Years">1-3 Years</option>
                <option value="3-5 Years">3-5 Years</option>
                <option value=">=5 Years">5+ Years</option>
              </select>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/mock')}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg mr-4 transition-colors font-medium text-sm"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type={user?.isPremium ? "submit" : "button"}
              onClick={!user?.isPremium ? (e) => { e.preventDefault(); setShowPayment(true); } : undefined}
              disabled={loading}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors flex items-center shadow-md disabled:opacity-70 disabled:cursor-not-allowed ${
                !user?.isPremium 
                  ? 'bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-gray-900/30 hover:from-gray-700 hover:to-gray-800'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              {loading ? (
                <>
                  <Spinner size="sm" color="white" />
                  <span className="ml-2">Generating Questions...</span>
                </>
              ) : !user?.isPremium ? (
                <>
                  <Sparkles className="w-4 h-4 text-yellow-400 mr-2" />
                  Unlock Premium to Start
                </>
              ) : (
                'Start Interview'
              )}
            </button>
          </div>
        </form>
      </div>
      
      <PaymentModal isOpen={showPayment} onClose={() => setShowPayment(false)} />
    </div>
  );
};

export default NewInterview;
