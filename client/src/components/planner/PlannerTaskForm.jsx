import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Plus, Save } from 'lucide-react';
import { cn } from '../../utils/cn';

const categories = ['DSA', 'Core Subject', 'Revision', 'Mock Interview', 'Company Prep', 'Aptitude', 'Math', 'Custom'];
const priorities = ['High', 'Medium', 'Low'];

export default function PlannerTaskForm({ isOpen, onClose, onSubmit, initialData = null, currentDate }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Custom',
    priority: 'Medium',
    date: currentDate || new Date().toISOString().split('T')[0],
    relatedSubject: '',
    relatedTopic: '',
    shouldGenerateRevision: false
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        date: new Date(initialData.date).toISOString().split('T')[0]
      });
    } else if (currentDate) {
      setFormData(prev => ({ ...prev, date: currentDate }));
    }
  }, [initialData, currentDate, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    // Reset form for fresh creates if needed, though unmount does this too
    if (!initialData) {
      setFormData({
        title: '', description: '', category: 'Custom', priority: 'Medium', date: currentDate || new Date().toISOString().split('T')[0], relatedSubject: '', relatedTopic: '', shouldGenerateRevision: false
      });
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Calendar className="h-5 w-5 text-indigo-500" />
              {initialData ? 'Edit Task' : 'Add Daily Task'}
            </h2>
            <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5 flex flex-col max-h-[70vh] overflow-y-auto custom-scrollbar">
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Task Title *</label>
              <input required type="text"
                className="w-full bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-gray-100"
                placeholder="e.g. Master React Hooks"
                value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
                <input required type="date"
                  className="w-full bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-gray-100"
                  value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Priority</label>
                <select
                  className="w-full bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-gray-100"
                  value={formData.priority} onChange={e => setFormData({ ...formData, priority: e.target.value })}
                >
                  {priorities.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                <select
                  className="w-full bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-gray-100"
                  value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Subject (Optional)</label>
                  <input type="text"
                    className="w-full bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100"
                    placeholder="e.g. Operating Systems"
                    value={formData.relatedSubject} onChange={e => setFormData({ ...formData, relatedSubject: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Topic (Optional)</label>
                  <input type="text"
                    className="w-full bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100"
                    placeholder="e.g. Deadlocks"
                    value={formData.relatedTopic} onChange={e => setFormData({ ...formData, relatedTopic: e.target.value })}
                  />
                </div>
            </div>

            {/* Revision Toggle Layer */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800/50">
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">Auto-Revision Schedule</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Generate future reminders when completed.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={formData.shouldGenerateRevision} onChange={e => setFormData({...formData, shouldGenerateRevision: e.target.checked})} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3">
              <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">
                Cancel
              </button>
              <button type="submit" className="px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-500 shadow-sm transition-all focus:ring-2 focus:ring-indigo-500 flex items-center gap-2">
                {initialData ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                {initialData ? 'Save Changes' : 'Create Task'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
