import { useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * Shared modal shell — fade+scale animation, ESC to close, backdrop click to
 * close, body scroll lock while open. Purely presentational; callers keep
 * owning their own form state and submit logic.
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxWidth = 'max-w-lg',
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };

    document.addEventListener('keydown', handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 animate-fadeIn"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`bg-white rounded-3xl w-full ${maxWidth} shadow-xl max-h-[90vh] flex flex-col animate-scaleIn`}
      >
        {title && (
          <div className="flex items-center justify-between px-6 pt-6 pb-2 flex-shrink-0">
            <h2 className="text-2xl font-bold text-[#12223a]">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className="p-1.5 rounded-lg text-gray-400 hover:text-[#12223a] hover:bg-gray-100 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        )}

        <div className="px-6 py-4 overflow-y-auto">{children}</div>

        {footer && (
          <div className="flex justify-end gap-3 px-6 py-5 border-t border-gray-100 flex-shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
