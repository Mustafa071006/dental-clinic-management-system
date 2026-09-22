import { Shield, UserCircle, Menu } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

const TopBar = ({ onMenuClick }) => {
  const { user, isAdmin } = useAuth();

  const displayName = user?.name || user?.email || 'User';

  const roleLabel = isAdmin ? 'Administrator' : 'Doctor Portal';

  return (
    <header className="h-[65px] bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-8 flex-shrink-0 sticky top-0 z-30">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          aria-label="Open menu"
          className="lg:hidden p-1.5 -ml-1.5 rounded-lg text-[#12223a] hover:bg-gray-100 transition-colors flex-shrink-0"
        >
          <Menu size={22} />
        </button>
        <h2 className="text-[#12223a] font-semibold text-base truncate">
          {roleLabel}
        </h2>
      </div>

      <div className="flex items-center gap-2 border border-gray-200 rounded-full px-3 py-1.5 flex-shrink-0">
        {isAdmin ? (
          <Shield size={16} className="text-gold" strokeWidth={2} />
        ) : (
          <UserCircle size={16} className="text-gray-500" strokeWidth={1.8} />
        )}

        <span className="text-[#12223a] text-sm font-medium max-w-[140px] sm:max-w-none truncate">
          {displayName}
        </span>
      </div>
    </header>
  );
};

export default TopBar;
