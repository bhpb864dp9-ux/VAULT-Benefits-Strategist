/**
 * VAULT DEM Engine — Header Component
 * Sticky navigation with progress and FREE FOREVER badge
 */

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Shield, Lock } from 'lucide-react';
import { useClaimStore } from '../../stores/claimStore';
import clsx from 'clsx';
import { getHeaderNavRoutes, VAULT_WEB_FEATURE_REGISTRY } from '@mosa/Core/Registry';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { currentPhase, isClaimStarted, data } = useClaimStore();

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
            <div className="hidden sm:block">
              <span className="px-3 py-1 bg-success/20 text-success text-xs font-bold tracking-wider uppercase border border-success/30">
                FREE FOREVER
              </span>
            </div>

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
            </nav>

            <button
              className="md:hidden p-2 text-slate-400 hover:text-slate-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
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
              <div className="pt-4 border-t border-slate-800">
                <Link to={claimCtaHref} className="btn btn-primary w-full">
                  {isClaimStarted() ? 'Continue Claim' : 'Start Free Now'}
                </Link>
              </div>
              <div className="text-center pt-2">
                <span className="px-3 py-1 bg-success/20 text-success text-xs font-bold tracking-wider uppercase">
                  🎖️ FREE FOREVER FOR VETERANS
                </span>
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


