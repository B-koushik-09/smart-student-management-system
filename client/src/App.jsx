import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { lazy, Suspense } from 'react';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const StudentsPage = lazy(() => import('./pages/StudentsPage'));
const StudentFormPage = lazy(() => import('./pages/StudentFormPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const ActivityLogsPage = lazy(() => import('./pages/ActivityLogsPage'));

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-text-secondary text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  const SuspenseFallback = () => (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="w-12 h-12 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  );

  return (
    <Suspense fallback={<SuspenseFallback />}>
      <Routes>
      {/* Public routes */}
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <RegisterPage />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/students" element={<StudentsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/students/add" element={
          <ProtectedRoute adminOnly><StudentFormPage /></ProtectedRoute>
        } />
        <Route path="/students/edit/:id" element={
          <ProtectedRoute adminOnly><StudentFormPage /></ProtectedRoute>
        } />
        <Route path="/logs" element={
          <ProtectedRoute adminOnly><ActivityLogsPage /></ProtectedRoute>
        } />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} />} />
      </Routes>
    </Suspense>
  );
}

export default App;
