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

  // REL-014: Solid backgrounds for better visibility
  const styles = {
    success: 'border-green-600 bg-green-700',
    error: 'border-red-600 bg-red-700',
    warning: 'border-amber-600 bg-amber-700',
    info: 'border-blue-600 bg-blue-700'
  } as const;

  // REL-014: White icons on solid backgrounds
  const iconStyles = {
    success: 'text-white',
    error: 'text-white',
    warning: 'text-white',
    info: 'text-white'
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


