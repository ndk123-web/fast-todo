import { createContext, useCallback, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import './Toast.css';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  duration: number;
  createdAt: number;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType, durationMs?: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timeouts = useRef<Record<string, number>>({});

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
    if (timeouts.current[id]) {
      clearTimeout(timeouts.current[id]);
      delete timeouts.current[id];
    }
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'info', durationMs: number = 4000) => {
    const id = crypto.randomUUID();
    const toast: ToastItem = { id, type, message, duration: durationMs, createdAt: Date.now() };
    setToasts(prev => [...prev, toast]);
    timeouts.current[id] = window.setTimeout(() => removeToast(id), durationMs);
  }, [removeToast]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      Object.values(timeouts.current).forEach(t => clearTimeout(t));
    };
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-portal" aria-live="polite" aria-atomic="true">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`toast toast-${t.type}`}
            role={t.type === 'error' ? 'alert' : 'status'}
          >
            <div className="toast-message">{t.message}</div>
            <button
              className="toast-close"
              aria-label="Close notification"
              onClick={() => removeToast(t.id)}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};
