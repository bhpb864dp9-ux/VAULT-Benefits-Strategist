/**
 * VAULT DEM Engine — Toast Notifications
 */

import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useClaimStore, useToasts } from '../../stores/claimStore';
import clsx from 'clsx';
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

  const styles = {
    success: 'border-success/30 bg-success/10',
    error: 'border-error/30 bg-error/10',
    warning: 'border-warning/30 bg-warning/10',
    info: 'border-slate-600 bg-slate-800'
  } as const;

  const iconStyles = {
    success: 'text-success',
    error: 'text-error',
    warning: 'text-warning',
    info: 'text-slate-400'
  } as const;

  const Icon = icons[toast.type];

  return (
    <div
      className={clsx(
        'flex items-center gap-3 px-4 py-3 border rounded-2xl shadow-lg',
        'animate-slide-in min-w-[280px] max-w-[400px]',
        styles[toast.type]
      )}
      role="alert"
      aria-live="polite"
    >
      <Icon className={clsx('w-5 h-5 flex-shrink-0', iconStyles[toast.type])} />
      <p className="text-sm text-slate-100 flex-1">{toast.message}</p>
      <button
        onClick={() => dismissToast(toast.id)}
        className="p-1 text-slate-500 hover:text-slate-200 transition-colors"
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}


