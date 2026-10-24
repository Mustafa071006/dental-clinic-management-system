import { Inbox } from 'lucide-react';

const EmptyState = ({ message = 'Data tidak ditemukan.', className = '' }) => {
  return (
    <div
      className={`flex flex-col items-center justify-center py-16 px-4 text-gray-400 animate-fadeIn ${className}`}
    >
      <Inbox size={40} strokeWidth={1.2} className="mb-3" />
      <p className="text-sm text-center">{message}</p>
    </div>
  );
};

export default EmptyState;
