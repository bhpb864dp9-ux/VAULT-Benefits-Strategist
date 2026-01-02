/**
 * VAULT DEM Engine — Loading Screen
 */

import { Shield } from 'lucide-react';

export default function LoadingScreen({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-6">
        <div className="relative">
          <div className="w-16 h-16 flex items-center justify-center border border-brass/30 text-brass animate-pulse rounded-2xl">
            <Shield className="w-8 h-8" />
          </div>
          <div className="absolute inset-0 border-2 border-transparent border-t-brass rounded-full animate-spin" />
        </div>
        <div className="text-center">
          <p className="text-sm text-slate-400">{message}</p>
          <p className="text-xs text-slate-600 mt-2">Processing locally — your data stays private</p>
        </div>
      </div>
    </div>
  );
}


