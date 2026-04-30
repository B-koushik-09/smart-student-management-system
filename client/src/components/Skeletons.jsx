import { motion } from 'framer-motion';

/**
 * Table loading skeleton - mimics a data table
 */
export function TableSkeleton({ rows = 5, cols = 6 }) {
  return (
    <div className="overflow-hidden">
      {/* Header skeleton */}
      <div className="flex gap-4 px-4 py-3.5 border-b border-white/5 bg-white/2">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="flex-1">
            <div className="h-3.5 bg-white/5 rounded-md w-3/4 animate-pulse" />
          </div>
        ))}
      </div>
      {/* Row skeletons */}
      {Array.from({ length: rows }).map((_, ri) => (
        <motion.div
          key={ri}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: ri * 0.05 }}
          className="flex items-center gap-4 px-4 py-3 border-b border-white/5"
        >
          {Array.from({ length: cols }).map((_, ci) => (
            <div key={ci} className="flex-1">
              {ci === 0 ? (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/5 animate-pulse shrink-0" />
                  <div className="h-3.5 bg-white/5 rounded-md w-24 animate-pulse" />
                </div>
              ) : (
                <div
                  className="h-3.5 bg-white/5 rounded-md animate-pulse"
                  style={{ width: `${40 + Math.random() * 40}%`, animationDelay: `${ci * 100}ms` }}
                />
              )}
            </div>
          ))}
        </motion.div>
      ))}
    </div>
  );
}

/**
 * Card loading skeleton
 */
export function CardSkeleton({ count = 4 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="glass-card p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-white/5 animate-pulse" />
          </div>
          <div className="h-7 w-16 bg-white/5 rounded-md animate-pulse mb-1" />
          <div className="h-3.5 w-24 bg-white/5 rounded-md animate-pulse mt-2" />
        </motion.div>
      ))}
    </div>
  );
}

/**
 * Chart loading skeleton
 */
export function ChartSkeleton() {
  return (
    <div className="glass-card p-6">
      <div className="h-5 w-40 bg-white/5 rounded-md animate-pulse mb-6" />
      <div className="flex items-end gap-3 h-[240px] px-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex-1 flex flex-col justify-end">
            <div
              className="bg-white/5 rounded-t-md animate-pulse"
              style={{ height: `${30 + Math.random() * 60}%`, animationDelay: `${i * 150}ms` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Profile form skeleton
 */
export function ProfileSkeleton() {
  return (
    <div className="glass-card p-6 md:p-8 max-w-2xl animate-pulse">
      <div className="flex items-center gap-5 mb-8">
        <div className="w-20 h-20 rounded-full bg-white/5" />
        <div>
          <div className="h-6 w-36 bg-white/5 rounded-md mb-2" />
          <div className="h-4 w-24 bg-white/5 rounded-md" />
        </div>
      </div>
      <div className="space-y-5">
        {[1, 2, 3].map(i => (
          <div key={i}>
            <div className="h-3.5 w-20 bg-white/5 rounded-md mb-2" />
            <div className="h-11 bg-white/5 rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}
