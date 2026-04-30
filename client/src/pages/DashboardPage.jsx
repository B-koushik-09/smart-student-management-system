import { useState, useEffect, Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import { HiOutlineAcademicCap, HiOutlineOfficeBuilding, HiOutlineUsers, HiOutlineTrendingUp } from 'react-icons/hi';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { CardSkeleton, ChartSkeleton } from '../components/Skeletons';
import toast from 'react-hot-toast';

const FloatingObject = lazy(() => import('../components/FloatingObject'));

const COLORS = ['#6366f1', '#0ea5e9', '#22c55e', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6', '#14b8a6'];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.4 }
  })
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get('/students/stats/dashboard');
        setStats(res.data.stats);
      } catch (err) {
        toast.error('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div>
        <div className="h-10 w-64 bg-white/5 rounded-md animate-pulse mb-8" />
        <CardSkeleton count={4} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Students', value: stats?.totalStudents || 0, icon: HiOutlineAcademicCap, color: 'from-indigo-500 to-purple-600' },
    { label: 'Active Students', value: stats?.activeStudents || 0, icon: HiOutlineUsers, color: 'from-emerald-500 to-teal-600' },
    { label: 'Departments', value: stats?.totalDepartments || 0, icon: HiOutlineOfficeBuilding, color: 'from-sky-500 to-cyan-600' },
    { label: 'Avg CGPA', value: stats?.averageCGPA || '0.00', icon: HiOutlineTrendingUp, color: 'from-amber-500 to-orange-600' },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card px-4 py-2 text-sm">
          <p className="text-text-primary font-medium">{label}</p>
          <p className="text-primary-light">{payload[0].value} students</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      {/* Header with 3D element */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl md:text-3xl font-bold text-text-primary"
          >
            Welcome back, <span className="gradient-text">{user?.name}</span>
          </motion.h1>
          <p className="text-text-secondary mt-1">Here&apos;s your overview for today</p>
        </div>
        <Suspense fallback={null}>
          <FloatingObject size="small" className="hidden md:block opacity-70" />
        </Suspense>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="glass-card-hover p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                <card.icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-2xl font-bold text-text-primary">{card.value}</p>
            <p className="text-sm text-text-secondary mt-0.5">{card.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Department Distribution Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-semibold text-text-primary mb-4">Department Distribution</h3>
          {stats?.departmentStats?.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={stats.departmentStats.map(d => ({ name: d._id?.split(' ')[0] || 'N/A', count: d.count, fullName: d._id }))}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {stats.departmentStats.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[280px] flex items-center justify-center text-text-secondary">No data available</div>
          )}
        </motion.div>

        {/* Year Distribution Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-semibold text-text-primary mb-4">Year-wise Distribution</h3>
          {stats?.yearStats?.length > 0 ? (
            <div className="flex items-center">
              <ResponsiveContainer width="60%" height={280}>
                <PieChart>
                  <Pie data={stats.yearStats.map(y => ({ name: `Year ${y._id}`, value: y.count }))} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value">
                    {stats.yearStats.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="w-[40%] space-y-3">
                {stats.yearStats.map((y, i) => (
                  <div key={y._id} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-sm text-text-secondary">Year {y._id}</span>
                    <span className="text-sm text-text-primary font-medium ml-auto">{y.count}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-[280px] flex items-center justify-center text-text-secondary">No data available</div>
          )}
        </motion.div>
      </div>

      {/* Recent Students */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-card p-6"
      >
        <h3 className="text-lg font-semibold text-text-primary mb-4">Recent Entries</h3>
        {stats?.recentStudents?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left py-3 px-4 text-text-secondary font-medium">Name</th>
                  <th className="text-left py-3 px-4 text-text-secondary font-medium">Roll No.</th>
                  <th className="text-left py-3 px-4 text-text-secondary font-medium hidden sm:table-cell">Department</th>
                  <th className="text-left py-3 px-4 text-text-secondary font-medium hidden md:table-cell">Email</th>
                  <th className="text-left py-3 px-4 text-text-secondary font-medium">Added</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentStudents.map((s, i) => (
                  <motion.tr
                    key={s._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 + i * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/3 transition-colors"
                  >
                    <td className="py-3 px-4 text-text-primary font-medium">{s.name}</td>
                    <td className="py-3 px-4 text-primary-light font-mono text-xs">{s.rollNumber}</td>
                    <td className="py-3 px-4 text-text-secondary hidden sm:table-cell">{s.department}</td>
                    <td className="py-3 px-4 text-text-secondary hidden md:table-cell">{s.email}</td>
                    <td className="py-3 px-4 text-text-secondary">{new Date(s.createdAt).toLocaleDateString()}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-text-secondary text-center py-8">No students added yet. Start by adding your first student!</p>
        )}
      </motion.div>
    </div>
  );
}
