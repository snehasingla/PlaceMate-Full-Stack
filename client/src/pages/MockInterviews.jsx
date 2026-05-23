import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../components/common/Spinner';

const MockInterviews = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await axios.get('/api/interviews/my-sessions', { withCredentials: true });
        setSessions(response.data.sessions);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch mock interview sessions.');
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mock Interviews</h1>
        <Link 
          to="/mock/new"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          New Session
        </Link>
      </div>
      
      {loading ? (
        <div className="flex justify-center mt-12"><Spinner /></div>
      ) : error ? (
        <div className="bg-red-50 text-red-500 p-4 rounded-lg">{error}</div>
      ) : sessions.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            No mock interview sessions recorded. Schedule one to practice!
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map((session) => (
            <div key={session._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white line-clamp-1">{session.jobRole}</h3>
                <span className={`px-2 py-1 text-xs font-bold rounded-md ${
                  session.overallScore >= 8 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                  session.overallScore >= 5 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                  'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  Score: {session.overallScore}/10
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex-grow line-clamp-2">
                {session.jobDescription}
              </p>
              <div className="text-xs text-gray-400 dark:text-gray-500 mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                {new Date(session.createdAt).toLocaleDateString()} • {session.qaList?.length || 0} Questions
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MockInterviews;
