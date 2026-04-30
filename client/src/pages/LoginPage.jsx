import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import { Suspense, lazy } from 'react';

const FloatingObject = lazy(() => import('../components/FloatingObject'));

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error('Please fill all fields');
    setIsLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)' }}>
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(99,102,241,0.3) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        {/* Glow effects */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-secondary/15 rounded-full blur-3xl" />
        
        <div className="relative z-10 text-center px-12">
          <Suspense fallback={<div className="w-72 h-72" />}>
            <FloatingObject className="mx-auto mb-8" />
          </Suspense>
          <h2 className="text-4xl font-bold text-text-primary mb-4">Smart Student <span className="gradient-text">Management</span></h2>
          <p className="text-text-secondary text-lg max-w-md mx-auto">
            A modern platform for efficient student record management with powerful analytics and insights.
          </p>
        </div>
      </div>

      {/* Right login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-text-primary mb-2">Welcome back</h1>
            <p className="text-text-secondary">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Email</label>
              <div className="relative">
                <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-12"
                  placeholder="you@example.com"
                  id="login-email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Password</label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-12 pr-12"
                  placeholder="••••••••"
                  id="login-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
                >
                  {showPassword ? <HiOutlineEyeOff className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3 text-base"
              id="login-submit"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : 'Sign In'}
            </motion.button>
          </form>

          <p className="text-center text-text-secondary text-sm mt-8">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-primary-light hover:text-primary font-medium transition-colors">
              Create account
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
