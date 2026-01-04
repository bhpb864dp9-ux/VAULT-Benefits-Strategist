/**
 * VAULT DEM Engine — Header Component
 * Cockpit-style navigation — minimal, focused, mission-critical
 */

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Shield, Lock, User, LogOut, LogIn } from 'lucide-react';
import { useClaimStore } from '../../stores/claimStore';
import { useAuth } from '../../context/AuthContext';
import clsx from 'clsx';
import { getHeaderNavRoutes, VAULT_WEB_FEATURE_REGISTRY } from '@mosa/Core/Registry';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const { currentPhase, isClaimStarted, data } = useClaimStore();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const isWorkflow = location.pathname.startsWith('/claim');
  const phaseCount = VAULT_WEB_FEATURE_REGISTRY.workflowPhases.length;

  // "Continue Claim" should resume to the first blocking phase (or the saved phase if already ahead).
  // This avoids always landing back on `/claim` -> `/claim/mission`.
  const resumePhaseId = (() => {
    // Not started => start at mission.
    if (!isClaimStarted()) return 0;

    // First incomplete required phase wins.
    if (!data.mission) return 0;
    if (!data.identity.name?.trim()) return 1;
    if (!data.selectedConditions.length) return 2;

    // Otherwise resume where they left off, clamped to registry.
    return Math.max(0, Math.min(phaseCount - 1, currentPhase));
  })();
  const resumePhasePath =
    VAULT_WEB_FEATURE_REGISTRY.workflowPhases.find((p) => p.id === resumePhaseId)?.path || 'mission';
  const claimCtaHref = `/claim/${resumePhasePath}`;

  return (
    <header
      className={clsx(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled ? 'bg-slate-950/70 backdrop-blur-2xl border-b border-slate-800/40' : 'bg-transparent'
      )}
    >
      <div className="bg-slate-950/35 backdrop-blur-2xl border-b border-slate-800/40 py-2 px-4">
        <div className="container-wide flex items-center justify-center gap-2 text-xs text-slate-400">
          <Lock className="w-3 h-3 text-success" />
          <span>100% Offline • Zero Data Transmission • Your Privacy Protected</span>
        </div>
      </div>

      <div className="container-wide py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div
              className="w-10 h-10 flex items-center justify-center rounded-xl text-brass transition-colors group-hover:text-brass-light"
              style={{
                background: 'rgba(17, 24, 32, 0.22)',
                border: '1px solid rgba(45, 58, 71, 0.65)',
                backdropFilter: 'blur(18px)',
                WebkitBackdropFilter: 'blur(18px)',
                boxShadow: '0 12px 30px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.06)'
              }}
            >
              <Shield className="w-5 h-5" />
            </div>
            <div className="hidden sm:block">
              <span className="text-sm font-medium tracking-widest text-slate-100 uppercase">VAULT</span>
              <span className="text-xs text-slate-500 ml-2">DEM Engine</span>
            </div>
          </Link>

          {isWorkflow && (
            <nav className="hidden md:flex items-center gap-2" aria-label="Workflow progress">
              {VAULT_WEB_FEATURE_REGISTRY.workflowPhases.map((p) => p.id).map((phase) => (
                <div
                  key={phase}
                  className={clsx(
                    'transition-all duration-300',
                    phase === currentPhase
                      ? 'w-6 h-2 bg-brass rounded'
                      : phase < currentPhase
                      ? 'w-2 h-2 bg-slate-400 rounded-full'
                      : 'w-2 h-2 bg-slate-700 rounded-full'
                  )}
                  aria-current={phase === currentPhase ? 'step' : undefined}
                />
              ))}
            </nav>
          )}

          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-6">
              {getHeaderNavRoutes().map((r) => (
                <NavLink key={r.id} to={r.path}>
                  {r.label}
                </NavLink>
              ))}
              {isClaimStarted() ? (
                <Link to={claimCtaHref} className="btn btn-primary btn-sm">
                  Continue Claim
                </Link>
              ) : (
                <Link to={claimCtaHref} className="btn btn-primary btn-sm">
                  Start Free
                </Link>
              )}

              {/* Auth Button / User Menu */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-brass/30 transition-colors"
                  >
                    {user?.picture ? (
                      <img src={user.picture} alt="" className="w-6 h-6 rounded-full" />
                    ) : (
                      <User className="w-4 h-4 text-slate-400" />
                    )}
                    <span className="text-sm text-slate-300">{user?.givenName || 'Account'}</span>
                    {user?.isVeteranVerified && (
                      <span className="px-1.5 py-0.5 text-xs bg-green-500/20 text-green-400 rounded">Verified</span>
                    )}
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 py-2 bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-lg shadow-xl z-50">
                      <div className="px-4 py-2 border-b border-slate-700/50">
                        <p className="text-sm font-medium text-white">{user?.name}</p>
                        <p className="text-xs text-slate-400">{user?.email}</p>
                      </div>
                      <button
                        onClick={() => { logout(); setUserMenuOpen(false); }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800/50 hover:text-white transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-brass/30 hover:text-brass transition-colors text-sm text-slate-300"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Link>
              )}
            </nav>

            {/* Hide hamburger in claim workflow — lock focus on the mission */}
            {!isWorkflow && (
              <button
                className="md:hidden p-2 text-slate-400 hover:text-slate-100"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            )}
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 py-4 border-t border-slate-800 animate-fade-in">
            <div className="flex flex-col gap-4">
              <MobileNavLink to="/">Home</MobileNavLink>
              {getHeaderNavRoutes().map((r) => (
                <MobileNavLink key={r.id} to={r.path}>
                  {r.label}
                </MobileNavLink>
              ))}
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <Link to={claimCtaHref} className="btn btn-primary w-full">
                  {isClaimStarted() ? 'Continue Claim' : 'Start Free Now'}
                </Link>
                {isAuthenticated ? (
                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      {user?.picture ? (
                        <img src={user.picture} alt="" className="w-8 h-8 rounded-full" />
                      ) : (
                        <User className="w-5 h-5 text-slate-400" />
                      )}
                      <div>
                        <p className="text-sm text-white">{user?.name}</p>
                        {user?.isVeteranVerified && (
                          <span className="text-xs text-green-400">Verified Veteran</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => logout()}
                      className="p-2 text-slate-400 hover:text-white"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:text-white transition-colors"
                  >
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={clsx(
        'text-sm font-medium tracking-wide transition-colors',
        isActive ? 'text-brass' : 'text-slate-400 hover:text-slate-100'
      )}
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ to, children }: { to: string; children: React.ReactNode }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={clsx(
        'block py-2 text-base font-medium transition-colors',
        isActive ? 'text-brass' : 'text-slate-300 hover:text-slate-100'
      )}
    >
      {children}
    </Link>
  );
}


