import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Code2, Building2, StickyNote, Flame, ArrowRight, Clock, Trophy, CheckCircle2 } from 'lucide-react';
import StatCard from '../components/common/StatCard';
import { Link, useNavigate } from 'react-router-dom';
import analyticsService from '../services/analyticsService';

const Dashboard = () => {
  const [stats, setStats] = useState({
    problemsSolved: 0,
    activeApplications: 0,
    revisionNotes: 0,
    mockScore: '0/5',
    streak: '0 Day Streak!',
  });
  const [activityData, setActivityData] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const formatRelativeTime = (timestamp) => {
    if (!timestamp) return "Unknown time";
    const date = new Date(timestamp);
    const diff = Date.now() - date.getTime();
    if (diff < 60_000) return "Just now";
    if (diff < 3_600_000) return `${Math.floor(diff / 60_000)} min ago`;
    if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)} hr ago`;
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'dsaSolved':
        return Code2;
      case 'appAdded':
        return Building2;
      case 'noteCreated':
        return StickyNote;
      case 'mockDone':
        return Trophy;
      case 'subjectCompleted':
        return CheckCircle2;
      default:
        return Clock;
    }
  };

  const getActivityLabel = (type) => {
    switch (type) {
      case 'dsaSolved':
        return 'Solved a problem';
      case 'appAdded':
        return 'Added an application';
      case 'noteCreated':
        return 'Created a note';
      case 'mockDone':
        return 'Completed a mock session';
      case 'subjectCompleted':
        return 'Finished a subject topic';
      default:
        return 'Activity update';
    }
  };

  const navigate = useNavigate();

  const handleCardClick = (path) => {
    navigate(path);
  };

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      try {
        const [dashboardStats, activity] = await Promise.all([
          analyticsService.getDashboardStats(),
          analyticsService.getActivityAnalytics(),
        ]);

        setStats({
          problemsSolved: dashboardStats.dsa?.solved || 0,
          activeApplications: dashboardStats.companies?.total || 0,
          revisionNotes: dashboardStats.notes?.total || 0,
          mockScore: dashboardStats.mockScore || '0/5',
          streak: dashboardStats.streak?.current ? `${dashboardStats.streak.current} Day Streak!` : '0 Day Streak!',
        });
        setActivityData(
          activity.map((item) => ({
            name: item._id || item.date || 'Unknown',
            solved: item.count || 0,
          }))
        );
        setRecentActivity(dashboardStats.recentActivity || []);
      } catch (error) {
        console.error('Dashboard stats load failed', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [navigate]);

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8 pb-8"
    >
      {/* Header Section */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
            Overview
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Track your preparation progress and stay consistent.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-full border border-orange-200/50 dark:border-orange-500/20">
          <Flame className="w-4 h-4 text-orange-500" />
          <span className="text-sm font-semibold text-orange-700 dark:text-orange-400">{stats.streak}</span>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard 
          title="Problems Solved" 
          value={stats.problemsSolved}
          trend="up" 
          trendValue="0"
          icon={Code2}
          colorClass={{ bg: "bg-blue-100 dark:bg-blue-500/20", text: "text-blue-600 dark:text-blue-400" }}
          onClick={() => handleCardClick('/dsa')}
        />
        <StatCard 
          title="Active Applications" 
          value={stats.activeApplications}
          trend="up" 
          trendValue="0"
          icon={Building2}
          colorClass={{ bg: "bg-purple-100 dark:bg-purple-500/20", text: "text-purple-600 dark:text-purple-400" }}
        />
        <StatCard 
          title="Revision Notes" 
          value={stats.revisionNotes}
          trend="up"
          trendValue="0"
          icon={StickyNote}
          colorClass={{ bg: "bg-emerald-100 dark:bg-emerald-500/20", text: "text-emerald-600 dark:text-emerald-400" }}
          onClick={() => handleCardClick('/notes')}
        />
        <StatCard 
          title="Mock Score (Avg)" 
          value={stats.mockScore} 
          icon={Trophy}
          colorClass={{ bg: "bg-amber-100 dark:bg-amber-500/20", text: "text-amber-600 dark:text-amber-400" }}
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-white dark:bg-gray-900/50 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">Weekly Problem Activity</h2>
            <select className="text-sm border-none bg-transparent text-gray-500 dark:text-gray-400 focus:ring-0 cursor-pointer outline-none">
              <option>This Week</option>
              <option>Last Week</option>
            </select>
          </div>
          <div className="h-[280px] w-full">
            {activityData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSolved" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#818cf8' }}
                  />
                  <Area type="monotone" dataKey="solved" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorSolved)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full rounded-3xl border border-dashed border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/40 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                No activity yet. Start solving problems to see your weekly progress here.
              </div>
            )}
          </div>
        </motion.div>

        {/* Recent Activity Timeline */}
        <motion.div variants={itemVariants} className="bg-white dark:bg-gray-900/50 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-6">Recent Activity</h2>
          
          <div className="flex-1 relative">
            <div className="absolute top-0 bottom-0 left-[11px] w-px bg-gray-200 dark:bg-gray-800" />
            
            <div className="space-y-6 relative">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => {
                  const Icon = getActivityIcon(activity.type);
                  return (
                    <div key={activity._id || index} className="flex gap-4">
                      <div className="relative z-10 w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-900/50 flex items-center justify-center ring-4 ring-white dark:ring-[#09090b]">
                        <Icon className="w-3 h-3 text-slate-600 dark:text-slate-300" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {activity.description || getActivityLabel(activity.type)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {formatRelativeTime(activity.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/40 p-6 text-sm text-gray-500 dark:text-gray-400">
                  No activity yet. Create notes, solve problems, or log mock sessions to populate your timeline.
                </div>
              )}
            </div>
          </div>

          <button className="w-full mt-6 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors flex items-center justify-center gap-1">
            View All Activity
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>

      {/* Quick Access or Recommended */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link to="/dsa" className="group p-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg relative overflow-hidden flex items-center justify-between">
          <div className="relative z-10 text-white">
            <h3 className="text-lg font-bold">Continue Blind 75</h3>
            <p className="text-indigo-100 text-sm mt-1">You are 12% through the Must-Do list.</p>
          </div>
          <div className="relative z-10 bg-white/20 p-3 rounded-xl backdrop-blur-md group-hover:scale-110 transition-transform">
            <ArrowRight className="w-6 h-6 text-white" />
          </div>
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        </Link>
        <Link to="/mock" className="group p-6 bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-800 dark:to-black rounded-2xl shadow-lg relative overflow-hidden flex items-center justify-between">
          <div className="relative z-10 text-white">
            <h3 className="text-lg font-bold">Schedule Mock Interview</h3>
            <p className="text-gray-400 text-sm mt-1">Practice with peer or AI to build confidence.</p>
          </div>
          <div className="relative z-10 bg-gray-700/50 p-3 rounded-xl backdrop-blur-md group-hover:scale-110 transition-transform">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
        </Link>
      </motion.div>

    </motion.div>
  );
};

export default Dashboard;
