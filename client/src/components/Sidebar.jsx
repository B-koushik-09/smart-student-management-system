import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { HiOutlineHome, HiOutlineAcademicCap, HiOutlineUserAdd, HiOutlineLogout, HiOutlineMenu, HiOutlineX, HiOutlineUser, HiOutlineClipboardList } from 'react-icons/hi';
import { useState } from 'react';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: HiOutlineHome },
  { to: '/students', label: 'Students', icon: HiOutlineAcademicCap },
  { to: '/profile', label: 'Profile', icon: HiOutlineUser },
];

const adminItems = [
  { to: '/students/add', label: 'Add Student', icon: HiOutlineUserAdd },
  { to: '/logs', label: 'Activity Logs', icon: HiOutlineClipboardList },
];

export default function Sidebar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const allItems = isAdmin ? [...navItems, ...adminItems] : navItems;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-white/5">
        <h1 className="text-xl font-bold gradient-text">SmartSMS</h1>
        <p className="text-xs text-text-secondary mt-1">Student Management</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {allItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-primary/15 text-primary-light border border-primary/20'
                  : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User info */}
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-sm font-bold text-white">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">{user?.name}</p>
            <p className="text-xs text-text-secondary capitalize">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all"
        >
          <HiOutlineLogout className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl glass-card text-text-primary"
      >
        {mobileOpen ? <HiOutlineX className="w-6 h-6" /> : <HiOutlineMenu className="w-6 h-6" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="lg:hidden fixed inset-0 bg-black/60 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        className={`fixed lg:static z-40 h-screen w-64 bg-surface-light/95 backdrop-blur-xl border-r border-white/5 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } transition-transform duration-300`}
      >
        <SidebarContent />
      </motion.aside>
    </>
  );
}
