/**
 * VAULT — Protected Route Component
 * Requires authentication to access wrapped routes
 *
 * VAULT LLC — A Northstar|Insight Inc. Company
 * © 2026 All Rights Reserved
 */

import { type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { GlassCard } from '../LiquidGlass/GlassCard';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface ProtectedRouteProps {
  children: ReactNode;
  requireVeteranVerification?: boolean;
  fallbackPath?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// LOADING COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

function AuthLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <Loader2 className="w-8 h-8 text-brass animate-spin mx-auto mb-4" />
        <p className="text-slate-400">Verifying authentication...</p>
      </motion.div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// VETERAN VERIFICATION REQUIRED COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

function VeteranVerificationRequired() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <GlassCard variant="regular" size="lg" padding="lg">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-amber-500/20 flex items-center justify-center">
              <ShieldAlert className="w-8 h-8 text-amber-400" />
            </div>
            <h2 className="text-xl font-serif text-white mb-2">
              Veteran Verification Required
            </h2>
            <p className="text-slate-400 mb-6">
              This feature requires verified veteran status. Please sign in with ID.me or Login.gov to verify your veteran status.
            </p>

            <div className="space-y-3">
              <a
                href="/login"
                className="block w-full px-6 py-3 bg-amber-500/20 hover:bg-amber-500/30
                           border border-amber-500/30 rounded-lg text-amber-300 font-medium
                           transition-colors text-center"
              >
                Verify with ID.me
              </a>
              <a
                href="/claim/mission"
                className="block w-full px-6 py-3 text-slate-400 hover:text-white transition-colors text-center"
              >
                Continue without verification
              </a>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function ProtectedRoute({
  children,
  requireVeteranVerification = false,
  fallbackPath = '/login',
}: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  // Show loading while checking auth state
  if (isLoading) {
    return <AuthLoading />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Check veteran verification if required
  if (requireVeteranVerification && !user?.isVeteranVerified) {
    return <VeteranVerificationRequired />;
  }

  // Render protected content
  return <>{children}</>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// NAMED EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

export { ProtectedRoute };
