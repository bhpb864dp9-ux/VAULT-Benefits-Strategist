/**
 * VAULT Glass Panel Component — Liquid Glass Edition v2
 * A simpler glass container for larger layout sections
 *
 * Based on Apple WWDC 2025 Liquid Glass specifications
 *
 * VAULT LLC — A Northstar|Insight Inc. Company
 * © 2026 All Rights Reserved
 */

import { ReactNode, forwardRef, CSSProperties, HTMLAttributes } from 'react';
import { useLiquidGlass } from './LiquidGlassProvider';
import { cn } from '@/lib/utils';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface GlassPanelProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;

  /** Glass intensity - how opaque the glass appears */
  intensity?: 'subtle' | 'medium' | 'strong';

  /** Border style */
  border?: 'none' | 'subtle' | 'visible';

  /** Blur amount */
  blur?: 'none' | 'sm' | 'md' | 'lg';

  /** Padding preset */
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';

  /** Border radius */
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

  /** Optional inline styles */
  style?: CSSProperties;
}

// ═══════════════════════════════════════════════════════════════════════════════
// STYLE CONFIGURATIONS
// ═══════════════════════════════════════════════════════════════════════════════

const intensityConfig = {
  subtle: 'bg-white/5',
  medium: 'bg-white/10',
  strong: 'bg-white/15',
};

const borderConfig = {
  none: '',
  subtle: 'border border-white/5',
  visible: 'border border-white/10',
};

const blurConfig = {
  none: '',
  sm: 'backdrop-blur-sm',
  md: 'backdrop-blur-md',
  lg: 'backdrop-blur-lg',
};

const paddingConfig = {
  none: '',
  sm: 'p-2',
  md: 'p-4',
  lg: 'p-6',
  xl: 'p-8',
};

const roundedConfig = {
  none: '',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  full: 'rounded-full',
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

const GlassPanel = forwardRef<HTMLDivElement, GlassPanelProps>(
  (
    {
      children,
      className,
      intensity = 'medium',
      border = 'subtle',
      blur = 'md',
      padding = 'md',
      rounded = 'lg',
      style,
      ...props
    },
    ref
  ) => {
    const { prefersReducedTransparency } = useLiquidGlass();

    // Fallback styles when reduced transparency is preferred
    if (prefersReducedTransparency) {
      return (
        <div
          ref={ref}
          className={cn(
            'bg-slate-800/90 border border-slate-700/50',
            paddingConfig[padding],
            roundedConfig[rounded],
            className
          )}
          style={style}
          {...props}
        >
          {children}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          // Glass material layer
          intensityConfig[intensity],
          blurConfig[blur],
          borderConfig[border],
          paddingConfig[padding],
          roundedConfig[rounded],
          // Transitions
          'transition-all duration-200',
          className
        )}
        style={style}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassPanel.displayName = 'GlassPanel';

export default GlassPanel;
