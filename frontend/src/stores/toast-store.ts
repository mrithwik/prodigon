// ---------------------------------------------------------------------------
// Toast Store — lightweight notification queue (max 3 visible at once)
// ---------------------------------------------------------------------------

import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration: number;
}

type ToastInput = Omit<Toast, 'id' | 'duration'> & { duration?: number };

interface ToastState {
  toasts: Toast[];
  addToast: (toast: ToastInput) => void;
  removeToast: (id: string) => void;
}

function generateId(): string {
  return `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

const MAX_TOASTS = 3;

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],

  addToast: (toast) =>
    set((s) => {
      const newToast: Toast = { duration: 4000, ...toast, id: generateId() };
      // Drop oldest if already at max
      const toasts =
        s.toasts.length >= MAX_TOASTS ? s.toasts.slice(1) : s.toasts;
      return { toasts: [...toasts, newToast] };
    }),

  removeToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
