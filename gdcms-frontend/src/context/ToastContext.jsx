import { createContext, useCallback, useRef, useState } from 'react';

export const ToastContext = createContext(null);

let idCounter = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const show = useCallback(
    (message, { type = 'info', duration = 4000 } = {}) => {
      const id = ++idCounter;
      setToasts((prev) => [...prev, { id, message, type }]);

      if (duration > 0) {
        const timer = setTimeout(() => dismiss(id), duration);
        timers.current.set(id, timer);
      }

      return id;
    },
    [dismiss]
  );

  const value = {
    toasts,
    dismiss,
    show,
    success: (message, opts) => show(message, { ...opts, type: 'success' }),
    error: (message, opts) => show(message, { ...opts, type: 'error' }),
    info: (message, opts) => show(message, { ...opts, type: 'info' }),
  };

  return (
    <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
  );
};
