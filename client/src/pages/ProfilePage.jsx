import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import toast from 'react-hot-toast';
import { HiOutlineUser, HiOutlineMail, HiOutlineShieldCheck, HiOutlineCalendar } from 'react-icons/hi';
import { ProfileSkeleton } from '../components/Skeletons';

export default function ProfilePage() {
  const { user, login } = useAuth();
  const [form, setForm] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({ name: user.name, email: user.email });
      setLoading(false);
    }
  }, [user]);

  const handleChange = (e) => {
    const updated = { ...form, [e.target.name]: e.target.value };
    setForm(updated);
    setHasChanges(updated.name !== user.name || updated.email !== user.email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return toast.error('Name and email are required');
    setSaving(true);
    try {
      const res = await API.put('/auth/profile', form);
      // Update local storage and context
      const updatedUser = res.data.user;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      // Force context to re-read - quick workaround
      window.dispatchEvent(new Event('storage'));
      toast.success('Profile updated successfully');
      setHasChanges(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <ProfileSkeleton />;

  return (
    <div>
      <motion.h1
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-2xl md:text-3xl font-bold text-text-primary mb-6"
      >
        My Profile
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 md:p-8 max-w-2xl"
      >
        {/* Avatar section */}
        <div className="flex items-center gap-5 mb-8 pb-6 border-b border-white/5">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-2xl font-bold text-white shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-text-primary">{user?.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                user?.role === 'admin'
                  ? 'bg-amber-500/15 text-amber-400'
                  : 'bg-primary/15 text-primary-light'
              }`}>
                <HiOutlineShieldCheck className="w-3.5 h-3.5" />
                {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-text-secondary mb-2">
              <HiOutlineUser className="w-4 h-4" /> Full Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="input-field"
              placeholder="Your name"
              id="profile-name"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-text-secondary mb-2">
              <HiOutlineMail className="w-4 h-4" /> Email Address
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="input-field"
              placeholder="your@email.com"
              id="profile-email"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-text-secondary mb-2">
              <HiOutlineShieldCheck className="w-4 h-4" /> Role
            </label>
            <input
              value={user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
              disabled
              className="input-field opacity-50 cursor-not-allowed"
              id="profile-role"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-text-secondary mb-2">
              <HiOutlineCalendar className="w-4 h-4" /> Member Since
            </label>
            <input
              value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
              disabled
              className="input-field opacity-50 cursor-not-allowed"
              id="profile-joined"
            />
          </div>

          <div className="pt-2">
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={saving || !hasChanges}
              className="btn-primary"
              id="profile-save"
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </span>
              ) : 'Save Changes'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
