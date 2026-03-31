import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { csSubjectsData } from '../data/csSubjects';
import { ArrowLeft, BookOpen, CheckCircle2, ChevronDown, ChevronRight, FileText, Link as LinkIcon, Plus } from 'lucide-react';
import { cn } from '../utils/cn';

const SubjectDetail = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const subject = csSubjectsData[subjectId];

  const [activeTab, setActiveTab] = useState('topics'); // 'topics', 'notes', 'resources'
  const [expandedTopic, setExpandedTopic] = useState(null);

  if (!subject) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Subject Not Found</h2>
        <button onClick={() => navigate('/subjects')} className="text-indigo-600 hover:underline">
          Return to Subjects
        </button>
      </div>
    );
  }

  const toggleTopic = (id) => {
    setExpandedTopic(expandedTopic === id ? null : id);
  };

  return (
    <div className="max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="mb-8">
        <Link to="/subjects" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Subjects
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
              {subject.title}
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-2xl">
              {subject.description}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-all">
              <Plus className="h-4 w-4 mr-2" />
              Add Note
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 border-b border-gray-200 dark:border-gray-800 mb-8 overflow-x-auto hide-scrollbar">
        {['topics', 'notes', 'resources'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-5 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors",
              activeTab === tab
                ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-700"
            )}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {/* TOPICS TAB */}
        {activeTab === 'topics' && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-900/50 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden text-sm">
              <div className="grid grid-cols-12 gap-4 p-4 font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/80">
                <div className="col-span-6 md:col-span-7">Topic</div>
                <div className="col-span-3 md:col-span-2 text-center">Importance</div>
                <div className="col-span-3 text-center">Status</div>
              </div>
              
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {subject.topics.map((topic) => (
                  <div key={topic.id} className="group">
                    <div 
                      onClick={() => toggleTopic(topic.id)}
                      className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
                    >
                      <div className="col-span-6 md:col-span-7 flex items-center font-semibold text-gray-900 dark:text-gray-100">
                        <button className="mr-3 text-gray-400 hover:text-indigo-600 focus:outline-none transition-colors">
                          {expandedTopic === topic.id ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                        </button>
                        {topic.title}
                      </div>
                      <div className="col-span-3 md:col-span-2 text-center">
                        <span className={cn(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                          topic.importance === "Critical" ? "bg-red-50 text-red-700 border-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20" :
                          topic.importance === "High" ? "bg-orange-50 text-orange-700 border-orange-100 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20" :
                          "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20"
                        )}>
                          {topic.importance}
                        </span>
                      </div>
                      <div className="col-span-3 text-center flex justify-center">
                        <button className="flex items-center justify-center h-8 px-3 rounded-md bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors text-xs font-semibold">
                          Pending
                        </button>
                      </div>
                    </div>
                    
                    {/* Expanded Subtopics */}
                    {expandedTopic === topic.id && (
                      <div className="bg-gray-50/50 dark:bg-gray-900/30 p-4 pl-14 border-t border-gray-50 dark:border-gray-800/50 text-sm text-gray-600 dark:text-gray-300">
                        <ul className="space-y-3">
                          {topic.subtopics.map((sub, idx) => (
                            <li key={idx} className="flex items-center gap-3">
                              <div className="h-4 w-4 rounded border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:border-indigo-500 cursor-pointer">
                                {/* Check icon goes here when true */}
                              </div>
                              {sub}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* NOTES TAB */}
        {activeTab === 'notes' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="col-span-full bg-white dark:bg-gray-900/40 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 p-12 flex flex-col items-center justify-center text-center">
              <div className="h-16 w-16 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-indigo-500 dark:text-indigo-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No Notes Yet</h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400 max-w-sm">
                You haven't added any notes for {subject.title}. Keep all your quick revision formulas, definitions, and snippets organized right here.
              </p>
              <button className="mt-6 inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-all">
                Create First Note
              </button>
            </div>
          </div>
        )}

        {/* RESOURCES TAB */}
        {activeTab === 'resources' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {subject.resources.map(res => (
              <a 
                href={res.url}
                target="_blank"
                rel="noreferrer"
                key={res.id} 
                className="group flex items-start gap-4 bg-white dark:bg-gray-900/50 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-indigo-200 dark:hover:border-indigo-800/50 hover:shadow-md transition-all"
              >
                <div className="h-12 w-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/30 transition-colors">
                  {res.type === 'video' ? <BookOpen className="h-6 w-6 text-indigo-600 dark:text-indigo-400" /> : 
                   res.type === 'pdf' ? <FileText className="h-6 w-6 text-red-500" /> :
                   <LinkIcon className="h-6 w-6 text-blue-500" />}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {res.title}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 capitalize">
                    {res.type} Resource
                  </p>
                </div>
              </a>
            ))}
            
            {/* Add Custom Resource Card */}
            <button className="flex flex-col items-center justify-center h-[104px] rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/20 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all group">
              <div className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                <Plus className="h-5 w-5 mr-2" /> Add Custom Resource
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectDetail;
