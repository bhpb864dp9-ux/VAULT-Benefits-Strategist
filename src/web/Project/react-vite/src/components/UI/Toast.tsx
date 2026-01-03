/**
 * VAULT DEM Engine — Toast Notifications
 */

import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useClaimStore, useToasts } from '../../stores/claimStore';
import type { ToastMessage } from '../../types';

export default function ToastContainer() {
  const toasts = useToasts();
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2" role="region" aria-label="Notifications">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>
  );
}

function Toast({ toast }: { toast: ToastMessage }) {
  const { dismissToast } = useClaimStore();

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info
  } as const;

  // Platform-consistent colors (matches body map, calculator, conditions)
  // Success = Green (Mild), Error = Red (Severe), Warning = Amber (Moderate), Info = Blue
  const colorStyles = {
    success: {
      background: 'rgb(22, 163, 74)',      // green-600
      border: 'rgba(34, 197, 94, 0.8)',    // green-500
    },
    error: {
      background: 'rgb(220, 38, 38)',      // red-600
      border: 'rgba(239, 68, 68, 0.8)',    // red-500
    },
    warning: {
      background: 'rgb(217, 119, 6)',      // amber-600
      border: 'rgba(245, 158, 11, 0.8)',   // amber-500
    },
    info: {
      background: 'rgb(37, 99, 235)',      // blue-600
      border: 'rgba(59, 130, 246, 0.8)',   // blue-500
    }
  } as const;

  const Icon = icons[toast.type];
  const colors = colorStyles[toast.type];

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg animate-slide-in min-w-[280px] max-w-[400px]"
      style={{
        backgroundColor: colors.background,
        border: `1px solid ${colors.border}`,
      }}
      role="alert"
      aria-live="polite"
    >
      <Icon className="w-5 h-5 flex-shrink-0 text-white" />
      <p className="text-sm text-white flex-1 font-medium">{toast.message}</p>
      <button
        onClick={() => dismissToast(toast.id)}
        className="p-1 text-white/70 hover:text-white transition-colors"
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}


