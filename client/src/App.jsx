import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layout & Protection
import ProtectedRoute from './components/layout/ProtectedRoute';
import Spinner from './components/common/Spinner';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';

// Feature Pages
import Dashboard from './pages/Dashboard';
import Planner from './pages/Planner';
import RevisionPlanner from './pages/RevisionPlanner';
import DSATracker from './pages/DSATracker';
import Subjects from './pages/Subjects';
import SubjectDetail from './pages/SubjectDetail';
import Applications from './pages/Applications';
import Notes from './pages/Notes';
import MockInterviews from './pages/MockInterviews';

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }
  
  return user ? <Navigate to="/dashboard" replace /> : children;
};

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />
      <Route path="/register" element={
        <PublicRoute>
          <Register />
        </PublicRoute>
      } />

      {/* Protected Routes */}
      <Route path="/" element={<ProtectedRoute />}>
        {/* Redirect root to dashboard */}
        <Route index element={<Navigate to="/dashboard" replace />} />
        
        {/* Main Application Pages */}
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="planner" element={<Planner />} />
        <Route path="revisions" element={<RevisionPlanner />} />
        <Route path="dsa" element={<DSATracker />} />
        <Route path="subjects" element={<Subjects />} />
        <Route path="subjects/:subjectId" element={<SubjectDetail />} />
        <Route path="applications" element={<Applications />} />
        <Route path="notes" element={<Notes />} />
        <Route path="mock" element={<MockInterviews />} />
      </Route>

      {/* Catch-all Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default App;
