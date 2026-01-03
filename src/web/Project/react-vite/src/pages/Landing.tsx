/**
 * VAULT DEM Engine — Landing Page (Primary)
 * Liquid Glass Edition with 3D Waving Flag
 *
 * Features:
 * - 3D Waving American Flag with cloth physics
 * - Apple Liquid Glass design system
 * - Scroll-triggered framer-motion animations
 *
 * VAULT LLC — A Northstar|Insight Inc. Company
 * © 2026 All Rights Reserved
 */

import { Link } from 'react-router-dom';
import { ArrowRight, Lock, Zap, Shield, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useClaimStore } from '../stores/claimStore';
import { getBiweeklySeasonalHeroCopy } from '../lib/seasonalCopy';
import WavingFlag from '../components/3D/WavingFlag';
import { GlassCard } from '../components/LiquidGlass/GlassCard';
import { GlassButton } from '../components/LiquidGlass/GlassButton';

// ═══════════════════════════════════════════════════════════════════════════════
// ANIMATION VARIANTS
// ═══════════════════════════════════════════════════════════════════════════════

const fadeUpVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay,
      ease: [0.16, 1, 0.3, 1] as const, // Apple ease
    },
  }),
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const trustPillVariant = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function Landing() {
  const { isClaimStarted } = useClaimStore();
  const copy = getBiweeklySeasonalHeroCopy(new Date());

  return (
    <div className="min-h-screen">
      <section className="relative min-h-[92vh] flex items-center overflow-hidden pt-28 pb-16">
        {/* ═══════════════════════════════════════════════════════════════════
            BACKGROUND LAYERS
            Gradient base + radial accents for depth
        ═══════════════════════════════════════════════════════════════════ */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute inset-0 bg-gradient-radial from-brass/10 via-transparent to-transparent opacity-70" />
        <div className="absolute inset-0 bg-gradient-radial from-blue-500/10 via-transparent to-transparent opacity-40 [background-position:10%_15%]" />

        {/* ═══════════════════════════════════════════════════════════════════
            3D WAVING FLAG
            WebGL rendered American flag with cloth physics
        ═══════════════════════════════════════════════════════════════════ */}
        <motion.div
          className="absolute right-0 top-1/2 -translate-y-1/2 w-[45%] h-[60%] opacity-60 pointer-events-none"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 0.6, x: 0 }}
          transition={{ duration: 1.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
          aria-hidden="true"
        >
          <WavingFlag
            width={3}
            height={1.8}
            windSpeed={0.4}
            waveIntensity={0.7}
            color="#1a202c"
            secondaryColor="#c9a227"
            showPole={true}
            enableControls={false}
          />
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════════════
            HERO CONTENT
            Centered with staggered animations
        ═══════════════════════════════════════════════════════════════════ */}
        <div className="container-wide relative z-10">
          <motion.div
            className="max-w-3xl mx-auto text-center flex flex-col items-center"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {/* Eyebrow Badge */}
            <motion.div variants={fadeUpVariant} custom={0}>
              <span className="inline-block px-4 py-2 rounded-full text-xs font-medium uppercase tracking-wider bg-brass/10 text-brass border border-brass/20 backdrop-blur-sm">
                VAULT DEM Engine
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              className="liquid-title text-3xl sm:text-4xl lg:text-5xl font-serif text-slate-50 leading-tight mb-5 mt-4 text-balance"
              variants={fadeUpVariant}
              custom={0.1}
            >
              {copy.headline}
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl mb-9 text-balance"
              variants={fadeUpVariant}
              custom={0.2}
            >
              {copy.subhead}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto"
              variants={fadeUpVariant}
              custom={0.3}
            >
              <Link to="/claim">
                <GlassButton
                  variant="primary"
                  size="lg"
                  glow
                  icon={<ArrowRight className="w-4 h-4" />}
                  iconPosition="right"
                  className="group"
                >
                  {isClaimStarted() ? 'Continue Claim' : 'Start Claim'}
                </GlassButton>
              </Link>
              <Link to="/calculator">
                <GlassButton variant="secondary" size="lg">
                  Try Calculator
                </GlassButton>
              </Link>
            </motion.div>

            {/* VBIO Link */}
            <motion.div
              className="mt-6"
              variants={fadeUpVariant}
              custom={0.4}
            >
              <Link
                to="/vbio"
                className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-brass transition-colors group"
              >
                <GraduationCap className="w-4 h-4 group-hover:scale-110 transition-transform" />
                VBIO lane (power users)
              </Link>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              className="mt-10"
              variants={fadeUpVariant}
              custom={0.5}
            >
              <GlassCard
                variant="clear"
                size="sm"
                padding="sm"
                className="inline-flex"
              >
                <motion.div
                  className="flex flex-wrap justify-center gap-6 text-sm text-slate-300 px-2"
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <motion.div
                    className="flex items-center gap-2"
                    variants={trustPillVariant}
                  >
                    <Lock className="w-4 h-4 text-emerald-400" />
                    <span>Zero data transmission</span>
                  </motion.div>
                  <motion.div
                    className="flex items-center gap-2"
                    variants={trustPillVariant}
                  >
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>Instant calculations</span>
                  </motion.div>
                  <motion.div
                    className="flex items-center gap-2"
                    variants={trustPillVariant}
                  >
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <span>Privacy first</span>
                  </motion.div>
                </motion.div>
              </GlassCard>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
