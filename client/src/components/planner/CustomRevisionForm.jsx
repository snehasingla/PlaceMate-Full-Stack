import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Plus, Save, Bookmark, Target } from 'lucide-react';
import taskService from '../../services/taskService';
import toast from 'react-hot-toast';

export default function CustomRevisionForm({ isOpen, onClose, onCreated, prefillTitle, prefillSubject, prefillTopic }) {
  const [title, setTitle] = useState(prefillTitle || '');
  const [category, setCategory] = useState('Revision');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [relatedSubject, setRelatedSubject] = useState(prefillSubject || '');
  const [relatedTopic, setRelatedTopic] = useState(prefillTopic || '');
  const [description, setDescription] = useState('');
  const [needsMoreFocus, setNeedsMoreFocus] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !date) return toast.error("Title and date are required");

    setIsSubmitting(true);
    try {
      await taskService.createTask({
        title,
        description,
        category,
        date: new Date(date),
        relatedSubject,
        relatedTopic,
        needsMoreFocus,
        isRevision: true,
        sourceType: 'custom',
        stageName: 'Custom Review',
        priority: 'High',
      });
      toast.success("Custom revision scheduled!");
      setTitle(''); setRelatedSubject(''); setRelatedTopic(''); setDescription('');
      if (onCreated) onCreated();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create revision");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden"
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800/60 bg-gray-50/50 dark:bg-gray-800/20">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Plus className="h-5 w-5 text-indigo-500" /> Custom Revision Plan
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Topic or Goal to Revise</label>
              <input type="text" autoFocus placeholder="e.g. Master Binary Search Trees"
                value={title} onChange={(e) => setTitle(e.target.value)} required
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:bg-gray-950 dark:border-gray-800 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-2">
                  <Bookmark className="h-4 w-4 text-gray-400" /> Subject
                </label>
                <input type="text" placeholder="e.g. DSA"
                  value={relatedSubject} onChange={(e) => setRelatedSubject(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:bg-gray-950 dark:border-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-2">
                  <Target className="h-4 w-4 text-gray-400" /> Topic
                </label>
                <input type="text" placeholder="e.g. Trees"
                  value={relatedTopic} onChange={(e) => setRelatedTopic(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:bg-gray-950 dark:border-gray-800 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" /> Target Date
              </label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:bg-gray-950 dark:border-gray-800 dark:text-white"
              />
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input type="checkbox" className="sr-only"
                  checked={needsMoreFocus} onChange={(e) => setNeedsMoreFocus(e.target.checked)}
                />
                <div className={`block w-10 h-6 rounded-full transition-colors ${needsMoreFocus ? 'bg-amber-500' : 'bg-gray-300 dark:bg-gray-700'}`} />
                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${needsMoreFocus ? 'translate-x-4' : ''}`} />
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900 dark:text-white">Needs More Focus</div>
                <div className="text-xs text-gray-500">Flags this for the weak areas zone</div>
              </div>
            </label>

            <div className="pt-4 border-t border-gray-100 dark:border-gray-800/60 flex justify-end gap-3">
              <button type="button" onClick={onClose}
                className="px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-xl dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
              >Cancel</button>
              <button type="submit" disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-sm disabled:opacity-50"
              >
                {isSubmitting ? 'Scheduling...' : <><Save className="h-4 w-4" /> Schedule Revision</>}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
