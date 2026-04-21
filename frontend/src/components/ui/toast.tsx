// ---------------------------------------------------------------------------
// ToastContainer + Toast — stacked notification toasts (bottom-right)
// ---------------------------------------------------------------------------

import { useEffect } from 'react';
import { X, CheckCircle2, XCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToastStore, type Toast } from '@/stores/toast-store';

// ---- Per-toast item -------------------------------------------------------

const TOAST_STYLES = {
  success: {
    border: 'border-l-green-500',
    icon: CheckCircle2,
    iconClass: 'text-green-500',
  },
  error: {
    border: 'border-l-red-500',
    icon: XCircle,
    iconClass: 'text-red-500',
  },
  info: {
    border: 'border-l-blue-500',
    icon: Info,
    iconClass: 'text-blue-500',
  },
  warning: {
    border: 'border-l-amber-500',
    icon: AlertTriangle,
    iconClass: 'text-amber-500',
  },
};

function ToastItem({ toast }: { toast: Toast }) {
  const removeToast = useToastStore((s) => s.removeToast);
  const style = TOAST_STYLES[toast.type];
  const Icon = style.icon;

  useEffect(() => {
    const timer = setTimeout(() => removeToast(toast.id), toast.duration);
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, removeToast]);

  return (
    <div
      role="alert"
      aria-live="polite"
      className={cn(
        'flex items-start gap-3 w-80 max-w-[calc(100vw-2rem)] px-4 py-3',
        'bg-card border border-border border-l-4 rounded-lg shadow-lg',
        'animate-slide-up',
        style.border,
      )}
    >
      <Icon className={cn('h-4 w-4 mt-0.5 shrink-0', style.iconClass)} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium leading-snug">{toast.title}</p>
        {toast.message && (
          <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{toast.message}</p>
        )}
      </div>
      <button
        onClick={() => removeToast(toast.id)}
        className="p-0.5 rounded hover:bg-accent transition-colors shrink-0"
        aria-label="Dismiss notification"
      >
        <X className="h-3.5 w-3.5 text-muted-foreground" />
      </button>
    </div>
  );
}

// ---- Container ------------------------------------------------------------

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-[200] flex flex-col gap-2 items-end"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}
