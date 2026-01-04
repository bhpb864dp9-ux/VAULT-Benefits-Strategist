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
import { ArrowRight, Lock, Zap, Shield, GraduationCap, Calculator, Map, FileText, Users, MessageSquare, Star } from 'lucide-react';
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
            3D WAVING FLAG — CENTERED MONOCHROME
            WebGL rendered American flag with cloth physics
        ═══════════════════════════════════════════════════════════════════ */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 0.25, scale: 1 }}
          transition={{ duration: 2, delay: 0.3, ease: [0.16, 1, 0.3, 1] as const }}
          aria-hidden="true"
        >
          <div className="w-[80%] h-[70%] max-w-[900px] max-h-[600px]">
            <WavingFlag
              width={4}
              height={2.4}
              windSpeed={0.3}
              waveIntensity={0.6}
              color="#f8fafc"
              secondaryColor="#94a3b8"
              showPole={false}
              enableControls={false}
            />
          </div>
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
            {/* Veteran Recognition Pre-headline */}
            <motion.p
              className="text-sm sm:text-base uppercase tracking-[0.25em] text-brass/80 font-medium mb-4"
              variants={fadeUpVariant}
              custom={0}
            >
              Thank You for Your Service
            </motion.p>

            {/* Headline */}
            <motion.h1
              className="liquid-title text-3xl sm:text-4xl lg:text-5xl font-serif text-slate-50 leading-tight mb-5 text-balance"
              variants={fadeUpVariant}
              custom={0.05}
            >
              {copy.headline}
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl mb-9 text-balance"
              variants={fadeUpVariant}
              custom={0.1}
            >
              {copy.subhead}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto"
              variants={fadeUpVariant}
              custom={0.2}
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
              custom={0.3}
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
              custom={0.4}
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

      {/* ═══════════════════════════════════════════════════════════════════
          FEATURES SECTION
          Why Veterans Choose VAULT
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-20 relative">
        <div className="container-wide">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl font-serif text-slate-100 mb-4">
              Why Veterans Choose VAULT
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Built for privacy-conscious veterans who want control over their claim preparation.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Feature 1: Privacy First */}
            <motion.div variants={fadeUpVariant} custom={0}>
              <GlassCard variant="regular" padding="lg" className="h-full text-center">
                <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                  <Lock className="w-7 h-7 text-emerald-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-100 mb-3">
                  Privacy-First Architecture
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Zero data transmission. Everything stays on your device.
                  No servers, no tracking, no compromises.
                </p>
              </GlassCard>
            </motion.div>

            {/* Feature 2: Instant Calculations */}
            <motion.div variants={fadeUpVariant} custom={0.1}>
              <GlassCard variant="regular" padding="lg" className="h-full text-center">
                <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                  <Calculator className="w-7 h-7 text-amber-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-100 mb-3">
                  Instant VASRD Calculations
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Combined rating, bilateral factor, TDIU, SMC — all calculated
                  in seconds, 100% offline.
                </p>
              </GlassCard>
            </motion.div>

            {/* Feature 3: Interactive Body Map */}
            <motion.div variants={fadeUpVariant} custom={0.2}>
              <GlassCard variant="regular" padding="lg" className="h-full text-center">
                <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                  <Map className="w-7 h-7 text-blue-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-100 mb-3">
                  Interactive Body Map
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Click body parts to select conditions. Intuitive, not bureaucratic.
                  15 body systems, 300+ conditions.
                </p>
              </GlassCard>
            </motion.div>

            {/* Feature 4: Evidence Intelligence */}
            <motion.div variants={fadeUpVariant} custom={0.3}>
              <GlassCard variant="regular" padding="lg" className="h-full text-center">
                <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                  <FileText className="w-7 h-7 text-purple-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-100 mb-3">
                  Evidence Intelligence
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  OCR document scanning, gap analysis, and nexus statement generation.
                  Build an airtight case.
                </p>
              </GlassCard>
            </motion.div>

            {/* Feature 5: Expert Forms */}
            <motion.div variants={fadeUpVariant} custom={0.4}>
              <GlassCard variant="regular" padding="lg" className="h-full text-center">
                <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-red-500/10 flex items-center justify-center">
                  <Star className="w-7 h-7 text-red-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-100 mb-3">
                  1776 Heritage Pricing
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Free for veterans with valor awards, 100% P&T, TDIU, or Gold Star families.
                  Heroes deserve access.
                </p>
              </GlassCard>
            </motion.div>

            {/* Feature 6: Offline Ready */}
            <motion.div variants={fadeUpVariant} custom={0.5}>
              <GlassCard variant="regular" padding="lg" className="h-full text-center">
                <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-teal-500/10 flex items-center justify-center">
                  <Zap className="w-7 h-7 text-teal-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-100 mb-3">
                  Works Offline
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Install as a PWA and use anywhere — no internet required.
                  Your data never leaves your device.
                </p>
              </GlassCard>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          BETA CTA SECTION
          Join the VAULT Community
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-16 relative">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <GlassCard variant="regular" padding="xl">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center gap-3 justify-center md:justify-start mb-4">
                    <Users className="w-6 h-6 text-brass" />
                    <h3 className="text-xl font-serif text-slate-100">
                      Join the VAULT Community
                    </h3>
                  </div>
                  <p className="text-slate-400 mb-2">
                    Help shape the future of veteran benefits tools.
                    Get early access to new features and make your voice heard.
                  </p>
                  <p className="text-sm text-slate-500">
                    Open to all veterans, VSO professionals, and advocates.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link to="/about">
                    <GlassButton variant="secondary" size="lg">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Share Feedback
                    </GlassButton>
                  </Link>
                  <Link to="/tools">
                    <GlassButton variant="primary" size="lg" glow>
                      Explore Tools
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </GlassButton>
                  </Link>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
