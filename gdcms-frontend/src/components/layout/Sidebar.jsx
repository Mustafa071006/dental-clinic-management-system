import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Calendar,
  Stethoscope,
  ArrowLeftRight,
  LogOut,
  X,
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import LogoutConfirmModal from '../ui/LogoutConfirmModal';

const adminMenuItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
  { label: 'Pasien', icon: Users, path: '/admin/patients' },
  { label: 'Pemeriksaan', icon: ClipboardList, path: '/admin/examinations' },
  { label: 'Jadwal Kontrol', icon: Calendar, path: '/admin/control-schedule' },
  { label: 'Dokter', icon: Stethoscope, path: '/admin/doctors' },
  { label: 'Transfer Pasien', icon: ArrowLeftRight, path: '/admin/transfers' },
];

const doctorMenuItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/doctor/dashboard' },
  { label: 'Pasien Saya', icon: Users, path: '/doctor/patients' },
];

const Sidebar = ({ isOpen = false, onClose }) => {
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const menuItems = isAdmin ? adminMenuItems : doctorMenuItems;
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  // Logout baru dijalankan setelah pengguna mengonfirmasi di dialog
  const handleLogout = () => {
    setIsLogoutConfirmOpen(false);
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden animate-fadeIn"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          w-[280px] min-h-screen bg-sidebar flex flex-col flex-shrink-0
          fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-out
          lg:sticky lg:top-0 lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between gap-3 px-6 py-5 border-b border-white/10">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 bg-gold rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-base">G</span>
            </div>
            <div className="leading-tight min-w-0">
              <p className="text-white font-bold text-sm truncate">Golden Dental</p>
              <p className="text-gold text-[10px] font-semibold tracking-widest uppercase truncate">
                Center Management
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup menu"
            className="lg:hidden p-1.5 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-colors flex-shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
                        isActive
                          ? 'bg-gold text-white'
                          : 'text-gray-300 hover:bg-white/10 hover:text-white'
                      }`
                    }
                  >
                    <Icon size={18} strokeWidth={1.8} />
                    {item.label}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="px-3 pb-5">
          <button
            onClick={() => setIsLogoutConfirmOpen(true)}
            aria-haspopup="dialog"
            className="group flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-red-500/10 hover:text-red-300 active:scale-[0.98] transition-all duration-150 w-full text-left"
          >
            <LogOut
              size={18}
              strokeWidth={1.8}
              className="transition-transform duration-200 ease-out group-hover:translate-x-0.5"
            />
            Logout
          </button>
        </div>
      </aside>

      {isLogoutConfirmOpen && (
        <LogoutConfirmModal
          roleLabel={isAdmin ? 'Administrator' : 'Dokter'}
          onCancel={() => setIsLogoutConfirmOpen(false)}
          onConfirm={handleLogout}
        />
      )}
    </>
  );
};

export default Sidebar;
