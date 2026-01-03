/**
 * VAULT — Login Panel with Liquid Glass Styling
 * OAuth 2.0 provider selection with Apple, Google, ID.me, Login.gov
 *
 * VAULT LLC — A Northstar|Insight Inc. Company
 * © 2026 All Rights Reserved
 */

import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Apple, Chrome, ShieldCheck, Landmark, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PROVIDER_DISPLAY, type AuthProvider } from '../../services/auth';
import { GlassCard } from '../LiquidGlass/GlassCard';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface ProviderButtonProps {
  name: string;
  description: string;
  icon: React.ReactNode;
  badge?: string;
  onClick: () => void;
  disabled?: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ANIMATION VARIANTS
// ═══════════════════════════════════════════════════════════════════════════════

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// ICON MAPPING
// ═══════════════════════════════════════════════════════════════════════════════

const PROVIDER_ICONS: Record<AuthProvider, React.ReactNode> = {
  apple: <Apple className="w-6 h-6" />,
  google: <Chrome className="w-6 h-6" />,
  idme: <ShieldCheck className="w-6 h-6" />,
  logingov: <Landmark className="w-6 h-6" />,
};

// ═══════════════════════════════════════════════════════════════════════════════
// PROVIDER BUTTON
// ═══════════════════════════════════════════════════════════════════════════════

function ProviderButton({
  name,
  description,
  icon,
  badge,
  onClick,
  disabled,
}: ProviderButtonProps) {
  return (
    <motion.button
      variants={itemVariants}
      onClick={onClick}
      disabled={disabled}
      className="w-full p-4 rounded-2xl text-left transition-all duration-200
                 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20
                 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed
                 group focus:outline-none focus:ring-2 focus:ring-brass/50"
      style={{ backdropFilter: 'blur(12px)' }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center gap-4">
        <div className="text-slate-300 group-hover:text-white transition-colors">
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-white">{name}</span>
            {badge && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-medium">
                {badge}
              </span>
            )}
          </div>
          <span className="text-sm text-slate-400">{description}</span>
        </div>
        <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
      </div>
    </motion.button>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function LoginPanel() {
  const { login, isLoading, error, clearError, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate('/claim/identity', { replace: true });
    return null;
  }

  const handleLogin = async (provider: AuthProvider) => {
    clearError();
    await login(provider);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <GlassCard variant="regular" size="lg" padding="lg">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-brass/30 to-brass/10
                         flex items-center justify-center border border-brass/20"
            >
              <Lock className="w-8 h-8 text-brass" />
            </motion.div>
            <h2 className="text-2xl font-serif text-white mb-2">
              Welcome to VAULT
            </h2>
            <p className="text-slate-400">
              Choose how you'd like to sign in
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20"
            >
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-300">{error}</p>
              </div>
            </motion.div>
          )}

          {/* Provider Buttons */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            {PROVIDER_DISPLAY.map((provider) => (
              <ProviderButton
                key={provider.id}
                name={provider.name}
                description={provider.description}
                icon={PROVIDER_ICONS[provider.id]}
                badge={provider.badge}
                onClick={() => handleLogin(provider.id)}
                disabled={isLoading || !provider.available}
              />
            ))}
          </motion.div>

          {/* Loading Indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 flex justify-center"
            >
              <div className="animate-spin w-6 h-6 border-2 border-brass border-t-transparent rounded-full" />
            </motion.div>
          )}

          {/* Privacy Notice */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 pt-6 border-t border-slate-800/50 text-center"
          >
            <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
              <Lock className="w-4 h-4" />
              <span>Your data stays on your device</span>
            </div>
            <p className="mt-2 text-xs text-slate-600">
              VAULT uses secure OAuth 2.0 authentication with PKCE.
              <br />
              <a href="/about" className="text-brass hover:underline">
                Learn more about our privacy practices
              </a>
            </p>
          </motion.div>

          {/* Skip Auth (Development) */}
          {import.meta.env.DEV && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-4 text-center"
            >
              <button
                onClick={() => navigate('/claim/mission')}
                className="text-xs text-slate-600 hover:text-slate-400 transition-colors"
              >
                Skip authentication (dev only)
              </button>
            </motion.div>
          )}
        </GlassCard>
      </motion.div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// NAMED EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

export { LoginPanel };
