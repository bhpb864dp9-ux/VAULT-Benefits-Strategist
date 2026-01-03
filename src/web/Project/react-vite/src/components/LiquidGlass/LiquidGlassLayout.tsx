/**
 * VAULT Liquid Glass Layout — Global Page Wrapper
 * Apple Liquid Glass design system implementation
 *
 * Provides:
 * - Dynamic gradient background with glass depth
 * - Subtle noise texture overlay
 * - Consistent content containment
 *
 * VAULT LLC — A Northstar|Insight Inc. Company
 * © 2026 All Rights Reserved
 */

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface LiquidGlassLayoutProps {
  children: ReactNode;
  /** Optional className for the content area */
  className?: string;
  /** Enable ambient glow effects */
  ambientGlow?: boolean;
  /** Background variant */
  variant?: 'default' | 'dark' | 'hero';
}

export function LiquidGlassLayout({
  children,
  className = '',
  ambientGlow = true,
  variant = 'default',
}: LiquidGlassLayoutProps) {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* ═══════════════════════════════════════════════════════════════════
          BASE GRADIENT LAYER
          Multi-stop gradient for depth and dimension
      ═══════════════════════════════════════════════════════════════════ */}
      <div
        className="fixed inset-0 -z-20"
        style={{
          background: variant === 'hero'
            ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #0f172a 50%, #1e293b 75%, #0f172a 100%)'
            : variant === 'dark'
            ? 'linear-gradient(180deg, #020617 0%, #0f172a 50%, #020617 100%)'
            : 'linear-gradient(180deg, #0f172a 0%, #1e293b 30%, #0f172a 70%, #020617 100%)',
        }}
      />

      {/* ═══════════════════════════════════════════════════════════════════
          AMBIENT GLOW ORBS
          Subtle color accents for depth
      ═══════════════════════════════════════════════════════════════════ */}
      {ambientGlow && (
        <>
          {/* Primary brass glow - top center */}
          <motion.div
            className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] -z-10 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            transition={{ duration: 2, ease: 'easeOut' }}
            style={{
              background: 'radial-gradient(ellipse at center, rgba(201, 162, 39, 0.3) 0%, transparent 70%)',
              filter: 'blur(60px)',
            }}
          />

          {/* Secondary blue glow - left side */}
          <motion.div
            className="fixed top-1/4 left-0 w-[600px] h-[600px] -z-10 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            transition={{ duration: 2.5, delay: 0.5, ease: 'easeOut' }}
            style={{
              background: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.25) 0%, transparent 60%)',
              filter: 'blur(80px)',
            }}
          />

          {/* Tertiary purple glow - right side */}
          <motion.div
            className="fixed bottom-1/4 right-0 w-[500px] h-[500px] -z-10 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.08 }}
            transition={{ duration: 3, delay: 1, ease: 'easeOut' }}
            style={{
              background: 'radial-gradient(circle at center, rgba(139, 92, 246, 0.2) 0%, transparent 60%)',
              filter: 'blur(70px)',
            }}
          />
        </>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          NOISE TEXTURE OVERLAY
          Subtle grain for organic feel
      ═══════════════════════════════════════════════════════════════════ */}
      <div
        className="fixed inset-0 -z-10 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />

      {/* ═══════════════════════════════════════════════════════════════════
          CONTENT LAYER
      ═══════════════════════════════════════════════════════════════════ */}
      <div className={`relative z-0 ${className}`}>
        {children}
      </div>
    </div>
  );
}

export default LiquidGlassLayout;
