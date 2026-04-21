// ---------------------------------------------------------------------------
// useToast — convenience hook for firing notifications
// ---------------------------------------------------------------------------

import { useToastStore, type ToastType } from '@/stores/toast-store';

export function useToast() {
  const { addToast } = useToastStore();

  function fire(type: ToastType, title: string, message?: string, duration?: number) {
    addToast({ type, title, message, duration: duration ?? 4000 });
  }

  return {
    success: (title: string, message?: string) => fire('success', title, message),
    error: (title: string, message?: string) => fire('error', title, message, 6000),
    info: (title: string, message?: string) => fire('info', title, message),
    warning: (title: string, message?: string) => fire('warning', title, message),
  };
}
