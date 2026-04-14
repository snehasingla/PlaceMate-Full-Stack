import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, X, Calendar, MoveRight, Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';
import taskService from '../../services/taskService';
import toast from 'react-hot-toast';

const toLocalDateStr = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const getTomorrowStr = () => {
  const d = new Date(); d.setDate(d.getDate() + 1);
  return toLocalDateStr(d);
};

export default function CarryForwardModal({ isOpen, onClose, pendingTasks, onDone }) {
  const [targetDate, setTargetDate] = useState(getTomorrowStr());
  const [selectedIds, setSelectedIds] = useState(() => pendingTasks.map(t => t._id));
  const [processing, setProcessing] = useState(false);

  if (!isOpen) return null;

  const toggle = (id) => setSelectedIds(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const handleCarryForward = async () => {
    if (selectedIds.length === 0) return toast.error('Select at least one task');
    setProcessing(true);
    try {
      const selected = pendingTasks.filter(t => selectedIds.includes(t._id));
      await Promise.all(selected.map(t =>
        taskService.createTask({
          title: t.title,
          description: t.description,
          category: t.category,
          priority: t.priority,
          effort: t.effort,
          timeBlock: t.timeBlock,
          relatedSubject: t.relatedSubject,
          relatedTopic: t.relatedTopic,
          shouldGenerateRevision: false, // no auto-revision chain on carried tasks
          date: targetDate,
          carriedForwardFrom: t._id,
        })
      ));
      toast.success(`${selected.length} task${selected.length > 1 ? 's' : ''} moved to ${targetDate}`);
      onDone();
      onClose();
    } catch {
      toast.error('Failed to carry forward');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-amber-50/50 dark:bg-amber-900/10">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <ArrowRight className="h-5 w-5 text-amber-500" /> Carry Forward Tasks
            </h2>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6 space-y-5">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Select unfinished tasks to reschedule. New copies will be created on the target date, linked to the originals.
            </p>

            <div className="space-y-2 max-h-52 overflow-y-auto">
              {pendingTasks.map(task => (
                <label key={task._id}
                  className={cn("flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all",
                    selectedIds.includes(task._id)
                      ? "bg-amber-50 border-amber-200 dark:bg-amber-900/10 dark:border-amber-800/50"
                      : "bg-gray-50 border-gray-100 dark:bg-gray-900/30 dark:border-gray-800 hover:border-gray-200"
                  )}
                >
                  <input type="checkbox" className="accent-indigo-600 h-4 w-4 shrink-0"
                    checked={selectedIds.includes(task._id)} onChange={() => toggle(task._id)}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{task.title}</p>
                    <p className="text-xs text-gray-500">{task.category} · {task.timeBlock || 'Anytime'} · {task.priority}</p>
                  </div>
                </label>
              ))}
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-indigo-500" /> Move to date
              </label>
              <input type="date" value={targetDate} min={toLocalDateStr(new Date())}
                onChange={e => setTargetDate(e.target.value)}
                className="w-full bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={onClose}
                className="flex-1 py-2.5 text-sm font-semibold text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >Cancel</button>
              <button onClick={handleCarryForward} disabled={processing || selectedIds.length === 0}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-bold rounded-xl shadow-sm"
              >
                {processing
                  ? <><Loader2 className="h-4 w-4 animate-spin" /> Moving...</>
                  : <><MoveRight className="h-4 w-4" /> Move ({selectedIds.length})</>
                }
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
