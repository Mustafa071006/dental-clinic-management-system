import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { LogOut } from 'lucide-react';
import Button from './Button';

// Jeda singkat agar status "memproses" sempat terlihat sebelum dialog menutup
const CONFIRM_DELAY_MS = 600;

/**
 * Dialog konfirmasi logout — animasi masuk (pegas halus) dan keluar, ESC /
 * klik latar untuk batal, fokus terkunci di dalam dialog, scroll body dikunci.
 * Di-render lewat portal karena sidebar memakai transform, yang membuat
 * elemen `fixed` di dalamnya ikut terkurung di area sidebar.
 *
 * Pemanggil cukup me-mount komponen ini saat dibutuhkan; `onCancel` dan
 * `onConfirm` baru dipanggil setelah animasi keluar selesai.
 */
const LogoutConfirmModal = ({ roleLabel, onCancel, onConfirm }) => {
  // 'open' → 'processing' → 'closing'
  const [phase, setPhase] = useState('open');
  const panelRef = useRef(null);
  const afterCloseRef = useRef(onCancel);
  const timerRef = useRef(null);

  const isProcessing = phase === 'processing';
  const isClosing = phase === 'closing';
  const isBusy = isProcessing || isClosing;

  const handleCancel = () => {
    if (isBusy) return;
    afterCloseRef.current = onCancel;
    setPhase('closing');
  };

  const handleConfirm = () => {
    if (isBusy) return;
    setPhase('processing');
    timerRef.current = setTimeout(() => {
      afterCloseRef.current = onConfirm;
      setPhase('closing');
    }, CONFIRM_DELAY_MS);
  };

  const handleAnimationEnd = (e) => {
    if (isClosing && e.animationName === 'dialogOut') {
      afterCloseRef.current?.();
    }
  };

  // Fokus awal ke tombol "Batal" (pilihan paling aman), kembalikan fokus saat ditutup
  useEffect(() => {
    const previouslyFocused = document.activeElement;
    panelRef.current?.querySelector('button')?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      clearTimeout(timerRef.current);
      document.body.style.overflow = previousOverflow;
      if (previouslyFocused?.isConnected) previouslyFocused.focus();
    };
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      handleCancel();
      return;
    }

    // Kunci Tab agar fokus tetap berputar di dalam dialog
    if (e.key === 'Tab') {
      const buttons = panelRef.current?.querySelectorAll('button:not([disabled])');
      if (!buttons?.length) return;
      const first = buttons[0];
      const last = buttons[buttons.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  return createPortal(
    <div
      className={`fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#0d1e35]/50 backdrop-blur-[2px] ${
        isClosing ? 'animate-overlayOut' : 'animate-overlayIn'
      }`}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) handleCancel();
      }}
      onKeyDown={handleKeyDown}
    >
      <div
        ref={panelRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="logout-dialog-title"
        aria-describedby="logout-dialog-desc"
        onAnimationEnd={handleAnimationEnd}
        className={`bg-white rounded-3xl w-full max-w-sm shadow-2xl p-6 sm:p-7 text-center ${
          isClosing ? 'animate-dialogOut' : 'animate-dialogIn'
        }`}
      >
        {/* Ikon dengan cincin berdenyut halus */}
        <div className="relative w-16 h-16 mx-auto mb-5">
          <span
            aria-hidden="true"
            className="absolute inset-0 rounded-full bg-red-200 opacity-0 animate-ringPulse"
          />
          <div className="relative w-16 h-16 rounded-full bg-red-50 ring-8 ring-red-50/60 flex items-center justify-center text-red-500">
            <LogOut size={26} strokeWidth={2} className="animate-iconNudge" />
          </div>
        </div>

        <h2
          id="logout-dialog-title"
          className="text-xl font-bold text-[#12223a] mb-2"
        >
          Yakin ingin Logout?
        </h2>
        <p id="logout-dialog-desc" className="text-sm text-gray-500 leading-relaxed">
          Sesi Anda sebagai{' '}
          <span className="font-semibold text-[#12223a]">{roleLabel}</span>{' '}
          akan diakhiri. Anda perlu login kembali untuk mengakses sistem.
        </p>

        <div className="flex flex-col-reverse sm:flex-row gap-3 mt-7">
          <Button
            variant="secondary"
            onClick={handleCancel}
            disabled={isBusy}
            className="flex-1 py-3 hover:-translate-y-0.5 hover:shadow-md"
          >
            Batal
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirm}
            isLoading={isProcessing}
            disabled={isClosing}
            className="flex-1 py-3 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-500/25 disabled:hover:translate-y-0 disabled:hover:shadow-none"
          >
            {isBusy ? 'Memproses...' : 'Ya, Logout'}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default LogoutConfirmModal;
