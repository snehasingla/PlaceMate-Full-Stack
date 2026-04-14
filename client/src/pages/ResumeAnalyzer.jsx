import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, FileText, Briefcase, Sparkles, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import aiService from '../services/aiService';

const ResumeAnalyzer = () => {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  const handleAnalyze = async () => {
    if (!resumeText.trim() || !jobDescription.trim()) {
      toast.error('Please provide both resume text and job description.');
      return;
    }

    setLoading(true);
    setFeedback(null);
    try {
      const result = await aiService.analyzeResume(resumeText, jobDescription);
      setFeedback(result.feedback);
      toast.success('Analysis complete!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to analyze resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="max-w-6xl mx-auto space-y-6 pb-8"
    >
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 flex items-center gap-2">
            <Bot className="w-8 h-8 text-blue-500" />
            AI Resume Analyzer
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Tailor your resume for specific job roles using AI-powered ATS analysis.
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="bg-white dark:bg-gray-900/50 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white mb-3">
              <FileText className="w-4 h-4 text-blue-500" />
              Your Resume (Text)
            </label>
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your resume text here (experience, skills, projects)..."
              className="w-full h-48 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none transition-all"
            />
          </div>

          <div className="bg-white dark:bg-gray-900/50 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white mb-3">
              <Briefcase className="w-4 h-4 text-purple-500" />
              Target Job Description
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description from the company portal or LinkedIn..."
              className="w-full h-48 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none transition-all"
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analyzing with AI...
              </div>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Review
              </>
            )}
          </button>
        </motion.div>

        {/* Output Section */}
        <motion.div variants={itemVariants} className="bg-white dark:bg-gray-900/50 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 h-full min-h-[600px] flex flex-col">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-gray-800 pb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-indigo-500" />
            Analysis Results
          </h2>
          
          <div className="flex-1 overflow-y-auto">
            {!feedback && !loading ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                <Bot className="w-16 h-16 text-gray-400" />
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
                  Paste your resume and the target job description to get AI-powered insights, keyword matching, and improvement suggestions.
                </p>
              </div>
            ) : loading ? (
              <div className="h-full flex flex-col items-center justify-center space-y-4">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-indigo-200 dark:border-indigo-900 rounded-full"></div>
                  <div className="w-16 h-16 border-4 border-indigo-600 dark:border-indigo-500 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
                </div>
                <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 animate-pulse">
                  Scanning for keywords and ATS matches...
                </p>
              </div>
            ) : (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                {feedback.split('\n').map((line, i) => {
                  if (line.trim() === '') return <div key={i} className="h-2"></div>;
                  
                  // Helper to parse basic markdown to HTML
                  const formatText = (text) => {
                    return text
                      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900 dark:text-gray-100">$1</strong>') // Bold
                      .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
                      .replace(/`(.*?)`/g, '<code class="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded text-sm font-mono border border-indigo-100 dark:border-indigo-500/20">$1</code>'); // Inline Code
                  };

                  if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500 mt-6 mb-4">{line.slice(4)}</h3>;
                  if (line.startsWith('#### ')) return <h4 key={i} className="text-md font-semibold text-gray-800 dark:text-gray-200 mt-6 mb-3 border-b border-gray-100 dark:border-gray-800 pb-2">{line.slice(5)}</h4>;
                  if (line.startsWith('- ')) return <li key={i} className="ml-5 text-gray-600 dark:text-gray-300 mb-2 list-disc marker:text-indigo-500" dangerouslySetInnerHTML={{ __html: formatText(line.slice(2)) }} />;
                  return <p key={i} className="text-gray-600 dark:text-gray-300 mb-3 leading-relaxed" dangerouslySetInnerHTML={{ __html: formatText(line) }} />;
                })}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ResumeAnalyzer;
