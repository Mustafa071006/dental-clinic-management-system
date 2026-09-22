import { useContext } from 'react';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';
import { ToastContext } from '../../context/ToastContext';

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
};

const STYLES = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  error: 'border-red-200 bg-red-50 text-red-700',
  info: 'border-gray-200 bg-white text-[#12223a]',
};

const ICON_COLOR = {
  success: 'text-emerald-500',
  error: 'text-red-500',
  info: 'text-gold',
};

const ToastViewport = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) return null;
  const { toasts, dismiss } = ctx;

  return (
    <div
      className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-sm pointer-events-none"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((toast) => {
        const Icon = ICONS[toast.type] || Info;
        return (
          <div
            key={toast.id}
            role="status"
            className={`pointer-events-auto flex items-start gap-3 rounded-xl border shadow-lg px-4 py-3.5 animate-slideInRight ${STYLES[toast.type] || STYLES.info}`}
          >
            <Icon size={18} className={`mt-0.5 flex-shrink-0 ${ICON_COLOR[toast.type] || ICON_COLOR.info}`} />
            <p className="text-sm font-medium leading-snug flex-1">{toast.message}</p>
            <button
              type="button"
              onClick={() => dismiss(toast.id)}
              aria-label="Dismiss notification"
              className="text-current opacity-50 hover:opacity-100 transition-opacity flex-shrink-0"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ToastViewport;
