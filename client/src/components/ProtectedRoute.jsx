import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="w-10 h-10 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  
  // Status check for non-admins
  if (user.role !== 'admin') {
    if (user.status === 'pending') {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-surface p-4 text-center">
          <div className="glass-card p-10 max-w-md w-full">
            <h2 className="text-2xl font-bold text-yellow-500 mb-4">Approval Pending</h2>
            <p className="text-text-secondary mb-6">Your account is currently awaiting admin approval. Please check back later.</p>
            <button onClick={() => window.location.href = '/login'} className="btn-secondary w-full">Back to Login</button>
          </div>
        </div>
      );
    }
    if (user.status === 'rejected') {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-surface p-4 text-center">
          <div className="glass-card p-10 max-w-md w-full border-red-500/20">
            <h2 className="text-2xl font-bold text-red-500 mb-4">Account Rejected</h2>
            <p className="text-text-secondary mb-6">Your account registration has been rejected by the administrator.</p>
            <button onClick={() => window.location.href = '/login'} className="btn-secondary w-full">Back to Login</button>
          </div>
        </div>
      );
    }
  }

  return children;
}
