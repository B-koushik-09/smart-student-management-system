import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { TableSkeleton } from '../components/Skeletons';
import EmptyState from '../components/EmptyState';
import {
  HiOutlineSearch, HiOutlinePencil, HiOutlineTrash, HiOutlinePlus,
  HiOutlineChevronLeft, HiOutlineChevronRight, HiOutlineFilter, HiOutlineX,
  HiOutlineDownload
} from 'react-icons/hi';

const DEPARTMENTS = [
  'Computer Science', 'Electronics', 'Mechanical', 'Civil',
  'Electrical', 'Information Technology', 'Chemical', 'Biotechnology'
];

export default function StudentsPage() {
  const { isAdmin } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [exporting, setExporting] = useState(false);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 10 });
      if (search) params.append('search', search);
      if (department) params.append('department', department);
      if (year) params.append('year', year);

      const res = await API.get(`/students?${params}`);
      setStudents(res.data.students);
      setTotalPages(res.data.totalPages);
      setTotal(res.data.total);
    } catch (err) {
      toast.error('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  }, [page, search, department, year]);

  useEffect(() => {
    const timer = setTimeout(fetchStudents, 300);
    return () => clearTimeout(timer);
  }, [fetchStudents]);

  const handleDelete = async (id) => {
    try {
      await API.delete(`/students/${id}`);
      toast.success('Student deleted');
      setDeleteId(null);
      fetchStudents();
    } catch (err) {
      toast.error('Failed to delete student');
    }
  };

  const clearFilters = () => {
    setSearch('');
    setDepartment('');
    setYear('');
    setPage(1);
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const params = new URLSearchParams();
      if (department) params.append('department', department);
      if (year) params.append('year', year);

      const res = await API.get(`/students/export/csv?${params}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `students_export_${new Date().getTime()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Export successful');
    } catch (err) {
      toast.error('Failed to export students');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary">Students</h1>
          <p className="text-text-secondary mt-1">{total} total records</p>
        </div>
        <div className="flex items-center gap-3">
          {isAdmin && (
            <motion.button whileTap={{ scale: 0.97 }} onClick={handleExport} disabled={exporting || students.length === 0} className="px-4 py-2 rounded-xl border border-white/10 text-text-secondary hover:bg-white/5 hover:text-text-primary disabled:opacity-50 flex items-center gap-2 transition-all text-sm font-medium">
              {exporting ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <HiOutlineDownload className="w-5 h-5" />}
              Export
            </motion.button>
          )}
          {isAdmin && (
            <Link to="/students/add">
              <motion.button whileTap={{ scale: 0.97 }} className="btn-primary flex items-center gap-2">
                <HiOutlinePlus className="w-5 h-5" /> Add Student
              </motion.button>
            </Link>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="glass-card p-4 mb-6">
        <div className="flex flex-col sm:flex-row items-end gap-3">
          <div className="relative flex-1 w-full">
            <label htmlFor="search-students" className="block text-xs font-medium text-text-secondary mb-1.5 ml-1">Search Students</label>
            <div className="relative">
              <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary w-5 h-5" />
              <input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="input-field pl-10 border-white/10 focus:border-primary/50"
                placeholder="Name, Roll No, or Email..."
                id="search-students"
              />
            </div>
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)} 
            className={`flex items-center justify-center gap-2 px-4 py-2.5 h-[46px] rounded-xl border transition-all text-sm font-medium shrink-0 ${showFilters || department || year ? 'border-primary/40 bg-primary/10 text-primary-light' : 'border-white/10 text-text-secondary hover:border-white/20'}`}
          >
            <HiOutlineFilter className="w-4 h-4" /> Filters
            {(department || year) && <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />}
          </button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-white/5">
                <select value={department} onChange={(e) => { setDepartment(e.target.value); setPage(1); }} className="input-field w-auto min-w-[180px]">
                  <option value="">All Departments</option>
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <select value={year} onChange={(e) => { setYear(e.target.value); setPage(1); }} className="input-field w-auto min-w-[120px]">
                  <option value="">All Years</option>
                  {[1,2,3,4].map(y => <option key={y} value={y}>Year {y}</option>)}
                </select>
                {(department || year || search) && (
                  <button onClick={clearFilters} className="flex items-center gap-1 px-3 py-2 text-sm text-red-400 hover:text-red-300 transition-colors">
                    <HiOutlineX className="w-4 h-4" /> Clear
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Students Table */}
      <div className="glass-card overflow-hidden">
        {loading ? (
          <TableSkeleton rows={10} cols={isAdmin ? 8 : 7} />
        ) : students.length === 0 ? (
          <EmptyState type={search || department || year ? 'search' : 'students'} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 bg-white/2">
                  <th className="text-left py-3.5 px-4 text-text-secondary font-medium">Name</th>
                  <th className="text-left py-3.5 px-4 text-text-secondary font-medium">Roll No.</th>
                  <th className="text-left py-3.5 px-4 text-text-secondary font-medium hidden md:table-cell">Department</th>
                  <th className="text-left py-3.5 px-4 text-text-secondary font-medium hidden lg:table-cell">Email</th>
                  <th className="text-left py-3.5 px-4 text-text-secondary font-medium hidden lg:table-cell">Phone</th>
                  <th className="text-left py-3.5 px-4 text-text-secondary font-medium hidden sm:table-cell">Year</th>
                  <th className="text-left py-3.5 px-4 text-text-secondary font-medium">Status</th>
                  {isAdmin && <th className="text-right py-3.5 px-4 text-text-secondary font-medium">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {students.map((s, i) => (
                  <motion.tr
                    key={s._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-white/5 hover:bg-white/3 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xs font-bold text-white shrink-0">
                          {s.name.charAt(0)}
                        </div>
                        <span className="text-text-primary font-medium">{s.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-primary-light font-mono text-xs">{s.rollNumber}</td>
                    <td className="py-3 px-4 text-text-secondary hidden md:table-cell">{s.department}</td>
                    <td className="py-3 px-4 text-text-secondary hidden lg:table-cell">{s.email}</td>
                    <td className="py-3 px-4 text-text-secondary hidden lg:table-cell">{s.phone}</td>
                    <td className="py-3 px-4 text-text-secondary hidden sm:table-cell">{s.year}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        s.status === 'active' ? 'bg-emerald-500/15 text-emerald-400' :
                        s.status === 'graduated' ? 'bg-sky-500/15 text-sky-400' :
                        'bg-red-500/15 text-red-400'
                      }`}>
                        {s.status}
                      </span>
                    </td>
                    {isAdmin && (
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link to={`/students/edit/${s._id}`} className="p-2 rounded-lg hover:bg-primary/10 text-text-secondary hover:text-primary-light transition-all">
                            <HiOutlinePencil className="w-4 h-4" />
                          </Link>
                          <button onClick={() => setDeleteId(s._id)} className="p-2 rounded-lg hover:bg-red-500/10 text-text-secondary hover:text-red-400 transition-all">
                            <HiOutlineTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-white/5">
            <p className="text-sm text-text-secondary">
              Page {page} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="p-2 rounded-lg border border-white/10 text-text-secondary hover:bg-white/5 disabled:opacity-30 transition-all">
                <HiOutlineChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) pageNum = i + 1;
                else if (page <= 3) pageNum = i + 1;
                else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
                else pageNum = page - 2 + i;
                return (
                  <button key={pageNum} onClick={() => setPage(pageNum)} className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${page === pageNum ? 'bg-primary text-white' : 'text-text-secondary hover:bg-white/5'}`}>
                    {pageNum}
                  </button>
                );
              })}
              <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="p-2 rounded-lg border border-white/10 text-text-secondary hover:bg-white/5 disabled:opacity-30 transition-all">
                <HiOutlineChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setDeleteId(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card p-6 max-w-sm w-full"
            >
              <h3 className="text-lg font-semibold text-text-primary mb-2">Delete Student?</h3>
              <p className="text-text-secondary text-sm mb-6">This action cannot be undone. The student record will be permanently removed.</p>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setDeleteId(null)} className="px-4 py-2 rounded-xl border border-white/10 text-text-secondary hover:bg-white/5 text-sm font-medium transition-all">Cancel</button>
                <button onClick={() => handleDelete(deleteId)} className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-all">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
