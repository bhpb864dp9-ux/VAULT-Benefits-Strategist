/**
 * VAULT Header Component — Liquid Glass Edition v2
 * Navigation with proper glass layering and scroll adaptation
 * 
 * Based on Apple WWDC 2025 Liquid Glass specifications:
 * - Glass adapts on scroll
 * - Single glass layer for navigation
 * - Scroll edge effects for separation
 * 
 * ODT-2 Vault-Dev — Tidewater Convergence
 * VAULT LLC — A Northstar|Insight Inc. Company
 * © 2026 All Rights Reserved
 */

import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Shield, 
  Calculator, 
  Wrench, 
  Info, 
  Menu, 
  X,
  Lock,
  Wifi,
  WifiOff,
  ChevronRight
} from 'lucide-react';
import { useLiquidGlass } from './LiquidGlassProvider';
import { cn } from '@/lib/utils';

// ═══════════════════════════════════════════════════════════════════════════════
// NAVIGATION CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const navItems = [
  { path: '/calculator', label: 'Calculator', icon: Calculator },
  { path: '/tools', label: 'Tools', icon: Wrench },
  { path: '/about', label: 'About', icon: Info },
];

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const location = useLocation();
  
  const { 
    prefersReducedMotion, 
    prefersReducedTransparency,
    prefersHighContrast 
  } = useLiquidGlass();

  // ═══════════════════════════════════════════════════════════════════════════
  // SCROLL HANDLING
  // Glass adapts based on scroll position (Apple's adaptive behavior)
  // ═══════════════════════════════════════════════════════════════════════════
  
  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    const threshold = 20;
    const maxScroll = 100;
    
    setIsScrolled(scrollY > threshold);
    setScrollProgress(Math.min(scrollY / maxScroll, 1));
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // ═══════════════════════════════════════════════════════════════════════════
  // ONLINE/OFFLINE STATUS
  // ═══════════════════════════════════════════════════════════════════════════
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // ═══════════════════════════════════════════════════════════════════════════
  // DYNAMIC STYLES
  // Glass gets more opaque as user scrolls (Apple's adaptation)
  // ═══════════════════════════════════════════════════════════════════════════
  
  const glassOpacity = prefersReducedTransparency 
    ? 0.98 
    : 0.6 + (scrollProgress * 0.3);
  
  const blurAmount = prefersReducedTransparency 
    ? 0 
    : 12 + (scrollProgress * 12);
  
  const borderOpacity = 0.04 + (scrollProgress * 0.06);

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════════════
          PRIVACY TRUST BANNER
          Always visible - establishes trust immediately
      ═══════════════════════════════════════════════════════════════════════ */}
      <div className="bg-slate-950 border-b border-white/[0.03]">
        <div className="max-w-7xl mx-auto px-4 py-1.5">
          <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-emerald-500" />
              100% Offline
            </span>
            <span className="text-slate-800">•</span>
            <span>Zero Data Transmission</span>
            <span className="text-slate-800">•</span>
            <span className="hidden sm:inline">Your Privacy Protected</span>
            <span className="hidden sm:inline text-slate-800">•</span>
            <span className="flex items-center gap-1.5">
              {isOnline ? (
                <>
                  <Wifi className="w-3 h-3 text-emerald-500" />
                  <span className="text-emerald-500/80">Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3 text-amber-500" />
                  <span className="text-amber-500/80">Offline Mode</span>
                </>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          MAIN HEADER — LIQUID GLASS NAVIGATION
          Single glass layer that adapts on scroll
      ═══════════════════════════════════════════════════════════════════════ */}
      <header
        className={cn(
          'sticky top-0 z-50',
          !prefersReducedMotion && 'transition-all duration-300 ease-out'
        )}
      >
        {/* Glass Material Layer */}
        <div 
          className={cn(
            'absolute inset-0',
            prefersHighContrast && 'border-b-2 border-white'
          )}
          style={{
            backgroundColor: `rgba(15, 23, 42, ${glassOpacity})`,
            backdropFilter: prefersReducedTransparency 
              ? 'none' 
              : `blur(${blurAmount}px) saturate(180%)`,
            WebkitBackdropFilter: prefersReducedTransparency 
              ? 'none' 
              : `blur(${blurAmount}px) saturate(180%)`,
            borderBottom: `1px solid rgba(255, 255, 255, ${borderOpacity})`,
            boxShadow: isScrolled 
              ? '0 4px 30px rgba(0, 0, 0, 0.15)' 
              : 'none',
          }}
        />
        
        {/* Scroll Edge Effect (Dissolve line) */}
        {isScrolled && !prefersReducedTransparency && (
          <div 
            className="absolute bottom-0 left-0 right-0 h-px"
            style={{
              background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent)',
            }}
          />
        )}

        {/* Header Content */}
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            
            {/* ═══════════════════════════════════════════════════════════════
                LOGO
            ═══════════════════════════════════════════════════════════════ */}
            <Link 
              to="/" 
              className="flex items-center gap-3 group"
            >
              {/* Logo Icon with Glass Effect */}
              <div className={cn(
                'relative w-10 h-10 rounded-xl flex items-center justify-center',
                'bg-gradient-to-br from-amber-500/20 to-amber-600/10',
                'border border-amber-500/20',
                !prefersReducedMotion && [
                  'transition-all duration-300',
                  'group-hover:scale-105',
                  'group-hover:shadow-lg group-hover:shadow-amber-500/20',
                ]
              )}>
                <Shield className="w-5 h-5 text-amber-500" />
                
                {/* Inner highlight */}
                <div 
                  className="absolute inset-0 rounded-xl pointer-events-none"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%)',
                  }}
                />
              </div>
              
              {/* Logo Text */}
              <div>
                <span className="text-lg font-semibold text-slate-100 tracking-tight">
                  VAULT
                </span>
                <span className="hidden sm:inline ml-2 text-xs text-slate-500 font-normal">
                  Benefits Strategist
                </span>
              </div>
            </Link>

            {/* ═══════════════════════════════════════════════════════════════
                DESKTOP NAVIGATION
                Glass-style nav items
            ═══════════════════════════════════════════════════════════════ */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      'relative px-4 py-2 rounded-xl text-sm font-medium',
                      'flex items-center gap-2',
                      !prefersReducedMotion && 'transition-all duration-200',
                      isActive
                        ? 'text-amber-400'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                    
                    {/* Active indicator */}
                    {isActive && (
                      <span 
                        className={cn(
                          'absolute bottom-0 left-1/2 -translate-x-1/2',
                          'w-8 h-0.5 rounded-full',
                          'bg-gradient-to-r from-amber-500 to-amber-400'
                        )}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* ═══════════════════════════════════════════════════════════════
                CTA BUTTON
                Primary tinted glass button
            ═══════════════════════════════════════════════════════════════ */}
            <div className="flex items-center gap-3">
              <Link
                to="/claim/mission"
                className={cn(
                  'hidden sm:flex items-center gap-2 px-5 py-2.5',
                  'bg-gradient-to-br from-amber-500 to-amber-600',
                  'text-slate-950 text-sm font-semibold',
                  'rounded-xl',
                  'shadow-lg shadow-amber-500/25',
                  !prefersReducedMotion && [
                    'transition-all duration-200',
                    'hover:shadow-xl hover:shadow-amber-500/35',
                    'hover:scale-[1.02]',
                    'active:scale-[0.98]',
                  ],
                  prefersHighContrast && 'border-2 border-white'
                )}
              >
                START FREE
                <ChevronRight className="w-4 h-4" />
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={cn(
                  'md:hidden p-2 rounded-xl',
                  'text-slate-400 hover:text-slate-200',
                  'hover:bg-white/[0.05]',
                  !prefersReducedMotion && 'transition-all duration-200'
                )}
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════════
            MOBILE MENU
            Slides down with glass effect
        ═══════════════════════════════════════════════════════════════════════ */}
        <div
          className={cn(
            'md:hidden overflow-hidden',
            !prefersReducedMotion && 'transition-all duration-300 ease-out',
            isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          )}
        >
          <div 
            className="px-4 py-4 space-y-1"
            style={{
              backgroundColor: prefersReducedTransparency 
                ? 'rgba(15, 23, 42, 0.98)' 
                : 'rgba(15, 23, 42, 0.9)',
              backdropFilter: prefersReducedTransparency 
                ? 'none' 
                : 'blur(20px)',
              borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl',
                    !prefersReducedMotion && 'transition-all duration-200',
                    isActive
                      ? 'bg-amber-500/10 text-amber-400'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
            
            {/* Mobile CTA */}
            <Link
              to="/claim/mission"
              className={cn(
                'flex items-center justify-center gap-2 mt-3 px-5 py-3',
                'bg-gradient-to-br from-amber-500 to-amber-600',
                'text-slate-950 font-semibold',
                'rounded-xl',
                'shadow-lg shadow-amber-500/25'
              )}
            >
              START FREE
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
