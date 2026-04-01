import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutTemplate, ChevronDown, ChevronUp, Zap } from 'lucide-react';
import { cn } from '../../utils/cn';
import taskService from '../../services/taskService';
import toast from 'react-hot-toast';

const TEMPLATES = [
  {
    id: 'dsa-day',
    name: 'DSA-Focused Day',
    description: 'Heavy problem-solving day with 3 structured blocks',
    color: 'from-blue-500 to-cyan-500',
    tasks: [
      { title: 'Review yesterday\'s DSA concepts', category: 'DSA', timeBlock: 'Morning', priority: 'High', effort: 'Short' },
      { title: 'Solve 5 medium DSA problems', category: 'DSA', timeBlock: 'Morning', priority: 'High', effort: 'Long' },
      { title: 'LeetCode contest or timed set', category: 'DSA', timeBlock: 'Afternoon', priority: 'High', effort: 'Long' },
      { title: 'Review solutions & patterns', category: 'DSA', timeBlock: 'Evening', priority: 'Medium', effort: 'Medium' },
    ],
  },
  {
    id: 'core-cs-day',
    name: 'Core CS Day',
    description: 'Deep dive into OS, DBMS, CN, or OOP',
    color: 'from-emerald-500 to-teal-500',
    tasks: [
      { title: 'Read and annotate core subject chapter', category: 'Core Subject', timeBlock: 'Morning', priority: 'High', effort: 'Medium' },
      { title: 'Create flashcards from key concepts', category: 'Core Subject', timeBlock: 'Afternoon', priority: 'Medium', effort: 'Short' },
      { title: 'Attempt topic-wise past questions', category: 'Core Subject', timeBlock: 'Afternoon', priority: 'High', effort: 'Medium' },
      { title: 'Review and consolidate notes', category: 'Core Subject', timeBlock: 'Evening', priority: 'Medium', effort: 'Short' },
    ],
  },
  {
    id: 'interview-day',
    name: 'Interview Prep Day',
    description: 'System design + aptitude + mock interview',
    color: 'from-purple-500 to-fuchsia-500',
    tasks: [
      { title: 'System design case walkthrough', category: 'Core Subject', timeBlock: 'Morning', priority: 'High', effort: 'Long' },
      { title: 'Aptitude timed drill (30 problems)', category: 'Aptitude', timeBlock: 'Afternoon', priority: 'High', effort: 'Medium' },
      { title: 'Mock interview (2 DSA + 1 behavioral)', category: 'Mock Interview', timeBlock: 'Afternoon', priority: 'High', effort: 'Long' },
      { title: 'Reflect on mock + note weak spots', category: 'Revision', timeBlock: 'Evening', priority: 'Medium', effort: 'Short' },
    ],
  },
  {
    id: 'mixed-day',
    name: 'Mixed Prep Day',
    description: 'Balanced across DSA, core subjects, and aptitude',
    color: 'from-amber-500 to-orange-500',
    tasks: [
      { title: 'Morning DSA — 2 problems', category: 'DSA', timeBlock: 'Morning', priority: 'Medium', effort: 'Medium' },
      { title: 'Core subject revision session', category: 'Core Subject', timeBlock: 'Morning', priority: 'Medium', effort: 'Medium' },
      { title: 'Aptitude or math practice', category: 'Aptitude', timeBlock: 'Afternoon', priority: 'Low', effort: 'Short' },
      { title: 'Company research or application tracking', category: 'Company Prep', timeBlock: 'Evening', priority: 'Low', effort: 'Short' },
    ],
  },
];

export default function PlannerTemplateSelector({ currentDate, onTasksAdded }) {
  const [isOpen, setIsOpen] = useState(false);
  const [applying, setApplying] = useState(null);

  const applyTemplate = async (template) => {
    setApplying(template.id);
    try {
      await Promise.all(template.tasks.map(t =>
        taskService.createTask({
          ...t,
          date: currentDate,
          description: '',
          relatedSubject: '',
          relatedTopic: '',
          shouldGenerateRevision: false,
        })
      ));
      toast.success(`"${template.name}" applied! ${template.tasks.length} tasks added.`);
      setIsOpen(false);
      onTasksAdded();
    } catch {
      toast.error('Failed to apply template');
    } finally {
      setApplying(null);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/40 overflow-hidden">
      <button type="button" onClick={() => setIsOpen(p => !p)}
        className="w-full flex items-center justify-between px-5 py-4"
      >
        <div className="flex items-center gap-3">
          <div className={cn("p-2 rounded-xl transition-colors", isOpen ? "bg-indigo-100 dark:bg-indigo-500/20" : "bg-gray-100 dark:bg-gray-800")}>
            <LayoutTemplate className={cn("h-4 w-4", isOpen ? "text-indigo-600 dark:text-indigo-400" : "text-gray-500")} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900 dark:text-white text-left">Planner Templates</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 text-left">Quick-start your day with a preset plan</p>
          </div>
        </div>
        {isOpen ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div key="templates"
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }} className="overflow-hidden"
          >
            <div className="px-5 pb-5 border-t border-gray-100 dark:border-gray-800 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {TEMPLATES.map(tmpl => (
                <div key={tmpl.id}
                  className="group rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30 overflow-hidden hover:border-indigo-200 dark:hover:border-indigo-800/60 transition-all"
                >
                  <div className={cn("h-1 w-full bg-gradient-to-r", tmpl.color)} />
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100">{tmpl.name}</h4>
                      <span className="text-[9px] font-bold text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full ml-2 shrink-0">
                        {tmpl.tasks.length} tasks
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{tmpl.description}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {[...new Set(tmpl.tasks.map(t => t.timeBlock))].map(b => (
                        <span key={b} className="text-[9px] font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                          {b}
                        </span>
                      ))}
                    </div>
                    <button onClick={() => applyTemplate(tmpl)} disabled={applying === tmpl.id}
                      className="w-full flex items-center justify-center gap-1.5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white text-xs font-bold rounded-lg transition-all"
                    >
                      <Zap className="h-3.5 w-3.5" />
                      {applying === tmpl.id ? 'Applying...' : 'Apply Template'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
