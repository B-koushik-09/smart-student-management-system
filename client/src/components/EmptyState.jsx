import { motion } from 'framer-motion';
import { HiOutlineAcademicCap, HiOutlineDocumentSearch, HiOutlineClipboardList } from 'react-icons/hi';

const illustrations = {
  students: {
    icon: HiOutlineAcademicCap,
    title: 'No students found',
    subtitle: 'Try adjusting your search or filters, or add a new student to get started.'
  },
  search: {
    icon: HiOutlineDocumentSearch,
    title: 'No results found',
    subtitle: 'We couldn\'t find anything matching your search. Try different keywords.'
  },
  logs: {
    icon: HiOutlineClipboardList,
    title: 'No activity yet',
    subtitle: 'Activity logs will appear here as actions are performed in the system.'
  }
};

export default function EmptyState({ type = 'students', action = null }) {
  const { icon: Icon, title, subtitle } = illustrations[type] || illustrations.students;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-primary-light" />
      </div>
      <h3 className="text-lg font-semibold text-text-primary mb-1">{title}</h3>
      <p className="text-text-secondary text-sm max-w-sm">{subtitle}</p>
      {action && <div className="mt-5">{action}</div>}
    </motion.div>
  );
}
