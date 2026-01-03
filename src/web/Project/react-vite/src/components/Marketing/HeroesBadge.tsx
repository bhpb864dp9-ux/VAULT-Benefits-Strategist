/**
 * VAULT — Heroes & Hardship Program Badge
 * Displays qualification status for free access
 *
 * VAULT LLC — A Northstar|Insight Inc. Company
 * © 2026 All Rights Reserved
 */

import React from 'react';
import { motion } from 'framer-motion';
import { FreeAccessQualification } from '@/config/featureRegistry';

interface HeroesBadgeProps {
  qualification: FreeAccessQualification;
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
}

export const HeroesBadge: React.FC<HeroesBadgeProps> = ({
  qualification,
  size = 'md',
  animate = true,
}) => {
  const isValor = qualification.category === 'valor';

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs gap-1.5',
    md: 'px-3 py-1.5 text-sm gap-2',
    lg: 'px-4 py-2 text-base gap-2.5',
  };

  const iconSize = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl',
  };

  const BadgeContent = (
    <div
      className={`
        inline-flex items-center rounded-full
        ${sizeClasses[size]}
        ${isValor
          ? 'bg-gradient-to-r from-amber-500/20 to-amber-600/20 border border-amber-400/30'
          : 'bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-400/30'
        }
        backdrop-blur-sm
      `}
    >
      <span className={iconSize[size]}>
        {isValor ? '🎖️' : qualification.id === 'homeless' ? '🏠' : '⭐'}
      </span>
      <div className="flex flex-col">
        <span className={`font-semibold ${isValor ? 'text-amber-400' : 'text-blue-400'}`}>
          {qualification.name}
        </span>
        <span className="text-slate-400 text-xs">
          FREE Veteran Tier Access
        </span>
      </div>
    </div>
  );

  if (!animate) {
    return BadgeContent;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as const }}
      whileHover={{ scale: 1.02 }}
    >
      {BadgeContent}
    </motion.div>
  );
};

/**
 * Compact badge for inline display
 */
export const HeroesBadgeCompact: React.FC<{
  qualification: FreeAccessQualification;
}> = ({ qualification }) => {
  const isValor = qualification.category === 'valor';

  return (
    <span
      className={`
        inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium
        ${isValor
          ? 'bg-amber-500/20 text-amber-400 border border-amber-400/20'
          : 'bg-blue-500/20 text-blue-400 border border-blue-400/20'
        }
      `}
    >
      {isValor ? '🎖️' : '⭐'} {qualification.name}
    </span>
  );
};

export default HeroesBadge;
