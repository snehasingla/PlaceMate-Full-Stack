import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Trash2, Edit2, Zap, RefreshCcw, Clock, BookOpen } from 'lucide-react';
import { cn } from '../../utils/cn';

const CATEGORY_COLORS = {
  'DSA': 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
  'Core Subject': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
  'Revision': 'bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400',
  'Mock Interview': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400',
  'Company Prep': 'bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400',
  'Aptitude': 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400',
  'Math': 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
  'Custom': 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
};

const PRIORITY_BAR = { High: 'bg-red-500', Medium: 'bg-amber-400', Low: 'bg-blue-400' };
const PRIORITY_DOTS = { High: 'bg-red-500', Medium: 'bg-amber-400', Low: 'bg-blue-400' };
const TIME_BLOCK_COLORS = { Morning: 'text-orange-500', Afternoon: 'text-yellow-500', Evening: 'text-blue-500', Anytime: 'text-gray-400' };

export default function PlannerTaskCard({ task, onStatusChange, onDelete, onEdit }) {
  const isCompleted = task.status === 'completed';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        "group relative flex items-start gap-4 rounded-2xl p-4 border transition-all duration-200 pl-5",
        isCompleted
          ? "bg-gray-50/50 border-gray-100 dark:bg-gray-900/20 dark:border-gray-800/50 opacity-60 hover:opacity-100"
          : "bg-white border-gray-100 dark:bg-gray-900/50 dark:border-gray-800 shadow-sm hover:shadow-md hover:border-indigo-100 dark:hover:border-indigo-900/50"
      )}
    >
      {/* Priority left bar */}
      {!isCompleted && (
        <div className={cn("absolute left-0 top-3 bottom-3 w-1 rounded-r-full", PRIORITY_BAR[task.priority])} />
      )}

      {/* Complete toggle */}
      <button
        onClick={() => onStatusChange(task._id, isCompleted ? 'pending' : 'completed')}
        className="mt-0.5 flex-shrink-0 text-gray-300 hover:text-indigo-500 dark:text-gray-600 dark:hover:text-indigo-400 transition-colors"
      >
        {isCompleted ? <CheckCircle2 className="h-6 w-6 text-emerald-500" /> : <Circle className="h-6 w-6" />}
      </button>

      <div className="flex-1 min-w-0">
        {/* Title + badges */}
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <h3 className={cn("text-base font-semibold truncate max-w-xs",
            isCompleted ? "text-gray-400 line-through dark:text-gray-500" : "text-gray-900 dark:text-gray-100"
          )}>
            {task.title}
          </h3>
          <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase", CATEGORY_COLORS[task.category] || CATEGORY_COLORS['Custom'])}>
            {task.category}
          </span>
          {task.shouldGenerateRevision && (
            <span className={cn(
              "flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase border transition-all",
              isCompleted 
                ? "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
                : "bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-800/50"
            )}>
              <RefreshCcw className="h-2.5 w-2.5" /> 
              {isCompleted ? 'Revisions Scheduled' : 'Auto-Revise'}
            </span>
          )}
          {task.carriedForwardFrom && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-800/40">
              Carried over
            </span>
          )}
        </div>

        {/* Description */}
        {task.description && (
          <p className={cn("text-sm line-clamp-1 mb-2", isCompleted ? "text-gray-400/60" : "text-gray-500 dark:text-gray-400")}>
            {task.description}
          </p>
        )}

        {/* Subject / Topic context line */}
        {(task.relatedSubject || task.relatedTopic) && (
          <div className="flex items-center gap-1.5 mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">
            <BookOpen className="h-3.5 w-3.5" />
            {task.relatedSubject && <span>{task.relatedSubject}</span>}
            {task.relatedSubject && task.relatedTopic && <span className="text-gray-300 dark:text-gray-700">›</span>}
            {task.relatedTopic && <span>{task.relatedTopic}</span>}
          </div>
        )}

        {/* Meta row */}
        <div className="flex items-center flex-wrap gap-3 text-xs font-medium text-gray-400 dark:text-gray-500 mt-1">
          {task.timeBlock && task.timeBlock !== 'Anytime' && (
            <span className={cn("flex items-center gap-1", TIME_BLOCK_COLORS[task.timeBlock])}>
              <Clock className="h-3.5 w-3.5" /> {task.timeBlock}
            </span>
          )}
          {task.effort && (
            <span className="flex items-center gap-1">
              <Zap className="h-3.5 w-3.5 text-amber-400" /> {task.effort}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <span className={cn("h-2 w-2 rounded-full", PRIORITY_DOTS[task.priority])} />
            {task.priority}
          </span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-1.5 items-end opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        {onEdit && (
          <button onClick={() => onEdit(task)}
            className="p-1.5 text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
          >
            <Edit2 className="h-4 w-4" />
          </button>
        )}
        <button onClick={() => onDelete(task._id)}
          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}
