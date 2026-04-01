import React, { useMemo, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { csSubjectsData } from '../data/csSubjects';
import { 
  BookOpen, ArrowRight, LayoutGrid, Database, Network, Cpu, 
  Briefcase, Cloud, Terminal, Calculator, GitMerge, Orbit 
} from 'lucide-react';
import { cn } from '../utils/cn';
import subjectService from '../services/subjectService';

const iconMap = {
  os: LayoutGrid,
  dbms: Database,
  cn: Network,
  oop: Cpu,
  sdlc: GitMerge,
  linux: Terminal,
  system_design: Orbit,
  cloud: Cloud,
  aptitude: Briefcase,
  linear_algebra: Calculator,
  math: Calculator
};

const gradientMap = {
  os: "from-blue-500 to-cyan-500",
  dbms: "from-emerald-500 to-teal-500",
  cn: "from-purple-500 to-pink-500",
  oop: "from-amber-500 to-orange-500",
  sdlc: "from-blue-600 to-indigo-600",
  linux: "from-zinc-600 to-zinc-800",
  system_design: "from-violet-500 to-fuchsia-500",
  cloud: "from-sky-400 to-blue-500",
  aptitude: "from-indigo-400 to-blue-500",
  linear_algebra: "from-rose-400 to-red-500",
  math: "from-orange-400 to-red-400"
};

const Subjects = () => {
  // Convert object dict to array for mapping
  const subjectsArray = Object.values(csSubjectsData);
  const [subjectProgress, setSubjectProgress] = useState({});

  useEffect(() => {
    let mounted = true;

    const loadProgress = async () => {
      try {
        const progressDocs = await subjectService.getSubjects();
        if (!mounted) return;

        const progressMap = progressDocs.reduce((acc, doc) => {
          const staticSubject = subjectsArray.find((subject) => subject.title === doc.subject);
          if (!staticSubject) return acc;

          const completedTopics = Array.isArray(doc.topics)
            ? doc.topics.filter((topic) => topic.status === 'completed').length
            : 0;

          acc[staticSubject.id] = completedTopics;
          return acc;
        }, {});

        setSubjectProgress(progressMap);
      } catch (error) {
        console.error('Unable to load subject progress', error);
      }
    };

    loadProgress();
    return () => {
      mounted = false;
    };
  }, [subjectsArray]);

  // Group by category
  const categories = subjectsArray.reduce((acc, subject) => {
    if (!acc[subject.category]) {
      acc[subject.category] = [];
    }
    acc[subject.category].push(subject);
    return acc;
  }, {});

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-12">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
          <BookOpen className="h-8 w-8 text-indigo-500" />
          Study Workspace
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-2xl">
          Master the fundamentals required for top-tier swe interviews. Select a module below to track your syllabus, revise key topics, and store revision notes.
        </p>
      </div>
      
      {/* Category Sections */}
      {Object.entries(categories).map(([categoryName, subjects]) => (
        <section key={categoryName}>
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white uppercase">
              {categoryName}
            </h2>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject) => {
              const Icon = iconMap[subject.id] || BookOpen;
              const bgGradient = gradientMap[subject.id] || "from-gray-500 to-gray-600";

              return (
                <Link 
                  key={subject.id} 
                  to={`/subjects/${subject.id}`}
                  className="group relative flex flex-col bg-white dark:bg-gray-900/50 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 transition-all hover:shadow-xl hover:-translate-y-1 overflow-hidden"
                >
                  {/* Subtle top glow line */}
                  <div className={cn("absolute top-0 left-0 right-0 h-1 bg-gradient-to-r opacity-70", bgGradient)} />
                  
                  <div className="flex items-start justify-between mb-4">
                    <div className={cn("p-3 rounded-xl scale-100 group-hover:scale-110 transition-transform bg-gradient-to-br text-white shadow-md", bgGradient)}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 dark:bg-gray-800 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/20 transition-colors">
                      <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{subject.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 flex-1">{subject.description}</p>
                  
                  <div className="mt-6 pt-4 border-t border-gray-50 dark:border-gray-800/80 flex items-center justify-between text-sm">
                    <div className="flex flex-col">
                      <span className="text-gray-400 dark:text-gray-500 font-medium text-xs uppercase tracking-wider mb-1">Progress</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{subjectProgress[subject.id] || 0} / {subject.topics.length} Topics</span>
                    </div>
                    <div className="h-2 w-24 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.round(((subjectProgress[subject.id] || 0) / subject.topics.length) * 100) || 0}%` }} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
};

export default Subjects;
