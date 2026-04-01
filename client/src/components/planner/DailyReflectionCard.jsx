import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PenLine, ChevronDown, ChevronUp, Save, CheckCircle2, Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';
import reflectionService from '../../services/reflectionService';
import toast from 'react-hot-toast';

export default function DailyReflectionCard({ date }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({ wentWell: '', skipped: '', focusTomorrow: '' });

  useEffect(() => {
    if (!date) return;
    reflectionService.getReflection(date).then(data => {
      if (data) {
        setForm({ wentWell: data.wentWell || '', skipped: data.skipped || '', focusTomorrow: data.focusTomorrow || '' });
        setSaved(true);
      } else {
        setForm({ wentWell: '', skipped: '', focusTomorrow: '' });
        setSaved(false);
      }
    }).catch(() => {});
  }, [date]);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await reflectionService.saveReflection(date, form);
      setSaved(true);
      toast.success('Reflection saved!');
    } catch {
      toast.error('Failed to save reflection');
    } finally {
      setIsSaving(false);
    }
  };

  const set = (key) => (e) => { setForm(p => ({ ...p, [key]: e.target.value })); setSaved(false); };

  return (
    <div className={cn("rounded-2xl border transition-all overflow-hidden",
      isOpen
        ? "bg-indigo-50/50 dark:bg-indigo-900/10 border-indigo-200 dark:border-indigo-800/60"
        : "bg-white dark:bg-gray-900/40 border-gray-100 dark:border-gray-800"
    )}>
      <button type="button" onClick={() => setIsOpen(p => !p)}
        className="w-full flex items-center justify-between px-5 py-4"
      >
        <div className="flex items-center gap-3">
          <div className={cn("p-2 rounded-xl transition-colors", isOpen ? "bg-indigo-100 dark:bg-indigo-500/20" : "bg-gray-100 dark:bg-gray-800")}>
            <PenLine className={cn("h-4 w-4", isOpen ? "text-indigo-600 dark:text-indigo-400" : "text-gray-500")} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900 dark:text-white text-left">End-of-Day Reflection</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 text-left">
              {saved ? '✓ Saved for today' : 'Quick notes — what happened today?'}
            </p>
          </div>
        </div>
        {isOpen ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div key="body"
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <form onSubmit={handleSave} className="px-5 pb-5 space-y-4 border-t border-indigo-100 dark:border-indigo-800/40 pt-4">
              {[
                { key: 'wentWell', label: '✓ What went well?', placeholder: 'e.g. Finished all DSA problems, understood OS deadlocks...', color: 'text-emerald-700 dark:text-emerald-400' },
                { key: 'skipped', label: '↩ What was skipped or left?', placeholder: 'e.g. Skipped aptitude mock, ran out of time...', color: 'text-amber-600 dark:text-amber-400' },
                { key: 'focusTomorrow', label: '→ Focus for tomorrow', placeholder: 'e.g. Redo binary search, complete normalization notes...', color: 'text-indigo-600 dark:text-indigo-400' },
              ].map(({ key, label, placeholder, color }) => (
                <div key={key} className="space-y-1.5">
                  <label className={cn("block text-xs font-bold uppercase tracking-wider", color)}>{label}</label>
                  <textarea rows={2} placeholder={placeholder}
                    value={form[key]} onChange={set(key)}
                    className="w-full px-3 py-2.5 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 resize-none"
                  />
                </div>
              ))}
              <div className="flex justify-end">
                <button type="submit" disabled={isSaving}
                  className={cn("flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl transition-all",
                    saved && !isSaving
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50"
                      : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm"
                  )}
                >
                  {isSaving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>
                    : saved ? <><CheckCircle2 className="h-4 w-4" /> Saved</>
                    : <><Save className="h-4 w-4" /> Save Reflection</>}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
