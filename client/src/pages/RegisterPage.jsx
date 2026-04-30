import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineUser, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return toast.error('Please fill all fields');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');
    setIsLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data?.errors?.[0] || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="fixed top-20 left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 right-20 w-72 h-72 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card p-8 md:p-10 w-full max-w-lg relative z-10"
      >
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-text-primary mb-2">Create Account</h1>
          <p className="text-text-secondary">Join the Smart Student Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Full Name</label>
            <div className="relative">
              <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary w-5 h-5" />
              <input name="name" value={form.name} onChange={handleChange} className="input-field pl-12" placeholder="John Doe" id="register-name" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Email</label>
            <div className="relative">
              <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary w-5 h-5" />
              <input type="email" name="email" value={form.email} onChange={handleChange} className="input-field pl-12" placeholder="you@example.com" id="register-email" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Password</label>
            <div className="relative">
              <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary w-5 h-5" />
              <input type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} className="input-field pl-12 pr-12" placeholder="••••••••" id="register-password" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary">
                {showPassword ? <HiOutlineEyeOff className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Confirm Password</label>
            <div className="relative">
              <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary w-5 h-5" />
              <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} className="input-field pl-12" placeholder="••••••••" id="register-confirm-password" />
            </div>
          </div>

          <motion.button whileTap={{ scale: 0.98 }} type="submit" disabled={isLoading} className="btn-primary w-full py-3 text-base mt-2" id="register-submit">
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating...
              </span>
            ) : 'Create Account'}
          </motion.button>
        </form>

        <p className="text-center text-text-secondary text-sm mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-light hover:text-primary font-medium">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
