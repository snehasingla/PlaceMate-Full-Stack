import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Tag, CheckCircle2, Circle, MoreVertical, Trash2, Edit2, Clock } from 'lucide-react';
import { cn } from '../../utils/cn';

const categoryColors = {
  'DSA': 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
  'Core Subject': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
  'Revision': 'bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400',
  'Mock Interview': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400',
  'Company Prep': 'bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400',
  'Aptitude': 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400',
  'Math': 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
  'Custom': 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
};

const priorityColors = {
  'High': 'text-red-500',
  'Medium': 'text-amber-500',
  'Low': 'text-blue-500',
};

export default function PlannerTaskCard({ task, onStatusChange, onDelete }) {
  const isCompleted = task.status === 'completed';

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.01 }}
      className={cn(
        "group relative flex items-start gap-4 rounded-2xl p-4 border transition-all duration-200",
        isCompleted 
          ? "bg-gray-50/50 border-gray-100 dark:bg-gray-900/20 dark:border-gray-800/50 opacity-60 hover:opacity-100" 
          : "bg-white border-gray-100 dark:bg-gray-900/50 dark:border-gray-800 shadow-sm hover:shadow-md hover:border-indigo-100 dark:hover:border-indigo-900/50"
      )}
    >
      <button 
        onClick={() => onStatusChange(task._id, isCompleted ? 'pending' : 'completed')}
        className="mt-1 flex-shrink-0 text-gray-400 hover:text-indigo-500 dark:text-gray-500 dark:hover:text-indigo-400 transition-colors"
      >
        {isCompleted ? (
          <CheckCircle2 className="h-6 w-6 text-emerald-500" />
        ) : (
          <Circle className="h-6 w-6" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className={cn(
            "text-base font-semibold truncate transition-colors",
            isCompleted ? "text-gray-500 line-through dark:text-gray-500" : "text-gray-900 dark:text-gray-100"
          )}>
            {task.title}
          </h3>
          <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase", categoryColors[task.category] || categoryColors['Custom'])}>
            {task.category}
          </span>
          {task.shouldGenerateRevision && !isCompleted && (
             <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-indigo-50 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400">
               Auto-Revise
             </span>
          )}
        </div>
        
        {task.description && (
          <p className={cn(
            "text-sm line-clamp-2 mb-3",
            isCompleted ? "text-gray-400/70" : "text-gray-500 dark:text-gray-400"
          )}>
            {task.description}
          </p>
        )}

        <div className="flex items-center gap-4 text-xs font-medium text-gray-500 dark:text-gray-400 mt-2">
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {new Date(task.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric'})}
          </div>
          <div className="flex items-center gap-1">
            <span className={cn("h-2 w-2 rounded-full", priorityColors[task.priority])} />
            {task.priority} Priority
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity absolute top-4 right-4">
        <button 
          onClick={() => onDelete(task._id)}
          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}
