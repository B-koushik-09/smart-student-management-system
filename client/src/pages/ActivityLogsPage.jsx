import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import API from '../utils/api';
import { TableSkeleton } from '../components/Skeletons';
import EmptyState from '../components/EmptyState';
import toast from 'react-hot-toast';
import {
  HiOutlineFilter, HiOutlinePencil, HiOutlineTrash, HiOutlinePlus,
  HiOutlineLogin, HiOutlineUserAdd, HiOutlineDocumentDownload,
  HiOutlineChevronLeft, HiOutlineChevronRight
} from 'react-icons/hi';

const actionIcons = {
  create: { icon: HiOutlinePlus, color: 'text-emerald-400 bg-emerald-500/15' },
  update: { icon: HiOutlinePencil, color: 'text-sky-400 bg-sky-500/15' },
  delete: { icon: HiOutlineTrash, color: 'text-red-400 bg-red-500/15' },
  login: { icon: HiOutlineLogin, color: 'text-indigo-400 bg-indigo-500/15' },
  register: { icon: HiOutlineUserAdd, color: 'text-purple-400 bg-purple-500/15' },
  export: { icon: HiOutlineDocumentDownload, color: 'text-amber-400 bg-amber-500/15' },
};

function formatTimeAgo(dateStr) {
  const seconds = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [actionFilter, setActionFilter] = useState('');

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 15 });
      if (actionFilter) params.append('action', actionFilter);
      const res = await API.get(`/logs?${params}`);
      setLogs(res.data.logs);
      setTotalPages(res.data.totalPages);
      setTotal(res.data.total);
    } catch (err) {
      toast.error('Failed to fetch logs');
    } finally {
      setLoading(false);
    }
  }, [page, actionFilter]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl md:text-3xl font-bold text-text-primary"
          >
            Activity Logs
          </motion.h1>
          <p className="text-text-secondary mt-1">{total} total entries</p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <HiOutlineFilter className="w-4 h-4 text-text-secondary" />
          <select
            value={actionFilter}
            onChange={(e) => { setActionFilter(e.target.value); setPage(1); }}
            className="input-field w-auto min-w-[150px] text-sm"
            id="log-action-filter"
          >
            <option value="">All Actions</option>
            <option value="create">Created</option>
            <option value="update">Updated</option>
            <option value="delete">Deleted</option>
            <option value="login">Login</option>
            <option value="register">Register</option>
            <option value="export">Export</option>
          </select>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        {loading ? (
          <TableSkeleton rows={8} cols={4} />
        ) : logs.length === 0 ? (
          <EmptyState type="logs" />
        ) : (
          <>
            <div className="divide-y divide-white/5">
              {logs.map((log, i) => {
                const actionData = actionIcons[log.action] || actionIcons.create;
                const ActionIcon = actionData.icon;
                return (
                  <motion.div
                    key={log._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex items-start gap-4 px-4 md:px-6 py-4 hover:bg-white/2 transition-colors"
                  >
                    <div className={`w-9 h-9 rounded-xl ${actionData.color} flex items-center justify-center shrink-0 mt-0.5`}>
                      <ActionIcon className="w-4.5 h-4.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-text-primary font-medium">{log.details}</p>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                        <span className="text-xs text-text-secondary">
                          by {log.user?.name || 'Unknown'}
                        </span>
                        <span className="text-xs text-text-secondary/50">•</span>
                        <span className="text-xs text-text-secondary">
                          {formatTimeAgo(log.createdAt)}
                        </span>
                        <span className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-medium uppercase tracking-wider ${actionData.color}`}>
                          {log.action}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-text-secondary/40 hidden md:block shrink-0">
                      {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </motion.div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 md:px-6 py-3 border-t border-white/5">
                <p className="text-sm text-text-secondary">
                  Page {page} of {totalPages}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="p-2 rounded-lg border border-white/10 text-text-secondary hover:bg-white/5 disabled:opacity-30 transition-all"
                  >
                    <HiOutlineChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-sm text-text-secondary px-2">{page}</span>
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="p-2 rounded-lg border border-white/10 text-text-secondary hover:bg-white/5 disabled:opacity-30 transition-all"
                  >
                    <HiOutlineChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
