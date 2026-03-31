import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Tag, CheckCircle2, Circle, Clock, FastForward } from 'lucide-react';
import { cn } from '../../utils/cn';

const stageColors = {
  1: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
  2: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800',
  3: 'bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400 border-purple-200 dark:border-purple-800',
};

export default function RevisionCard({ revision, onStatusChange, onSnooze }) {
  const isCompleted = revision.status === 'completed';

  const isOverdue = new Date(revision.date) < new Date(new Date().setHours(0,0,0,0));
  const isToday = new Date(revision.date).toLocaleDateString() === new Date().toLocaleDateString();

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.01 }}
      className={cn(
        "group relative flex items-start gap-4 rounded-2xl p-5 border transition-all duration-200",
        isCompleted 
          ? "bg-gray-50/50 border-gray-100 dark:bg-gray-900/20 dark:border-gray-800/50 opacity-60 hover:opacity-100" 
          : "bg-white border-gray-100 dark:bg-gray-900/50 dark:border-gray-800 shadow-sm hover:shadow-md hover:border-indigo-100 dark:hover:border-indigo-900/50"
      )}
    >
      <button 
        onClick={() => onStatusChange(revision._id, isCompleted ? 'pending' : 'completed')}
        className="mt-1 flex-shrink-0 text-gray-400 hover:text-indigo-500 dark:text-gray-500 dark:hover:text-indigo-400 transition-colors"
      >
        {isCompleted ? (
          <CheckCircle2 className="h-6 w-6 text-emerald-500" />
        ) : (
          <Circle className="h-6 w-6" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className={cn(
            "px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase border", 
            stageColors[revision.revisionStage] || stageColors[1]
          )}>
            Stage {revision.revisionStage}
          </span>
          <h3 className={cn(
            "text-base font-semibold truncate transition-colors",
            isCompleted ? "text-gray-500 line-through dark:text-gray-500" : "text-gray-900 dark:text-gray-100",
            !isCompleted && isOverdue && "text-red-600 dark:text-red-400"
          )}>
            {revision.title}
          </h3>
          {revision.relatedSubject && (
            <span className="bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 px-2 py-0.5 text-[10px] font-medium rounded-md">
              {revision.relatedSubject}
            </span>
          )}
        </div>
        
        {revision.description && (
          <p className={cn(
            "text-sm mb-3 font-medium",
            isCompleted ? "text-gray-400/70" : "text-gray-500 dark:text-gray-400"
          )}>
            {revision.description}
          </p>
        )}

        <div className="flex items-center gap-4 text-xs font-medium mt-3">
          <div className={cn("flex items-center gap-1.5", 
            !isCompleted && isOverdue ? "text-red-500 font-semibold" :
            !isCompleted && isToday ? "text-indigo-500 font-semibold" :
            "text-gray-500 dark:text-gray-400"
          )}>
            <Calendar className="h-3.5 w-3.5" />
            {isOverdue && !isCompleted ? 'Overdue - ' : ''}
            {new Date(revision.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 items-end justify-center opacity-0 group-hover:opacity-100 transition-opacity absolute top-4 right-4">
        {!isCompleted && (
          <button 
            onClick={() => onSnooze(revision._id)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 dark:text-amber-400 dark:bg-amber-500/10 dark:hover:bg-amber-500/20 rounded-lg transition-colors font-medium border border-amber-200/50 dark:border-amber-500/20"
            title="Snooze for 1 Day"
          >
            <Clock className="h-3.5 w-3.5" /> Snooze
          </button>
        )}
      </div>
    </motion.div>
  );
}
