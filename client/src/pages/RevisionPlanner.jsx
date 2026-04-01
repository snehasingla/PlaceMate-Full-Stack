import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCcw, Plus, CheckCircle2 } from 'lucide-react';
import taskService from '../services/taskService';
import RevisionCard from '../components/planner/RevisionCard';
import CustomRevisionForm from '../components/planner/CustomRevisionForm';
import RevisionCompletionModal from '../components/planner/RevisionCompletionModal';
import PreparationInsights from '../components/planner/PreparationInsights';
import toast from 'react-hot-toast';
import { cn } from '../utils/cn';

const TABS = [
  { key: 'due', label: 'Due & Overdue' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'focus', label: 'Need More Focus' },
  { key: 'completed', label: 'Completed' },
];

export default function RevisionPlanner() {
  const [revisions, setRevisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('due');
  const [isCustomFormOpen, setIsCustomFormOpen] = useState(false);
  const [pendingCompletion, setPendingCompletion] = useState(null);

  const fetchRevisions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await taskService.getRevisions();
      setRevisions(data);
    } catch {
      toast.error('Failed to load revisions');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchRevisions(); }, [fetchRevisions]);

  // Intercept completion → open reflection modal
  const handleStatusChange = async (id, status) => {
    if (status === 'completed') {
      setPendingCompletion(revisions.find(r => r._id === id));
      return;
    }
    try {
      setRevisions(prev => prev.map(r =>
        r._id === id ? { ...r, status, confidence: null, reflectionNote: '', needsMoreFocus: false } : r
      ));
      await taskService.updateTask(id, { status, confidence: null, reflectionNote: '', needsMoreFocus: false });
      toast('Marked as pending');
    } catch {
      toast.error('Failed to update');
      fetchRevisions();
    }
  };

  // Called after reflection modal submits
  const handleCompleteReflection = async (id, reflectionData) => {
    try {
      setRevisions(prev => prev.map(r => r._id === id ? { ...r, ...reflectionData } : r));
      await taskService.updateTask(id, reflectionData);
      toast.success('Revision completed & reflection saved!');
    } catch {
      toast.error('Failed to save');
      fetchRevisions();
    }
  };

  // Snooze: push +1 day
  const handleSnooze = async (id) => {
    try {
      const target = revisions.find(r => r._id === id);
      const newDate = new Date(target.date);
      newDate.setDate(newDate.getDate() + 1);
      const snoozeCount = (target.snoozeCount || 0) + 1;
      setRevisions(prev => prev.map(r => r._id === id ? { ...r, date: newDate.toISOString(), snoozeCount } : r));
      await taskService.updateTask(id, { date: newDate.toISOString(), snoozeCount });
      toast(`Snoozed +1 day (×${snoozeCount})`, { icon: '⏲️' });
    } catch {
      toast.error('Failed to snooze');
      fetchRevisions();
    }
  };

  // ── Tab categorization ─────────────────────────────
  const today = new Date(); today.setHours(0, 0, 0, 0);

  const categorized = revisions.reduce((acc, r) => {
    if (r.needsMoreFocus) acc.focus.push(r);
    if (r.status === 'completed') { acc.completed.push(r); return acc; }
    const dueDate = new Date(r.date); dueDate.setHours(0, 0, 0, 0);
    if (dueDate <= today) acc.due.push(r);
    else acc.upcoming.push(r);
    return acc;
  }, { due: [], upcoming: [], focus: [], completed: [] });

  const tabList = categorized[activeTab] || [];

  const emptyMessages = {
    due: "All caught up! No overdue or due-today revisions.",
    upcoming: "No upcoming revisions scheduled yet.",
    focus: "No weak areas flagged. Great prep!",
    completed: "No completed revisions yet. Mark one done to see it here.",
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">

      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-950 to-purple-950 border border-indigo-500/20 rounded-2xl p-8 shadow-sm">
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
          <RefreshCcw className="h-8 w-8 text-indigo-300" /> Revision Planner
        </h1>
        <p className="mt-2 text-indigo-200/70 max-w-2xl text-sm leading-relaxed">
          Auto-generated from Daily Planner completions. Fresh Recall → Strengthen → Mastery.
          Reflect on each session to flag weak areas and build real preparation strength.
        </p>
      </div>

      {/* Tab Nav + Custom Plan button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-0.5 gap-3">
        <div className="flex gap-1 sm:gap-4 overflow-x-auto">
          {TABS.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={cn("relative py-3 px-1 text-sm font-semibold whitespace-nowrap transition-colors",
                activeTab === tab.key ? "text-indigo-600 dark:text-indigo-400" : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              )}
            >
              <span className="flex items-center gap-2">
                {tab.label}
                <span className={cn("py-0.5 px-2 rounded-full text-[10px] font-bold",
                  activeTab === tab.key
                    ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300"
                    : "bg-gray-100 text-gray-500 dark:bg-gray-800"
                )}>
                  {categorized[tab.key].length}
                </span>
              </span>
              {activeTab === tab.key && (
                <motion.div layoutId="revTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-t-full"
                />
              )}
            </button>
          ))}
        </div>

        <button onClick={() => setIsCustomFormOpen(true)}
          className="shrink-0 flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl shadow-sm transition-all mb-0.5"
        >
          <Plus className="h-4 w-4" /> Custom Plan
        </button>
      </div>

      {/* Tab Content */}
      <div className="min-h-[320px]">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <div key={i} className="h-20 bg-gray-100 dark:bg-gray-800/50 rounded-2xl animate-pulse" />)}
          </div>
        ) : tabList.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 px-4 border border-dashed border-gray-200 dark:border-gray-800 rounded-3xl"
          >
            <div className="h-16 w-16 bg-gray-50 dark:bg-gray-800/60 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8 text-gray-300 dark:text-gray-600" />
            </div>
            <h3 className="text-gray-900 dark:text-white font-semibold text-lg">Nothing here</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 text-center max-w-sm">{emptyMessages[activeTab]}</p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {tabList.map(r => (
                <RevisionCard key={r._id} revision={r} onStatusChange={handleStatusChange} onSnooze={handleSnooze} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Preparation Insights */}
      <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
        <PreparationInsights revisions={revisions} />
      </div>

      {/* Modals */}
      <CustomRevisionForm
        isOpen={isCustomFormOpen}
        onClose={() => setIsCustomFormOpen(false)}
        onCreated={fetchRevisions}
      />
      <RevisionCompletionModal
        isOpen={!!pendingCompletion}
        revision={pendingCompletion}
        onClose={() => setPendingCompletion(null)}
        onComplete={handleCompleteReflection}
      />
    </div>
  );
}
