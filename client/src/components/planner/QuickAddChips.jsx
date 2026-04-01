import React from 'react';
import { cn } from '../../utils/cn';

const CHIPS = [
  { label: 'DSA', value: 'DSA', color: 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200 dark:border-blue-500/20' },
  { label: 'Core Subject', value: 'Core Subject', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' },
  { label: 'Revision', value: 'Revision', color: 'bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400 border-purple-200 dark:border-purple-500/20' },
  { label: 'Mock Interview', value: 'Mock Interview', color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/20' },
  { label: 'Aptitude', value: 'Aptitude', color: 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border-rose-200 dark:border-rose-500/20' },
  { label: 'Company Prep', value: 'Company Prep', color: 'bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400 border-orange-200 dark:border-orange-500/20' },
  { label: 'Math', value: 'Math', color: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200 dark:border-amber-500/20' },
];

export default function QuickAddChips({ activeCategory, onSelect }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
        Quick Category
      </label>
      <div className="flex flex-wrap gap-2">
        {CHIPS.map(chip => (
          <button
            key={chip.value}
            type="button"
            onClick={() => onSelect(chip.value)}
            className={cn(
              "px-3 py-1.5 rounded-xl text-xs font-bold border transition-all",
              chip.color,
              activeCategory === chip.value
                ? "ring-2 ring-offset-1 ring-indigo-500 dark:ring-offset-gray-900"
                : "opacity-70 hover:opacity-100"
            )}
          >
            {chip.label}
          </button>
        ))}
      </div>
    </div>
  );
}
