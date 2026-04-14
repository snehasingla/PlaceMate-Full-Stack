import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle2, Circle, Clock, BookOpen, Target, AlertTriangle } from 'lucide-react';
import { cn } from '../../utils/cn';

const STAGE_COLORS = {
  1: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
  2: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800',
  3: 'bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400 border-purple-200 dark:border-purple-800',
};

export default function RevisionCard({ revision, onStatusChange, onSnooze }) {
  const isCompleted = revision.status === 'completed';
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const dueDate = new Date(revision.date); dueDate.setHours(0, 0, 0, 0);
  const isOverdue = !isCompleted && dueDate < today;
  const isToday = !isCompleted && dueDate.getTime() === today.getTime();

  const stageBadge = revision.sourceType === 'custom'
    ? { label: 'Custom Plan', cls: 'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-500/10 dark:text-fuchsia-400 border-fuchsia-200 dark:border-fuchsia-800' }
    : { label: revision.stageName || `Stage ${revision.revisionStage}`, cls: STAGE_COLORS[revision.revisionStage] || STAGE_COLORS[1] };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        "group relative flex items-start gap-4 rounded-2xl p-5 border transition-all duration-200",
        isCompleted
          ? "bg-gray-50/50 border-gray-100 dark:bg-gray-900/20 dark:border-gray-800/50 opacity-60 hover:opacity-100"
          : revision.needsMoreFocus
            ? "bg-amber-50/40 border-amber-200 dark:bg-amber-900/10 dark:border-amber-800/50 shadow-sm"
            : isOverdue
              ? "bg-red-50/30 border-red-200 dark:bg-red-900/10 dark:border-red-800/40 shadow-sm"
              : "bg-white border-gray-100 dark:bg-gray-900/50 dark:border-gray-800 shadow-sm hover:shadow-md hover:border-indigo-100 dark:hover:border-indigo-900/50"
      )}
    >
      {/* Complete toggle */}
      <button
        onClick={() => onStatusChange(revision._id, isCompleted ? 'pending' : 'completed')}
        className="mt-0.5 flex-shrink-0 text-gray-300 hover:text-indigo-500 dark:text-gray-600 dark:hover:text-indigo-400 transition-colors"
      >
        {isCompleted ? <CheckCircle2 className="h-6 w-6 text-emerald-500" /> : <Circle className="h-6 w-6" />}
      </button>

      <div className="flex-1 min-w-0">
        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase border", stageBadge.cls)}>
            {stageBadge.label}
          </span>
          {revision.needsMoreFocus && !isCompleted && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50">
              <Target className="h-2.5 w-2.5" /> Needs Focus
            </span>
          )}
          {isOverdue && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400 border border-red-200/60">
              <AlertTriangle className="h-2.5 w-2.5" /> Overdue
            </span>
          )}
        </div>

        <h3 className={cn("text-base font-semibold mb-1",
          isCompleted ? "text-gray-400 line-through dark:text-gray-500" : "text-gray-900 dark:text-gray-100"
        )}>
          {revision.title}
        </h3>

        {(revision.relatedSubject || revision.relatedTopic) && (
          <div className="flex items-center gap-1.5 mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">
            <BookOpen className="h-3.5 w-3.5" />
            {revision.relatedSubject && <span>{revision.relatedSubject}</span>}
            {revision.relatedSubject && revision.relatedTopic && <span className="text-gray-300 dark:text-gray-700">›</span>}
            {revision.relatedTopic && <span>{revision.relatedTopic}</span>}
          </div>
        )}

        {isCompleted && revision.reflectionNote && (
          <div className="mt-2 mb-2 px-3 py-2 bg-gray-50 dark:bg-gray-800/40 rounded-xl border border-gray-100 dark:border-gray-800">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Reflection Note</p>
            <p className="text-sm italic text-gray-500 dark:text-gray-400">"{revision.reflectionNote}"</p>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 text-xs font-medium mt-2">
          {isCompleted && revision.confidence && (
            <span className={cn("px-2 py-0.5 rounded-md font-bold uppercase text-[10px]",
              revision.confidence === 'Strong' ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
              : revision.confidence === 'Okay' ? "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
              : "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400"
            )}>
              {revision.confidence} Confidence
            </span>
          )}
          <span className={cn("flex items-center gap-1",
            isOverdue ? "text-red-500 font-semibold" : isToday ? "text-indigo-500 font-semibold" : "text-gray-400 dark:text-gray-500"
          )}>
            <Calendar className="h-3.5 w-3.5" />
            {new Date(revision.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
          {(revision.snoozeCount || 0) > 0 && (
            <span className="flex items-center gap-1 text-amber-500">
              <Clock className="h-3.5 w-3.5" /> Snoozed {revision.snoozeCount}×
            </span>
          )}
        </div>
      </div>

      {!isCompleted && (
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onSnooze(revision._id)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-amber-600 bg-amber-50 hover:bg-amber-100 dark:text-amber-400 dark:bg-amber-500/10 dark:hover:bg-amber-500/20 rounded-lg transition-colors font-semibold border border-amber-200/50 dark:border-amber-500/20"
          >
            <Clock className="h-3.5 w-3.5" /> Snooze
          </button>
        </div>
      )}
    </motion.div>
  );
}
