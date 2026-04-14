import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Building2, Calendar, Link as LinkIcon, Trash2, GripVertical, Clock, Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';
import companyService from '../services/companyService';

const COLUMNS = [
  { id: 'wishlist', title: 'Wishlist', bg: 'bg-gray-100 dark:bg-gray-800/80', dot: 'bg-gray-400' },
  { id: 'applied', title: 'Applied', bg: 'bg-blue-50 dark:bg-blue-900/20', dot: 'bg-blue-500' },
  { id: 'oaScheduled', title: 'Assessment', bg: 'bg-yellow-50 dark:bg-amber-900/20', dot: 'bg-yellow-500' },
  { id: 'interviewScheduled', title: 'Interview', bg: 'bg-purple-50 dark:bg-purple-900/20', dot: 'bg-purple-500' },
  { id: 'selected', title: 'Offer! 🏆', bg: 'bg-emerald-50 dark:bg-emerald-900/20', dot: 'bg-emerald-500' },
  { id: 'rejected', title: 'Rejected', bg: 'bg-red-50 dark:bg-red-900/20', dot: 'bg-red-500' }
];

const PriorityBadge = ({ priority }) => {
  const map = {
    high: { color: 'text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-500/20', label: 'High' },
    medium: { color: 'text-amber-700 bg-amber-100 dark:text-amber-400 dark:bg-amber-500/20', label: 'Med' },
    low: { color: 'text-gray-700 bg-gray-100 dark:text-gray-400 dark:bg-gray-500/20', label: 'Low' },
  };
  const { color, label } = map[priority] || map.medium;
  return <span className={`px-2 py-0.5 text-xs font-medium rounded-md ${color}`}>{label}</span>;
};

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ companyName: '', role: '', status: 'wishlist', priority: 'medium', jdLink: '', deadline: '' });

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const data = await companyService.getApplications();
      setApplications(data);
    } catch (error) {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (e, id) => {
    e.dataTransfer.setData('appId', id);
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = async (e, columnId) => {
    e.preventDefault();
    const appId = e.dataTransfer.getData('appId');
    if (!appId) return;

    const previousApps = [...applications];
    setApplications(prev => prev.map(app => app._id === appId ? { ...app, status: columnId } : app));

    try {
      await companyService.updateApplication(appId, { status: columnId });
      toast.success('Status updated!');
    } catch (error) {
      setApplications(previousApps); // Revert on failure
      toast.error('Failed to update status');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await companyService.createApplication(formData);
      setApplications([res, ...applications]);
      setIsModalOpen(false);
      toast.success('Application added!');
      setFormData({ companyName: '', role: '', status: 'wishlist', priority: 'medium', jdLink: '', deadline: '' });
    } catch (error) {
      toast.error('Failed to add application');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this application?')) return;
    try {
      await companyService.deleteApplication(id);
      setApplications(applications.filter(a => a._id !== id));
      toast.success('Deleted successfully');
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  // Group applications by status
  const groupedApps = COLUMNS.reduce((acc, col) => {
    acc[col.id] = applications.filter(app => app.status === col.id);
    return acc;
  }, {});

  if (loading) return <div className="p-6 flex justify-center items-center h-[60vh]"><div className="animate-spin w-8 h-8 rounded-full border-4 border-indigo-200 border-t-indigo-600"></div></div>;

  return (
    <div className="h-full flex flex-col p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
            Application Tracker
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Drag and drop to track your hiring pipeline.
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-indigo-500/30 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Application
        </button>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 flex gap-6 overflow-x-auto pb-4 snap-x">
        {COLUMNS.map(col => (
          <div 
            key={col.id}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.id)}
            className={`flex-none w-80 rounded-2xl p-4 flex flex-col border border-transparent dark:border-gray-800 ${col.bg} transition-colors snap-center`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between mb-4 px-1">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${col.dot}`} />
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-sm tracking-wide">{col.title}</h3>
              </div>
              <span className="bg-white/50 dark:bg-black/20 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full text-xs font-medium">
                {groupedApps[col.id]?.length || 0}
              </span>
            </div>

            {/* Column Items */}
            <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-1 min-h-[150px]">
              <AnimatePresence>
                {groupedApps[col.id]?.map(app => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    key={app._id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, app._id)}
                    className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-800 transition-all cursor-grab active:cursor-grabbing group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <PriorityBadge priority={app.priority} />
                      </div>
                      <button onClick={() => handleDelete(app._id)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <h4 className="font-bold text-gray-900 dark:text-white truncate">{app.role}</h4>
                    <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 mt-1 mb-3">
                      <Building2 className="w-3.5 h-3.5" />
                      <span className="truncate">{app.companyName}</span>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-3">
                        {app.deadline && (
                          <div className="flex items-center gap-1 text-xs text-rose-500 font-medium bg-rose-50 dark:bg-rose-500/10 px-2 py-1 rounded-md">
                            <Clock className="w-3 h-3" />
                            {new Date(app.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </div>
                        )}
                      </div>
                      {app.jdLink && (
                        <a href={app.jdLink} target="_blank" rel="noreferrer" className="text-indigo-500 hover:text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 p-1.5 rounded-lg border border-indigo-100 dark:border-indigo-500/20" title="View JD">
                          <LinkIcon className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>

      {/* Add Application Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-2xl border border-gray-100 dark:border-gray-800"
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Add New Track</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Company Name *</label>
                <input required type="text" value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} className="mt-1 w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. Google" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Role / Position *</label>
                <input required type="text" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="mt-1 w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. SDE Intern" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Status</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="mt-1 w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                    {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Priority</label>
                  <select value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})} className="mt-1 w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                    <option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Deadline (Optional)</label>
                <input type="date" value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} className="mt-1 w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              
              <div>
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1">JD Link <Sparkles className="w-3 h-3 text-indigo-500" /></label>
                <input type="url" value={formData.jdLink} onChange={e => setFormData({...formData, jdLink: e.target.value})} className="mt-1 w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="https://" />
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold rounded-xl transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-indigo-500/30">Save Track</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Applications;
