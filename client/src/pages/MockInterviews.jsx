import React from 'react';

const MockInterviews = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mock Interviews</h1>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          New Session
        </button>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
          No mock interview sessions recorded. Schedule one to practice!
        </div>
      </div>
    </div>
  );
};

export default MockInterviews;
