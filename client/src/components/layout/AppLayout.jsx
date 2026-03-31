// src/components/layout/AppLayout.jsx
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import WelcomeModal from "../common/WelcomeModal";

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex bg-gray-50 dark:bg-[#09090b] min-h-screen text-gray-900 dark:text-gray-100 font-sans selection:bg-indigo-500/30">
      
      {/* Sidebar Component */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden min-h-screen">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
          <Outlet />
        </main>
      </div>

      {/* Welcome Onboarding Interaction */}
      <WelcomeModal />
    </div>
  );
};

export default AppLayout;
