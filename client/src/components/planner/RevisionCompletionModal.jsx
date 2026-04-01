import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, AlertTriangle, Target, MessageSquare } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function RevisionCompletionModal({ isOpen, revision, onClose, onComplete }) {
  const [confidence, setConfidence] = useState('Okay');
  const [needsMoreFocus, setNeedsMoreFocus] = useState(false);
  const [reflectionNote, setReflectionNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (revision) {
      setConfidence('Okay');
      setNeedsMoreFocus(revision.needsMoreFocus || false);
      setReflectionNote('');
    }
  }, [revision, isOpen]);

  if (!isOpen || !revision) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const computedFocus = confidence === 'Weak' ? true : needsMoreFocus;
      await onComplete(revision._id, {
        status: 'completed',
        confidence,
        needsMoreFocus: computedFocus,
        reflectionNote,
      });
      onClose();
    } catch (err) {
      console.error(err);
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
          className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden"
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800/60 bg-indigo-50/50 dark:bg-indigo-900/10">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-indigo-500" /> Complete Revision
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="bg-gray-50 dark:bg-gray-800/40 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">Completing</p>
              <h3 className="font-bold text-gray-900 dark:text-gray-100 truncate">{revision.title}</h3>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Confidence Level</label>
              <div className="grid grid-cols-3 gap-3">
                {['Weak', 'Okay', 'Strong'].map(level => (
                  <button key={level} type="button"
                    onClick={() => {
                      setConfidence(level);
                      if (level === 'Weak') setNeedsMoreFocus(true);
                      if (level === 'Strong') setNeedsMoreFocus(false);
                    }}
                    className={cn(
                      "py-2.5 px-3 rounded-xl border font-semibold text-sm transition-all flex flex-col items-center gap-1",
                      confidence === level
                        ? level === 'Weak' ? "bg-rose-100 border-rose-500 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400 dark:border-rose-500"
                        : level === 'Okay' ? "bg-amber-100 border-amber-500 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500"
                        : "bg-emerald-100 border-emerald-500 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500"
                        : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-400"
                    )}
                  >
                    {level === 'Weak' && <AlertTriangle className="h-4 w-4" />}
                    {level === 'Okay' && <CheckCircle2 className="h-4 w-4" />}
                    {level === 'Strong' && <Target className="h-4 w-4" />}
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input type="checkbox" className="sr-only"
                  checked={needsMoreFocus} onChange={(e) => setNeedsMoreFocus(e.target.checked)}
                />
                <div className={`block w-10 h-6 rounded-full transition-colors ${needsMoreFocus ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-700'}`} />
                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${needsMoreFocus ? 'translate-x-4' : ''}`} />
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                  <Target className="h-3.5 w-3.5 text-indigo-500" /> Needs More Focus?
                </div>
                <div className="text-xs text-gray-500">Flags this for the weak areas zone</div>
              </div>
            </label>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-gray-400" /> Reflection Note
                <span className="text-xs font-normal text-gray-400">(Optional)</span>
              </label>
              <textarea rows={3} placeholder="e.g. Forgot edge cases, struggled with implementation..."
                value={reflectionNote} onChange={(e) => setReflectionNote(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:bg-gray-950 dark:border-gray-800 dark:text-white resize-none"
              />
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-gray-800/60 flex justify-end gap-3">
              <button type="button" onClick={onClose}
                className="px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-xl dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
              >Cancel</button>
              <button type="submit" disabled={isSubmitting}
                className="px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-sm disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Mark Completed'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
