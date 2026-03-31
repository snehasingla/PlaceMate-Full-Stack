import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight, CheckSquare, ListTodo, Plus, Target } from 'lucide-react';
import taskService from '../services/taskService';
import PlannerTaskCard from '../components/planner/PlannerTaskCard';
import PlannerTaskForm from '../components/planner/PlannerTaskForm';
import toast from 'react-hot-toast';
import { cn } from '../utils/cn';

export default function Planner() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Format Helper: purely to standard YYYY-MM-DD local format
  const getFormattedDateStrings = (d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formattedDate = getFormattedDateStrings(currentDate);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data = await taskService.getTasks(formattedDate);
      setTasks(data);
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line
  }, [formattedDate]);

  const handleDateChange = (days) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate);
  };

  // ─── CRUD OPERATIONS ─────────────────────────────────

  const handleCreateOrUpdate = async (taskData) => {
    try {
      if (editingTask) {
        // Update
        const updated = await taskService.updateTask(editingTask._id, taskData);
        setTasks(prev => prev.map(t => t._id === updated._id ? updated : t));
        toast.success("Task updated");
      } else {
        // Create
        const newTask = await taskService.createTask(taskData);
        // Only insert if it belongs to currently viewed date (or simply refetch locally)
        if (taskData.date === formattedDate) {
           setTasks(prev => [...prev, newTask].sort((a,b) => (a.status === 'pending' ? -1 : 1)));
        }
        toast.success("Task added successfully");
      }
      setIsFormOpen(false);
      setEditingTask(null);
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      // Optimistic update
      setTasks(prev => prev.map(t => t._id === id ? { ...t, status } : t).sort((a,b) => {
         const aStatus = a._id === id ? status : a.status;
         const bStatus = b._id === id ? status : b.status;
         if (aStatus === bStatus) return 0;
         return aStatus === 'pending' ? -1 : 1;
      }));
      await taskService.updateTask(id, { status });
    } catch (error) {
      toast.error("Couldn't update status");
      fetchTasks(); // rollback if it fails
    }
  };

  const handleDelete = async (id) => {
    try {
      setTasks(prev => prev.filter(t => t._id !== id));
      await taskService.deleteTask(id);
      toast.success("Task deleted");
    } catch {
      toast.error("Failed to delete task");
    }
  };

  const openEdit = (task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  // ─── UTILS ──────────────────────────────────────────

  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const totalCount = tasks.length;
  const progressPercent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  const isToday = getFormattedDateStrings(new Date()) === formattedDate;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Date Navigator Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-gray-900/50 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
        <div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
            Daily Planner
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Structure your day to build unshakeable consistency.</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto p-1.5 bg-gray-50 dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800">
          <button onClick={() => handleDateChange(-1)} className="p-2 text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <div className="flex-1 sm:w-48 text-center flex flex-col items-center justify-center">
            <span className="text-[10px] font-bold tracking-widest uppercase text-indigo-500 dark:text-indigo-400">
              {isToday ? "Today" : currentDate.toLocaleDateString(undefined, { weekday: 'long' })}
            </span>
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {currentDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>

          <button onClick={() => handleDateChange(1)} className="p-2 text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Col: Main Tasks */}
        <div className="md:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <ListTodo className="h-5 w-5 text-indigo-500" />
              Tasks for {isToday ? "Today" : "This Day"}
            </h2>
            <button 
              onClick={() => { setEditingTask(null); setIsFormOpen(true); }}
              className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-all"
            >
              <Plus className="h-4 w-4 mr-1" /> Add Task
            </button>
          </div>

          {!loading && tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 bg-white dark:bg-gray-900/40 border border-dashed border-gray-300 dark:border-gray-800 rounded-2xl">
              <div className="h-16 w-16 bg-gray-50 dark:bg-gray-800/50 rounded-full flex items-center justify-center mb-4">
                <Target className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-gray-900 dark:text-white font-semibold">No tasks scheduled</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 text-center max-w-sm">
                Get productive by setting up a solid preparation plan. Create your first task now.
              </p>
            </div>
          ) : (
            <div className="space-y-3 min-h-[300px]">
              <AnimatePresence>
                {tasks.map(task => (
                  <div key={task._id} onDoubleClick={() => openEdit(task)}>
                    <PlannerTaskCard 
                      task={task} 
                      onStatusChange={handleStatusChange} 
                      onDelete={handleDelete} 
                    />
                  </div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Right Col: Progress Insights */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm sticky top-24">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">Day Progress</h3>
            
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">{progressPercent}%</span>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{completedCount} of {totalCount} completed</span>
            </div>

            <div className="h-3 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={cn(
                  "h-full rounded-full",
                  progressPercent === 100 ? "bg-emerald-500" : "bg-indigo-600 dark:bg-indigo-500"
                )}
              />
            </div>

            {progressPercent === 100 && totalCount > 0 && (
              <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl border border-emerald-100 dark:border-emerald-500/20 flex items-start gap-3">
                <CheckSquare className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <p className="text-xs font-medium text-emerald-800 dark:text-emerald-300">
                  Perfect day! You crushed all your scheduled tasks. Enjoy your rest.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>

      <PlannerTaskForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSubmit={handleCreateOrUpdate}
        initialData={editingTask}
        currentDate={formattedDate}
      />
    </div>
  );
}
