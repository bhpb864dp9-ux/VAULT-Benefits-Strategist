/**
 * VAULT Glass Card Component — Liquid Glass Edition v2
 * Implements Apple's 3-layer glass architecture
 * 
 * Layers:
 * 1. Distortion Layer — SVG displacement filter (lensing)
 * 2. Material Layer — Semi-transparent background with blur
 * 3. Highlight Layer — Specular light reflections
 * 
 * Based on Apple WWDC 2025 Liquid Glass specifications
 * 
 * ODT-2 Vault-Dev — Tidewater Convergence
 * VAULT LLC — A Northstar|Insight Inc. Company
 * © 2026 All Rights Reserved
 */

import { ReactNode, forwardRef, CSSProperties } from 'react';
import { useLiquidGlass } from './LiquidGlassProvider';
import { cn } from '@/lib/utils';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  
  /** Glass variant - regular adapts to background, clear shows more content through */
  variant?: 'regular' | 'clear';
  
  /** Size affects distortion intensity and border radius */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  
  /** Padding preset */
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  
  /** Enable hover lift effect */
  hover?: boolean;
  
  /** Enable subtle breathing animation (hero elements only) */
  breathe?: boolean;
  
  /** Enable distortion effect (performance: use sparingly) */
  enableDistortion?: boolean;
  
  /** HTML element to render as */
  as?: 'div' | 'article' | 'section' | 'aside' | 'nav';
  
  /** Optional inline styles */
  style?: CSSProperties;
}

// ═══════════════════════════════════════════════════════════════════════════════
// STYLE CONFIGURATIONS
// ═══════════════════════════════════════════════════════════════════════════════

const sizeConfig = {
  sm: {
    radius: 'rounded-xl',       // 12px
    filter: 'vault-lg-distort-sm',
    blur: 'blur(12px)',
  },
  md: {
    radius: 'rounded-2xl',      // 16px
    filter: 'vault-lg-distort',
    blur: 'blur(20px)',
  },
  lg: {
    radius: 'rounded-3xl',      // 24px
    filter: 'vault-lg-distort',
    blur: 'blur(24px)',
  },
  xl: {
    radius: 'rounded-[2rem]',   // 32px
    filter: 'vault-lg-distort-lg',
    blur: 'blur(30px)',
  },
};

const paddingConfig = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-10',
};

const variantConfig = {
  regular: {
    material: 'bg-slate-900/60',
    border: 'border-white/[0.08]',
    shadow: 'shadow-xl shadow-black/20',
  },
  clear: {
    material: 'bg-slate-900/30',
    border: 'border-white/[0.05]',
    shadow: 'shadow-lg shadow-black/15',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      children,
      className,
      variant = 'regular',
      size = 'md',
      padding = 'md',
      hover = false,
      breathe = false,
      enableDistortion = false,
      as: Component = 'div',
      style,
    },
    ref
  ) => {
    const { 
      supportsDistortion, 
      prefersReducedMotion, 
      prefersReducedTransparency,
      prefersHighContrast 
    } = useLiquidGlass();

    const config = sizeConfig[size];
    const variantStyles = variantConfig[variant];
    
    // Determine if we should apply distortion
    const shouldDistort = enableDistortion && supportsDistortion && !prefersReducedTransparency;
    
    // Build backdrop filter value
    const backdropFilterValue = prefersReducedTransparency 
      ? 'none' 
      : `${config.blur} saturate(180%)`;

    return (
      <Component
        ref={ref}
        className={cn(
          // Base structure
          'relative overflow-hidden',
          config.radius,
          
          // Transitions (respects reduced motion)
          !prefersReducedMotion && 'transition-all duration-300 ease-out',
          
          // Hover effects
          hover && !prefersReducedMotion && [
            'hover:scale-[1.01]',
            'hover:shadow-2xl hover:shadow-black/30',
          ],
          
          // Breathing animation (hero elements)
          breathe && !prefersReducedMotion && 'animate-[breathe_6s_ease-in-out_infinite]',
          
          // High contrast mode
          prefersHighContrast && 'border-2 border-white',
          
          className
        )}
        style={style}
      >
        {/* ═══════════════════════════════════════════════════════════════════
            LAYER 1: DISTORTION FILTER (SVG Displacement)
            Creates the "lensing" effect where content bends at edges
            Only applied when explicitly enabled and supported
        ═══════════════════════════════════════════════════════════════════ */}
        {shouldDistort && (
          <div 
            className={cn(
              'absolute inset-0',
              config.radius
            )}
            style={{
              filter: `url(#${config.filter})`,
              backdropFilter: backdropFilterValue,
              WebkitBackdropFilter: backdropFilterValue,
            }}
            aria-hidden="true"
          />
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            LAYER 2: MATERIAL (Background + Blur + Border)
            The semi-transparent tinted surface
        ═══════════════════════════════════════════════════════════════════ */}
        <div 
          className={cn(
            'absolute inset-0',
            config.radius,
            variantStyles.material,
            variantStyles.shadow,
            'border',
            variantStyles.border,
            
            // If no distortion, apply backdrop filter here instead
            !shouldDistort && 'backdrop-blur-xl backdrop-saturate-[180%]',
            
            // Hover border enhancement
            hover && 'transition-[border-color] duration-300',
            hover && 'group-hover:border-white/[0.12]',
          )}
          style={shouldDistort ? undefined : {
            backdropFilter: backdropFilterValue,
            WebkitBackdropFilter: backdropFilterValue,
          }}
          aria-hidden="true"
        />

        {/* ═══════════════════════════════════════════════════════════════════
            LAYER 3: SPECULAR HIGHLIGHT
            Light reflections that make the glass feel physical
            Simulates a light source from top-left
        ═══════════════════════════════════════════════════════════════════ */}
        <div 
          className={cn(
            'absolute inset-0 pointer-events-none',
            config.radius
          )}
          style={{
            // Top highlight line (fresnel effect)
            background: `
              linear-gradient(
                to bottom,
                rgba(255, 255, 255, 0.15) 0%,
                transparent 1px,
                transparent 100%
              )
            `,
            // Inset shadows for depth
            boxShadow: `
              inset 0 1px 0 0 rgba(255, 255, 255, 0.1),
              inset 0 -1px 0 0 rgba(0, 0, 0, 0.1)
            `,
          }}
          aria-hidden="true"
        />

        {/* ═══════════════════════════════════════════════════════════════════
            LAYER 4: CORNER HIGHLIGHTS
            Subtle corner glints that catch light
        ═══════════════════════════════════════════════════════════════════ */}
        <div 
          className={cn(
            'absolute inset-0 pointer-events-none',
            config.radius
          )}
          style={{
            background: `
              radial-gradient(
                ellipse 80% 50% at 10% 10%,
                rgba(255, 255, 255, 0.12) 0%,
                transparent 50%
              ),
              radial-gradient(
                ellipse 60% 40% at 90% 90%,
                rgba(255, 255, 255, 0.05) 0%,
                transparent 50%
              )
            `,
          }}
          aria-hidden="true"
        />

        {/* ═══════════════════════════════════════════════════════════════════
            CONTENT LAYER
            The actual content of the card
        ═══════════════════════════════════════════════════════════════════ */}
        <div 
          className={cn(
            'relative z-10',
            paddingConfig[padding]
          )}
        >
          {children}
        </div>
      </Component>
    );
  }
);

GlassCard.displayName = 'GlassCard';

// ═══════════════════════════════════════════════════════════════════════════════
// SUBCOMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

interface GlassCardHeaderProps {
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}

export function GlassCardHeader({ children, className, action }: GlassCardHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between mb-4', className)}>
      <div>{children}</div>
      {action && <div>{action}</div>}
    </div>
  );
}

interface GlassCardTitleProps {
  children: ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4';
}

export function GlassCardTitle({ 
  children, 
  className, 
  as: Component = 'h3' 
}: GlassCardTitleProps) {
  return (
    <Component 
      className={cn(
        'text-xl font-semibold text-slate-100',
        className
      )}
    >
      {children}
    </Component>
  );
}

interface GlassCardDescriptionProps {
  children: ReactNode;
  className?: string;
}

export function GlassCardDescription({ children, className }: GlassCardDescriptionProps) {
  return (
    <p className={cn('text-sm text-slate-400 mt-1', className)}>
      {children}
    </p>
  );
}

interface GlassCardContentProps {
  children: ReactNode;
  className?: string;
}

export function GlassCardContent({ children, className }: GlassCardContentProps) {
  return (
    <div className={cn('', className)}>
      {children}
    </div>
  );
}

interface GlassCardFooterProps {
  children: ReactNode;
  className?: string;
}

export function GlassCardFooter({ children, className }: GlassCardFooterProps) {
  return (
    <div 
      className={cn(
        'mt-6 pt-4 border-t border-white/[0.06]',
        className
      )}
    >
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default GlassCard;
