/**
 * VAULT — 1776 Heritage Pricing Table
 * Displays tier pricing with Heroes & Hardship Program
 *
 * "Every percent is earned. Some have already paid the full price."
 *
 * VAULT LLC — A Northstar|Insight Inc. Company
 * © 2026 All Rights Reserved
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/LiquidGlass';
import {
  TIER_DEFINITIONS,
  FREE_ACCESS_QUALIFICATIONS,
  VaultTier,
  getAnnualSavings,
} from '@/config/featureRegistry';

interface PricingTableProps {
  currentTier?: VaultTier;
  onSelectTier?: (tier: VaultTier) => void;
  showHeroesProgram?: boolean;
}

export const PricingTable: React.FC<PricingTableProps> = ({
  currentTier = VaultTier.AUTHENTICATED,
  onSelectTier,
  showHeroesProgram = true,
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const annualSavings = getAnnualSavings();

  const valorAwards = FREE_ACCESS_QUALIFICATIONS.filter(q => q.category === 'valor');
  const hardshipCategories = FREE_ACCESS_QUALIFICATIONS.filter(q => q.category === 'hardship');

  return (
    <div className="space-y-8">
      {/* Billing Toggle */}
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-2 p-1 rounded-full bg-slate-800/50 border border-slate-700/50">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              billingCycle === 'monthly'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-400/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('annual')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              billingCycle === 'annual'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-400/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Annual
            <span className="ml-1.5 text-xs text-green-400">Save {annualSavings}%</span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <AnimatePresence mode="wait">
          {TIER_DEFINITIONS.map((tier, index) => (
            <motion.div
              key={tier.tier}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, ease: [0.16, 1, 0.3, 1] as const }}
            >
              <GlassCard
                className={`p-6 h-full flex flex-col ${
                  tier.tier === VaultTier.VETERAN
                    ? 'ring-2 ring-amber-400/50'
                    : ''
                } ${currentTier === tier.tier ? 'ring-2 ring-green-400/50' : ''}`}
              >
                {/* Header */}
                <div className="text-center mb-4">
                  {tier.tier === VaultTier.VETERAN && (
                    <span className="inline-block px-2 py-0.5 text-xs font-medium bg-amber-500/20 text-amber-400 rounded-full mb-2">
                      Most Popular
                    </span>
                  )}
                  <h3 className="text-xl font-bold text-white">{tier.name}</h3>
                  <p className="text-sm text-slate-400 mt-1">{tier.target}</p>
                </div>

                {/* Price */}
                <div className="text-center mb-6">
                  {tier.billing === 'free' ? (
                    <div className="text-3xl font-bold text-white">Free</div>
                  ) : tier.billing === 'contract' ? (
                    <div>
                      <div className="text-3xl font-bold text-white">{tier.priceDisplay}</div>
                      <div className="text-sm text-slate-400">/month or contract</div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-3xl font-bold text-white">
                        {billingCycle === 'monthly'
                          ? tier.priceDisplay
                          : tier.annualDisplay.replace('/yr', '')}
                      </div>
                      <div className="text-sm text-slate-400">
                        {billingCycle === 'monthly' ? '/month' : '/year'}
                      </div>
                    </div>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-2 flex-grow mb-6">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                      <span className="text-green-400 mt-0.5">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={() => onSelectTier?.(tier.tier)}
                  disabled={currentTier === tier.tier}
                  className={`w-full py-2.5 rounded-lg font-medium transition-all ${
                    currentTier === tier.tier
                      ? 'bg-green-500/20 text-green-400 border border-green-400/30 cursor-default'
                      : tier.tier === VaultTier.VETERAN
                      ? 'bg-amber-500 text-slate-900 hover:bg-amber-400'
                      : 'bg-slate-700/50 text-white hover:bg-slate-600/50 border border-slate-600/50'
                  }`}
                >
                  {currentTier === tier.tier
                    ? 'Current Plan'
                    : currentTier > tier.tier
                    ? 'Downgrade'
                    : tier.billing === 'free'
                    ? 'Sign Up Free'
                    : 'Upgrade'}
                </button>
              </GlassCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Heroes & Hardship Program */}
      {showHeroesProgram && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
        >
          <GlassCard className="p-8 bg-gradient-to-r from-amber-900/20 to-blue-900/20 border-amber-400/20">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">
                🎖️ Heroes & Hardship Program
              </h3>
              <p className="text-slate-300">
                FREE Veteran tier access for those who've given the most
              </p>
              <p className="text-slate-500 text-sm mt-1 italic">
                "Some have already paid the full price."
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Valor Awards */}
              <div>
                <h4 className="text-lg font-semibold text-amber-400 mb-4 flex items-center gap-2">
                  <span>🎖️</span> Valor Award Recipients
                </h4>
                <ul className="space-y-2">
                  {valorAwards.map(q => (
                    <li key={q.id} className="flex items-center gap-2 text-slate-300">
                      <span className="text-amber-400">★</span>
                      <span>{q.name}</span>
                      <span className="text-slate-500 text-xs">— {q.description}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Hardship Categories */}
              <div>
                <h4 className="text-lg font-semibold text-blue-400 mb-4 flex items-center gap-2">
                  <span>⭐</span> Hardship Categories
                </h4>
                <ul className="space-y-2">
                  {hardshipCategories.map(q => (
                    <li key={q.id} className="flex items-center gap-2 text-slate-300">
                      <span className="text-blue-400">✓</span>
                      <span>{q.name}</span>
                      <span className="text-slate-500 text-xs">— {q.description}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="text-center text-slate-400 text-sm mt-6">
              Verified via ID.me, DD-214, or VA documentation
            </p>
          </GlassCard>
        </motion.div>
      )}

      {/* 1776 Theme Footer */}
      <div className="text-center text-slate-500 text-sm">
        <p>🇺🇸 1776 Heritage Pricing — Honoring America's founding year</p>
        <p className="mt-1">Annual savings: {annualSavings}% on all paid tiers</p>
      </div>
    </div>
  );
};

export default PricingTable;
