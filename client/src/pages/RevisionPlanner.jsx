import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCcw, Bell, AlertCircle, CheckCircle2, Calendar } from 'lucide-react';
import taskService from '../services/taskService';
import RevisionCard from '../components/planner/RevisionCard';
import toast from 'react-hot-toast';

export default function RevisionPlanner() {
  const [revisions, setRevisions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRevisions = async () => {
    setLoading(true);
    try {
      const data = await taskService.getRevisions();
      setRevisions(data);
    } catch (error) {
      toast.error('Failed to load revisions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevisions();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      setRevisions(prev => prev.map(r => r._id === id ? { ...r, status } : r));
      await taskService.updateTask(id, { status });
      if(status === 'completed') toast.success("Revision completed!");
    } catch {
      toast.error("Error updating revision status");
      fetchRevisions();
    }
  };

  const handleSnooze = async (id) => {
    try {
      // Optimitistic logic: add 1 day to the current date of the task
      const target = revisions.find(r => r._id === id);
      const newDate = new Date(target.date);
      newDate.setDate(newDate.getDate() + 1);

      setRevisions(prev => prev.map(r => r._id === id ? { ...r, date: newDate.toISOString() } : r));
      await taskService.updateTask(id, { date: newDate.toISOString() });
      toast("Snoozed 1 day", { icon: '⏲️' });
    } catch {
      toast.error("Failed to snooze revision");
      fetchRevisions();
    }
  };

  const todayStr = new Date().toDateString();

  const getDayMarker = () => {
    const today = new Date();
    today.setHours(0,0,0,0);
    return today.getTime();
  };

  // Grouping
  const categorized = revisions.reduce((acc, obj) => {
    if (obj.status === 'completed') {
      acc.completed.push(obj);
      return acc;
    }
    const itemDate = new Date(obj.date).setHours(0,0,0,0);
    const today = getDayMarker();

    if (itemDate < today) acc.overdue.push(obj);
    else if (itemDate === today) acc.today.push(obj);
    else acc.upcoming.push(obj);
    return acc;
  }, { overdue: [], today: [], upcoming: [], completed: [] });

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-900 to-purple-900 border border-indigo-500/20 rounded-2xl p-8 shadow-sm">
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
          <RefreshCcw className="h-8 w-8 text-indigo-300" />
          Revision Generator
        </h1>
        <p className="max-w-2xl mt-3 text-indigo-100/80 leading-relaxed font-medium">
          Automatically generated from your Daily Planner. Tasks marked for **Auto-Revision** will appear here at Phase 1 (2 Days), Phase 2 (7 Days), and Phase 3 (15 Days).
        </p>
      </div>

      {!loading && revisions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 bg-white dark:bg-gray-900/40 border border-dashed border-gray-300 dark:border-gray-800 rounded-2xl">
          <div className="h-16 w-16 bg-gray-50 dark:bg-gray-800/50 rounded-full flex items-center justify-center mb-4">
            <RefreshCcw className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-gray-900 dark:text-white font-semibold">No Auto-Revisions Scheduled</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 text-center max-w-sm">
            Toggle the "Auto-Revision Schedule" switch when creating or editing items in the Daily Planner!
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          
          {/* OVERDUE SECTION */}
          {categorized.overdue.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-white uppercase tracking-wider">Overdue</h2>
                <span className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400 border border-red-200 dark:border-red-800">
                  {categorized.overdue.length}
                </span>
              </div>
              <div className="space-y-3">
                <AnimatePresence>
                  {categorized.overdue.map(r => (
                    <RevisionCard key={r._id} revision={r} onStatusChange={handleStatusChange} onSnooze={handleSnooze} />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* TODAY SECTION */}
          {categorized.today.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-indigo-500" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-white uppercase tracking-wider">Due Today</h2>
                <span className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                  {categorized.today.length}
                </span>
              </div>
              <div className="space-y-3">
                <AnimatePresence>
                  {categorized.today.map(r => (
                    <RevisionCard key={r._id} revision={r} onStatusChange={handleStatusChange} onSnooze={handleSnooze} />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* UPCOMING SECTION */}
          {categorized.upcoming.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-400" />
                <h2 className="text-lg font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Upcoming</h2>
              </div>
              <div className="space-y-3 opacity-90">
                <AnimatePresence>
                  {categorized.upcoming.map(r => (
                    <RevisionCard key={r._id} revision={r} onStatusChange={handleStatusChange} onSnooze={handleSnooze} />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* COMPLETED SECTION (Collapsed by default or small) */}
          {categorized.completed.length > 0 && (
            <div className="space-y-4 pt-10 border-t border-gray-100 dark:border-gray-800/60">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-white uppercase tracking-wider">Completed Revisions</h2>
                <span className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  {categorized.completed.length} Total
                </span>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
