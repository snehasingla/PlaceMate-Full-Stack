import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus, Sun, Sunset, Moon, Layers, ArrowRight, RefreshCcw } from 'lucide-react';
import taskService from '../services/taskService';
import PlannerTaskCard from '../components/planner/PlannerTaskCard';
import PlannerTaskForm from '../components/planner/PlannerTaskForm';
import DailyReflectionCard from '../components/planner/DailyReflectionCard';
import PlannerTemplateSelector from '../components/planner/PlannerTemplateSelector';
import CarryForwardModal from '../components/planner/CarryForwardModal';
import CustomRevisionForm from '../components/planner/CustomRevisionForm';
import toast from 'react-hot-toast';
import { cn } from '../utils/cn';

const toLocalDateStr = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const TIME_BLOCKS = ['Morning', 'Afternoon', 'Evening', 'Anytime'];

const BLOCK_META = {
  Morning:   { icon: Sun,     color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-500/5',  border: 'border-orange-100 dark:border-orange-800/30' },
  Afternoon: { icon: Sunset,  color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-500/5',  border: 'border-yellow-100 dark:border-yellow-800/30' },
  Evening:   { icon: Moon,    color: 'text-blue-500',   bg: 'bg-blue-50 dark:bg-blue-500/5',      border: 'border-blue-100 dark:border-blue-800/30' },
  Anytime:   { icon: Layers,  color: 'text-gray-400',   bg: 'bg-gray-50 dark:bg-gray-900/30',     border: 'border-gray-100 dark:border-gray-800/40' },
};

export default function Planner() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [defaultTimeBlock, setDefaultTimeBlock] = useState('Anytime');
  const [isCarryOpen, setIsCarryOpen] = useState(false);
  const [isCustomRevisionOpen, setIsCustomRevisionOpen] = useState(false);

  const formattedDate = toLocalDateStr(currentDate);
  const isToday = toLocalDateStr(new Date()) === formattedDate;

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await taskService.getTasks(formattedDate, false);
      setTasks(data);
    } catch {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [formattedDate]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const handleDateChange = (delta) => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + delta);
    setCurrentDate(d);
  };

  const handleCreateOrUpdate = async (taskData) => {
    try {
      if (editingTask) {
        const updated = await taskService.updateTask(editingTask._id, taskData);
        setTasks(prev => prev.map(t => t._id === updated._id ? updated : t));
        toast.success("Task updated");
      } else {
        const newTask = await taskService.createTask(taskData);
        if (taskData.date === formattedDate) setTasks(prev => [...prev, newTask]);
        toast.success("Task added");
      }
      setIsFormOpen(false);
      setEditingTask(null);
    } catch {
      toast.error("Failed to save task");
    }
  };

  const handleStatusChange = async (id, status) => {
    setTasks(prev => prev.map(t => t._id === id ? { ...t, status } : t));
    try {
      await taskService.updateTask(id, { status });
      if (status === 'completed') toast.success("Task completed! ✓");
    } catch {
      toast.error("Failed to update");
      fetchTasks();
    }
  };

  const handleDelete = async (id) => {
    setTasks(prev => prev.filter(t => t._id !== id));
    try {
      await taskService.deleteTask(id);
      toast.success("Task deleted");
    } catch {
      toast.error("Failed to delete");
      fetchTasks();
    }
  };

  const openCreate = (timeBlock = 'Anytime') => {
    setEditingTask(null);
    setDefaultTimeBlock(timeBlock);
    setIsFormOpen(true);
  };

  const openEdit = (task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  // ── Stats ────────────────────────────────────────────
  const completed = tasks.filter(t => t.status === 'completed').length;
  const total = tasks.length;
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);
  const pendingTasks = tasks.filter(t => t.status === 'pending');

  const tasksByBlock = TIME_BLOCKS.reduce((acc, b) => {
    acc[b] = tasks.filter(t => (t.timeBlock || 'Anytime') === b);
    return acc;
  }, {});

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">

      {/* ── Header ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-gray-900/50 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Daily Planner</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Structure your preparation day by day.</p>
        </div>
        <div className="flex items-center gap-2 p-1.5 bg-gray-50 dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800">
          <button onClick={() => handleDateChange(-1)} className="p-2 text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="w-44 text-center">
            <p className="text-[10px] font-bold tracking-widest uppercase text-indigo-500 dark:text-indigo-400">
              {isToday ? 'Today' : currentDate.toLocaleDateString(undefined, { weekday: 'long' })}
            </p>
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {currentDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
          <button onClick={() => handleDateChange(1)} className="p-2 text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* ── Two-column layout ───────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left: Time blocks */}
        <div className="lg:col-span-2 space-y-5">
          {TIME_BLOCKS.map(block => {
            const { icon: Icon, color, bg, border } = BLOCK_META[block];
            const blockTasks = tasksByBlock[block] || [];
            const blockDone = blockTasks.filter(t => t.status === 'completed').length;

            return (
              <div key={block} className={cn("rounded-2xl border overflow-hidden", bg, border)}>
                <div className="flex items-center justify-between px-5 py-3 border-b border-inherit">
                  <div className="flex items-center gap-2">
                    <Icon className={cn("h-4 w-4", color)} />
                    <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300">{block}</h2>
                    {blockTasks.length > 0 && (
                      <span className="text-xs text-gray-400 font-medium">{blockDone}/{blockTasks.length}</span>
                    )}
                  </div>
                  <button onClick={() => openCreate(block)}
                    className="flex items-center gap-1 text-xs font-semibold text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    <Plus className="h-4 w-4" /> Add
                  </button>
                </div>
                <div className="p-4 space-y-3 min-h-[60px]">
                  {loading ? (
                    <div className="h-8 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
                  ) : blockTasks.length === 0 ? (
                    <button onClick={() => openCreate(block)}
                      className="w-full py-3 text-xs font-medium text-gray-400 hover:text-gray-500 dark:text-gray-600 border border-dashed border-gray-200 dark:border-gray-800 rounded-xl hover:border-gray-300 transition-colors"
                    >
                      + Add a {block.toLowerCase()} task
                    </button>
                  ) : (
                    <AnimatePresence mode="popLayout">
                      {blockTasks
                        .sort((a, b) => a.status === 'pending' ? -1 : 1)
                        .map(task => (
                          <PlannerTaskCard
                            key={task._id}
                            task={task}
                            onStatusChange={handleStatusChange}
                            onDelete={handleDelete}
                            onEdit={openEdit}
                          />
                        ))}
                    </AnimatePresence>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Sidebar */}
        <div className="space-y-5">
          {/* Day Progress */}
          <div className="bg-white dark:bg-gray-900/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
            <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Day Progress</h3>
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">{pct}%</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">{completed}/{total}</span>
            </div>
            <div className="h-2.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6, ease: 'easeOut' }}
                className={cn("h-full rounded-full", pct === 100 ? "bg-emerald-500" : "bg-indigo-600")}
              />
            </div>
            {pct === 100 && total > 0 && (
              <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400 mt-3 p-2.5 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl border border-emerald-100 dark:border-emerald-500/20">
                🎉 All tasks complete! Excellent work.
              </p>
            )}
          </div>

          {/* High priority remaining */}
          {tasks.filter(t => t.priority === 'High' && t.status === 'pending').length > 0 && (
            <div className="bg-red-50 dark:bg-red-900/10 rounded-2xl p-5 border border-red-100 dark:border-red-800/50">
              <h3 className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-red-500 inline-block" /> High Priority Remaining
              </h3>
              <ul className="space-y-1.5">
                {tasks.filter(t => t.priority === 'High' && t.status === 'pending').slice(0, 4).map(t => (
                  <li key={t._id} className="text-sm text-red-700 dark:text-red-300 font-medium truncate">· {t.title}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Carry Forward (only show if there are pending tasks) */}
          {pendingTasks.length > 0 && (
            <button
              onClick={() => setIsCarryOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-3 bg-amber-50 hover:bg-amber-100 dark:bg-amber-900/10 dark:hover:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-sm font-bold rounded-2xl border border-amber-200 dark:border-amber-800/50 transition-all"
            >
              <ArrowRight className="h-4 w-4" />
              Carry Forward ({pendingTasks.length} pending)
            </button>
          )}

          {/* Add Custom Revision from Planner */}
          <button
            onClick={() => setIsCustomRevisionOpen(true)}
            className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/10 dark:hover:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 text-sm font-bold rounded-2xl border border-indigo-200 dark:border-indigo-800/50 transition-all"
          >
            <RefreshCcw className="h-4 w-4" />
            Add Custom Revision
          </button>

          {/* Add task button */}
          <button onClick={() => openCreate()}
            className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-2xl shadow-sm transition-all"
          >
            <Plus className="h-4 w-4" /> Add New Task
          </button>
        </div>
      </div>

      {/* ── DPR-2: Templates + Reflection ─────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <PlannerTemplateSelector currentDate={formattedDate} onTasksAdded={fetchTasks} />
        <DailyReflectionCard date={formattedDate} />
      </div>

      {/* ── Modals ─────────────────────────────────────── */}
      <PlannerTaskForm
        isOpen={isFormOpen}
        onClose={() => { setIsFormOpen(false); setEditingTask(null); }}
        onSubmit={handleCreateOrUpdate}
        initialData={editingTask}
        currentDate={formattedDate}
        defaultTimeBlock={defaultTimeBlock}
      />
      <CarryForwardModal
        isOpen={isCarryOpen}
        onClose={() => setIsCarryOpen(false)}
        pendingTasks={pendingTasks}
        onDone={fetchTasks}
      />
      <CustomRevisionForm
        isOpen={isCustomRevisionOpen}
        onClose={() => setIsCustomRevisionOpen(false)}
        onCreated={() => toast.success('Revision scheduled! View in Revision Planner.')}
      />
    </div>
  );
}
