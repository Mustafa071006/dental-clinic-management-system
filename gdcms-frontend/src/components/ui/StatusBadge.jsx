import { formatStatus } from '../../utils/formatLabel';

/**
 * Status yang didukung:
 * active, complete, completed, pending, scheduled
 */
const StatusBadge = ({ status }) => {
  if (!status) return null;

  const normalized = status.toLowerCase();

  const styles = {
    active: 'bg-gray-100 text-gray-600 border border-gray-300',
    complete: 'bg-emerald-50 text-emerald-600 border border-emerald-300',
    completed: 'bg-emerald-50 text-emerald-600 border border-emerald-300',
    pending: 'bg-amber-50 text-amber-600 border border-amber-300',
    scheduled: 'bg-blue-50 text-blue-600 border border-blue-200',
  };

  const style = styles[normalized] || 'bg-gray-100 text-gray-600 border border-gray-300';
  const label = formatStatus(status);

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors duration-150 ${style}`}>
      {label}
    </span>
  );
};

export default StatusBadge;