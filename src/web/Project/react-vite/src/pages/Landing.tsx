/**
 * VAULT DEM Engine — Landing Page (Primary)
 * Centered, calm hero + symbolic silhouette (flag + veteran)
 */

import { Link } from 'react-router-dom';
import { ArrowRight, Lock, Zap, Shield, GraduationCap } from 'lucide-react';
import { useClaimStore } from '../stores/claimStore';
import { getBiweeklySeasonalHeroCopy } from '../lib/seasonalCopy';

export default function Landing() {
  const { isClaimStarted } = useClaimStore();
  const copy = getBiweeklySeasonalHeroCopy(new Date());

  return (
    <div className="min-h-screen">
      <section className="relative min-h-[92vh] flex items-center overflow-hidden pt-28 pb-16">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute inset-0 bg-gradient-radial from-brass/10 via-transparent to-transparent opacity-70" />
        <div className="absolute inset-0 bg-gradient-radial from-blue-500/10 via-transparent to-transparent opacity-40 [background-position:10%_15%]" />

        {/* Flag + veteran silhouette */}
        <div className="hero-silhouette" aria-hidden="true">
          <svg viewBox="0 0 1200 800" width="100%" height="100%" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id="sil" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0" stopColor="rgba(232,238,244,0.22)" />
                <stop offset="0.55" stopColor="rgba(201,162,39,0.22)" />
                <stop offset="1" stopColor="rgba(43,109,230,0.16)" />
              </linearGradient>
            </defs>
            <path
              d="M0 640 C260 610 420 690 650 650 C860 612 1010 610 1200 640 L1200 800 L0 800 Z"
              fill="rgba(0,0,0,0.45)"
            />
            <g opacity="0.9">
              <path
                d="M560 520 C545 500 540 470 548 440 C560 395 602 370 640 384 C685 401 700 455 685 500
                   C676 526 660 548 640 565 L650 640 L592 640 L600 575 C585 565 572 545 560 520 Z"
                fill="url(#sil)"
              />
              <circle cx="625" cy="365" r="36" fill="rgba(232,238,244,0.18)" />
            </g>
            <rect x="710" y="210" width="14" height="470" rx="6" fill="rgba(232,238,244,0.20)" />
            <g className="hero-flag" transform="translate(724 230)">
              <path
                d="M0 0 C85 10 155 -5 230 10 C310 26 380 10 460 20 L460 170
                   C375 150 310 165 230 150 C150 134 90 158 0 140 Z"
                fill="rgba(201,162,39,0.18)"
              />
              <path d="M0 18 C85 28 155 12 230 28 C310 44 380 28 460 38" stroke="rgba(232,238,244,0.18)" strokeWidth="6" fill="none" />
              <path d="M0 70 C85 80 155 65 230 80 C310 96 380 80 460 90" stroke="rgba(43,109,230,0.14)" strokeWidth="6" fill="none" />
            </g>
          </svg>
        </div>

        <div className="container-wide relative z-10">
          <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
            <div className="animate-fade-up">
              <span className="eyebrow glass-chip">VAULT DEM Engine</span>
            </div>

            <h1 className="liquid-title text-3xl sm:text-4xl lg:text-5xl font-serif text-slate-50 leading-tight mb-5 mt-4 animate-fade-up animate-delay-100 text-balance">
              {copy.headline}
            </h1>

            <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl mb-9 animate-fade-up animate-delay-200 text-balance">
              {copy.subhead}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up animate-delay-300 w-full sm:w-auto">
              <Link to="/claim" className="btn-tactical btn-tactical-advance group">
                <span>{isClaimStarted() ? 'Continue Claim' : 'Start Claim'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link to="/calculator" className="btn-tactical btn-tactical-retreat">
                <span>Try Calculator</span>
              </Link>
            </div>

            <div className="mt-6 animate-fade-up animate-delay-400">
              <Link to="/vbio" className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-brass transition-colors">
                <GraduationCap className="w-4 h-4" />
                VBIO lane (power users)
              </Link>
            </div>

            <div className="mt-10 animate-fade-up animate-delay-500">
              <div className="card px-6 py-4 inline-flex flex-wrap justify-center gap-6 text-sm text-slate-300">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-success" />
                  <span>Zero data transmission</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-brass" />
                  <span>Instant calculations</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-intent-mild" />
                  <span>Privacy first</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}