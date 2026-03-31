import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, Code2, BookOpen, Building2,
  StickyNote, Mic2, X, Sparkles, CalendarDays, RefreshCcw
} from "lucide-react";
import { cn } from "../../utils/cn";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/planner", label: "Daily Planner", icon: CalendarDays },
  { path: "/revisions", label: "Auto-Revisions", icon: RefreshCcw },
  { path: "/dsa", label: "DSA Tracker", icon: Code2 },
  { path: "/subjects", label: "CS Subjects", icon: BookOpen },
  { path: "/applications", label: "Applications", icon: Building2 },
  { path: "/notes", label: "My Notes", icon: StickyNote },
  { path: "/mock", label: "Mock Interviews", icon: Mic2 },
];

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 transform bg-white dark:bg-gray-950 border-r border-gray-100 dark:border-gray-800 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0",
          isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
              <span className="font-bold text-lg">P</span>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
              PlaceMate
            </span>
          </div>
          <button
            type="button"
            className="lg:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            onClick={onClose}
          >
            <span className="sr-only">Close sidebar</span>
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col overflow-y-auto px-4 pt-6 pb-4">
          <div className="space-y-1">
            <div className="text-xs font-semibold leading-6 text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 px-2">
              Preparation
            </div>
            {navItems.map(({ path, label, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                onClick={onClose}
                end={path === '/dashboard'}
                className={({ isActive }) =>
                  cn(
                    "group flex items-center gap-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-900 dark:hover:text-white"
                  )
                }
              >
                <Icon
                  className="h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-110"
                  aria-hidden="true"
                />
                {label}
              </NavLink>
            ))}
          </div>

          <div className="mt-auto pt-8">
            <div className="rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 p-4 dark:from-indigo-950/40 dark:to-purple-950/40 border border-indigo-100/50 dark:border-indigo-900/50">
              <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-semibold mb-2">
                <Sparkles className="h-4 w-4" />
                <span>Go Premium</span>
              </div>
              <p className="text-xs text-indigo-900/70 dark:text-indigo-200/60 mb-3">
                Unlock AI mock interviews and advanced resume reviews.
              </p>
              <button className="w-full rounded-md bg-indigo-600 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors">
                Upgrade Now
              </button>
            </div>
          </div>
        </nav>
      </div>

      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity lg:hidden"
          onClick={onClose} 
        />
      )}
    </>
  );
};

export default Sidebar;
