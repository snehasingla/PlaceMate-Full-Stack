import React from 'react';
import { Clock, RefreshCcw } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function RevisionPreviewPanel({ visible }) {
  if (!visible) return null;

  const stages = [
    { name: 'Fresh Recall', days: 2, color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' },
    { name: 'Strengthen', days: 7, color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800' },
    { name: 'Mastery', days: 15, color: 'bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400 border-purple-200 dark:border-purple-800' },
  ];

  return (
    <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-900/10 border border-indigo-200 dark:border-indigo-800/50 space-y-3">
      <div className="flex items-center gap-2">
        <RefreshCcw className="h-4 w-4 text-indigo-500" />
        <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">
          Revision Schedule Preview
        </span>
      </div>
      <p className="text-xs text-indigo-600/70 dark:text-indigo-300/60">
        Completing this task will auto-schedule 3 spaced revision sessions:
      </p>
      <div className="flex flex-col gap-1.5">
        {stages.map(s => (
          <div key={s.name} className={cn("flex items-center justify-between px-3 py-2 rounded-lg border text-xs font-semibold", s.color)}>
            <span>{s.name}</span>
            <span className="flex items-center gap-1 opacity-70">
              <Clock className="h-3 w-3" /> +{s.days} days after completion
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
