import React from 'react';
import { Target, TrendingUp, Calendar, Activity, Award } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function PreparationInsights({ revisions }) {
  if (!revisions || revisions.length === 0) return null;

  const completed = revisions.filter(r => r.status === 'completed');
  const focusZone = revisions.filter(r => r.needsMoreFocus);

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const thisWeek = completed.filter(r => new Date(r.updatedAt || new Date()) > oneWeekAgo);

  const weak = completed.filter(r => r.confidence === 'Weak').length;
  const okay = completed.filter(r => r.confidence === 'Okay').length;
  const strong = completed.filter(r => r.confidence === 'Strong').length;

  let level = 'Needs Work';
  let levelColor = 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400 border-rose-200 dark:border-rose-800';
  if (completed.length === 0) {
    level = 'No Data Yet';
    levelColor = 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700';
  } else if (strong / completed.length > 0.7) {
    level = 'Strong Mastery';
    levelColor = 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
  } else if ((strong + okay) / completed.length > 0.6) {
    level = 'Good Consistency';
    levelColor = 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800';
  } else if (okay > weak) {
    level = 'Improving Gradually';
    levelColor = 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 border-amber-200 dark:border-amber-800';
  }

  const mostPostponed = revisions.filter(r => r.snoozeCount > 0).sort((a, b) => b.snoozeCount - a.snoozeCount)[0];

  return (
    <div className="bg-gray-50/50 dark:bg-gray-900/30 rounded-3xl p-6 border border-gray-100 dark:border-gray-800">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 rounded-xl">
          <Activity className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Preparation Insights</h2>
          <p className="text-xs text-gray-500 font-medium">Auto-calculated from your revision history</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-950 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Award className="h-4 w-4 text-gray-400" />
            <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Overall Level</h3>
          </div>
          <div className={cn("inline-flex px-3 py-1 rounded-lg text-sm font-bold border", levelColor)}>{level}</div>
        </div>

        <div className="bg-white dark:bg-gray-950 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <Target className="h-4 w-4 text-rose-400" />
            <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Needs Focus</h3>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-gray-900 dark:text-white">{focusZone.length}</span>
            <span className="text-xs font-medium text-gray-500">active topics</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-950 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Weekly Momentum</h3>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-gray-900 dark:text-white">{thisWeek.length}</span>
            <span className="text-xs font-medium text-gray-500">completed</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-950 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="h-4 w-4 text-amber-400" />
            <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Most Postponed</h3>
          </div>
          {mostPostponed ? (
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-gray-200 truncate">{mostPostponed.title}</p>
              <p className="text-xs text-amber-600 dark:text-amber-500 mt-0.5 font-medium bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-800/50 inline-block px-1.5 rounded">
                Snoozed {mostPostponed.snoozeCount}×
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic">None yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
