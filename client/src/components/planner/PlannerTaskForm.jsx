import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Plus, Save, Zap } from 'lucide-react';
import { cn } from '../../utils/cn';
import QuickAddChips from './QuickAddChips';
import RevisionPreviewPanel from './RevisionPreviewPanel';

const TIME_BLOCKS = ['Morning', 'Afternoon', 'Evening', 'Anytime'];
const PRIORITIES = ['High', 'Medium', 'Low'];
const EFFORTS = ['Short', 'Medium', 'Long'];

const EFFORT_LABELS = { Short: '< 30 min', Medium: '30–90 min', Long: '2+ hrs' };

const PRIORITY_STYLES = {
  High: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20',
  Medium: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
  Low: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20',
};

const EFFORT_STYLES = {
  Short: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
  Medium: 'bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20',
  Long: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20',
};

const buildDefault = (currentDate) => ({
  title: '',
  description: '',
  category: 'DSA',
  priority: 'Medium',
  effort: 'Medium',
  timeBlock: 'Anytime',
  date: currentDate || new Date().toISOString().split('T')[0],
  relatedSubject: '',
  relatedTopic: '',
  shouldGenerateRevision: true, // Default to ON for better visibility
});

export default function PlannerTaskForm({ isOpen, onClose, onSubmit, initialData = null, currentDate, defaultTimeBlock }) {
  const [form, setForm] = useState(buildDefault(currentDate));

  useEffect(() => {
    if (!isOpen) return;
    if (initialData) {
      setForm({
        ...buildDefault(currentDate),
        ...initialData,
        date: new Date(initialData.date).toISOString().split('T')[0],
      });
    } else {
      setForm({ ...buildDefault(currentDate), timeBlock: defaultTimeBlock || 'Anytime' });
    }
  }, [isOpen, initialData, currentDate, defaultTimeBlock]);

  if (!isOpen) return null;

  const set = (key) => (val) =>
    setForm(prev => ({ ...prev, [key]: val?.target !== undefined ? val.target.value : val }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-10 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/80">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Calendar className="h-5 w-5 text-indigo-500" />
              {initialData ? 'Edit Task' : 'Add Task'}
            </h2>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[82vh] overflow-y-auto">
            {/* Quick Chips */}
            <QuickAddChips 
              activeCategory={form.category} 
              onSelect={(v) => {
                const autoRevise = (v === 'DSA' || v === 'Core Subject');
                setForm(p => ({ ...p, category: v, shouldGenerateRevision: autoRevise }));
              }} 
            />

            {/* Title */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Task Title <span className="text-red-500">*</span>
              </label>
              <input
                required type="text"
                placeholder="e.g. Solve 5 Binary Search problems"
                value={form.title}
                onChange={set('title')}
                className="w-full bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-gray-100"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Notes <span className="text-xs font-normal text-gray-400">(optional)</span>
              </label>
              <textarea
                rows={2}
                placeholder="Add context, links, strategy..."
                value={form.description}
                onChange={set('description')}
                className="w-full bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-gray-100 resize-none"
              />
            </div>

            {/* Date + Time Block */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Date</label>
                <input required type="date" value={form.date} onChange={set('date')}
                  className="w-full bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Time Block</label>
                <select value={form.timeBlock} onChange={set('timeBlock')}
                  className="w-full bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-gray-100"
                >
                  {TIME_BLOCKS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
            </div>

            {/* Priority */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Priority</label>
              <div className="grid grid-cols-3 gap-2">
                {PRIORITIES.map(p => (
                  <button key={p} type="button"
                    onClick={() => setForm(prev => ({ ...prev, priority: p }))}
                    className={cn("py-2 rounded-xl border text-xs font-bold transition-all",
                      form.priority === p
                        ? PRIORITY_STYLES[p] + " ring-2 ring-offset-1 ring-indigo-500 dark:ring-offset-gray-900"
                        : "bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800"
                    )}
                  >{p}</button>
                ))}
              </div>
            </div>

            {/* Effort */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-amber-500" /> Effort
              </label>
              <div className="grid grid-cols-3 gap-2">
                {EFFORTS.map(e => (
                  <button key={e} type="button"
                    onClick={() => setForm(prev => ({ ...prev, effort: e }))}
                    className={cn("py-2 px-1 rounded-xl border text-[11px] font-bold transition-all flex flex-col items-center",
                      form.effort === e
                        ? EFFORT_STYLES[e] + " ring-2 ring-offset-1 ring-indigo-500 dark:ring-offset-gray-900"
                        : "bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800"
                    )}
                  >
                    <span>{e}</span>
                    <span className="text-[9px] opacity-60 mt-0.5">{EFFORT_LABELS[e]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Subject / Topic */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Subject <span className="text-xs font-normal text-gray-400">(optional)</span>
                </label>
                <input type="text" placeholder="e.g. Operating Systems" value={form.relatedSubject} onChange={set('relatedSubject')}
                  className="w-full bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Topic <span className="text-xs font-normal text-gray-400">(optional)</span>
                </label>
                <input type="text" placeholder="e.g. Deadlocks" value={form.relatedTopic} onChange={set('relatedTopic')}
                  className="w-full bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>

            {/* Auto Revision Toggle */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800/50">
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">Auto-Generate Revisions</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Schedules spaced repetition sessions on completion</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer ml-4 shrink-0">
                <input type="checkbox" className="sr-only peer"
                  checked={form.shouldGenerateRevision}
                  onChange={(e) => setForm(p => ({ ...p, shouldGenerateRevision: e.target.checked }))}
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600" />
              </label>
            </div>

            {/* Revision Schedule Preview */}
            <RevisionPreviewPanel visible={form.shouldGenerateRevision} />

            {/* Submit */}
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3">
              <button type="button" onClick={onClose}
                className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
              >Cancel</button>
              <button type="submit"
                className="px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-sm transition-all flex items-center gap-2"
              >
                {initialData ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                {initialData ? 'Save Changes' : 'Add Task'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
