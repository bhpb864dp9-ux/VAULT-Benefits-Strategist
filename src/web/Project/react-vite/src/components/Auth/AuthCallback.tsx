/**
 * VAULT — OAuth Callback Handler
 * Processes authorization codes and completes authentication
 *
 * VAULT LLC — A Northstar|Insight Inc. Company
 * © 2026 All Rights Reserved
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader2, ShieldCheck, ArrowRight } from 'lucide-react';
import { authService, type AuthProvider, type AuthUser } from '../../services/auth';
import { GlassCard } from '../LiquidGlass/GlassCard';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

type CallbackStatus = 'processing' | 'success' | 'error';

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function AuthCallback() {
  const { provider } = useParams<{ provider: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<CallbackStatus>('processing');
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Validate provider
        if (!provider || !['apple', 'google', 'idme', 'logingov'].includes(provider)) {
          throw new Error('Invalid authentication provider');
        }

        // Process callback
        const authenticatedUser = await authService.handleCallback(provider as AuthProvider);
        setUser(authenticatedUser);
        setStatus('success');

        // Redirect after short delay
        setTimeout(() => {
          if (authenticatedUser.isVeteranVerified) {
            navigate('/claim/identity', { replace: true });
          } else {
            navigate('/claim/mission', { replace: true });
          }
        }, 2000);
      } catch (err) {
        console.error('Auth callback error:', err);
        setError(err instanceof Error ? err.message : 'Authentication failed');
        setStatus('error');
      }
    };

    handleCallback();
  }, [provider, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-32">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <GlassCard variant="regular" size="lg" padding="lg">
          <div className="text-center">
            {/* Processing State */}
            {status === 'processing' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-brass/10 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-brass animate-spin" />
                </div>
                <h2 className="text-xl font-serif text-white mb-2">
                  Completing Sign In...
                </h2>
                <p className="text-slate-400">
                  Please wait while we verify your identity
                </p>

                {/* Progress bar */}
                <div className="mt-6 w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-brass/50 to-brass"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 2, ease: 'easeInOut' }}
                  />
                </div>
              </motion.div>
            )}

            {/* Success State */}
            {status === 'success' && user && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-emerald-400" />
                </div>
                <h2 className="text-xl font-serif text-white mb-2">
                  Welcome{user.givenName ? `, ${user.givenName}` : ''}!
                </h2>

                {/* Veteran verification badge */}
                {user.isVeteranVerified && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="inline-flex items-center gap-2 px-4 py-2 mt-4 rounded-full
                               bg-amber-500/20 border border-amber-500/30"
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span className="text-sm font-medium text-amber-300">
                      Veteran Status Verified
                    </span>
                  </motion.div>
                )}

                <p className="text-slate-400 mt-4">
                  Redirecting to your dashboard...
                </p>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-6"
                >
                  <button
                    onClick={() => navigate('/claim/mission')}
                    className="inline-flex items-center gap-2 text-brass hover:text-brass/80 transition-colors"
                  >
                    <span>Continue now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              </motion.div>
            )}

            {/* Error State */}
            {status === 'error' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
                  <XCircle className="w-8 h-8 text-red-400" />
                </div>
                <h2 className="text-xl font-serif text-white mb-2">
                  Authentication Failed
                </h2>
                <p className="text-red-400 mb-6">{error}</p>

                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/login')}
                    className="w-full px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg
                               text-white font-medium transition-colors"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={() => navigate('/')}
                    className="w-full px-6 py-3 text-slate-400 hover:text-white transition-colors"
                  >
                    Return Home
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// NAMED EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

export { AuthCallback };
