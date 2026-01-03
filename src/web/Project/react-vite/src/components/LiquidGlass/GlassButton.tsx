/**
 * VAULT Glass Button Component — Liquid Glass Edition v2
 * Implements Apple's tinting system and touch illumination
 * 
 * Based on Apple WWDC 2025 Liquid Glass specifications:
 * - Tinting generates color range based on background
 * - Illumination spreads from touch point
 * - Never tint all buttons - only primary actions
 * 
 * ODT-2 Vault-Dev — Tidewater Convergence
 * VAULT LLC — A Northstar|Insight Inc. Company
 * © 2026 All Rights Reserved
 */

import { 
  ButtonHTMLAttributes, 
  forwardRef, 
  ReactNode, 
  useState,
  useRef,
  MouseEvent
} from 'react';
import { useLiquidGlass } from './LiquidGlassProvider';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  
  /** Button variant - primary gets tint, others are neutral */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  
  /** Button size */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  
  /** Show loading spinner */
  loading?: boolean;
  
  /** Icon to display */
  icon?: ReactNode;
  
  /** Icon position */
  iconPosition?: 'left' | 'right';
  
  /** Full width button */
  fullWidth?: boolean;
  
  /** Enable glow effect on hover (primary only) */
  glow?: boolean;
  
  /** Enable illumination effect on press */
  illumination?: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SIZE CONFIGURATIONS
// ═══════════════════════════════════════════════════════════════════════════════

const sizeConfig = {
  sm: {
    padding: 'px-3 py-1.5',
    text: 'text-sm',
    radius: 'rounded-lg',
    iconSize: 'w-4 h-4',
  },
  md: {
    padding: 'px-4 py-2.5',
    text: 'text-sm',
    radius: 'rounded-xl',
    iconSize: 'w-4 h-4',
  },
  lg: {
    padding: 'px-6 py-3',
    text: 'text-base',
    radius: 'rounded-xl',
    iconSize: 'w-5 h-5',
  },
  xl: {
    padding: 'px-8 py-4',
    text: 'text-lg',
    radius: 'rounded-2xl',
    iconSize: 'w-5 h-5',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// VARIANT CONFIGURATIONS
// Apple's guidance: Only tint PRIMARY actions, others stay neutral
// ═══════════════════════════════════════════════════════════════════════════════

const variantConfig = {
  primary: {
    // Brass/gold tint - VAULT's primary color
    base: `
      bg-gradient-to-br from-amber-500 to-amber-600
      text-slate-950
      shadow-lg shadow-amber-500/25
    `,
    hover: `
      hover:from-amber-400 hover:to-amber-500
      hover:shadow-xl hover:shadow-amber-500/35
    `,
    active: `
      active:from-amber-600 active:to-amber-700
      active:shadow-md
    `,
    focus: 'focus:ring-amber-500/50',
    glow: 'before:bg-amber-500/20',
  },
  secondary: {
    // Neutral glass - no tint
    base: `
      bg-slate-800/60
      backdrop-blur-sm
      text-slate-200
      border border-white/[0.08]
      shadow-lg shadow-black/20
    `,
    hover: `
      hover:bg-slate-800/80
      hover:border-white/[0.12]
      hover:shadow-xl
    `,
    active: `
      active:bg-slate-800/90
    `,
    focus: 'focus:ring-slate-500/50',
    glow: '',
  },
  ghost: {
    // Minimal presence
    base: `
      bg-transparent
      text-slate-400
    `,
    hover: `
      hover:text-slate-200
      hover:bg-white/[0.05]
    `,
    active: `
      active:bg-white/[0.08]
    `,
    focus: 'focus:ring-slate-500/50',
    glow: '',
  },
  danger: {
    // Red tint for destructive actions
    base: `
      bg-gradient-to-br from-red-500 to-red-600
      text-white
      shadow-lg shadow-red-500/25
    `,
    hover: `
      hover:from-red-400 hover:to-red-500
      hover:shadow-xl hover:shadow-red-500/35
    `,
    active: `
      active:from-red-600 active:to-red-700
      active:shadow-md
    `,
    focus: 'focus:ring-red-500/50',
    glow: 'before:bg-red-500/20',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(
  (
    {
      children,
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      iconPosition = 'left',
      fullWidth = false,
      glow = false,
      illumination = true,
      disabled,
      onMouseDown,
      ...props
    },
    ref
  ) => {
    const { prefersReducedMotion, prefersHighContrast } = useLiquidGlass();
    const [illuminationPos, setIlluminationPos] = useState<{ x: number; y: number } | null>(null);
    const buttonRef = useRef<HTMLButtonElement | null>(null);

    const config = sizeConfig[size];
    const variantStyles = variantConfig[variant];
    const isDisabled = disabled || loading;

    // Handle illumination effect on press
    const handleMouseDown = (e: MouseEvent<HTMLButtonElement>) => {
      if (illumination && !prefersReducedMotion && !isDisabled) {
        const rect = e.currentTarget.getBoundingClientRect();
        setIlluminationPos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
        
        // Clear after animation
        setTimeout(() => setIlluminationPos(null), 600);
      }
      
      onMouseDown?.(e);
    };

    // Merge refs
    const setRefs = (el: HTMLButtonElement | null) => {
      buttonRef.current = el;
      if (typeof ref === 'function') {
        ref(el);
      } else if (ref) {
        ref.current = el;
      }
    };

    return (
      <button
        ref={setRefs}
        className={cn(
          // Base structure
          'relative inline-flex items-center justify-center gap-2',
          'font-medium',
          'overflow-hidden',
          config.padding,
          config.text,
          config.radius,
          
          // Variant styles
          variantStyles.base,
          !isDisabled && variantStyles.hover,
          !isDisabled && variantStyles.active,
          
          // Focus ring
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950',
          variantStyles.focus,
          
          // Transitions
          !prefersReducedMotion && 'transition-all duration-200 ease-out',
          
          // Scale on interaction
          !prefersReducedMotion && !isDisabled && [
            'hover:scale-[1.02]',
            'active:scale-[0.98]',
          ],
          
          // Disabled state
          isDisabled && 'opacity-50 cursor-not-allowed pointer-events-none',
          
          // Full width
          fullWidth && 'w-full',
          
          // Glow effect setup
          glow && variantStyles.glow && [
            'before:absolute before:inset-0',
            config.radius.replace('rounded', 'before:rounded'),
            'before:blur-xl',
            'before:transition-opacity before:duration-300',
            'before:opacity-0',
            'hover:before:opacity-100',
          ],
          
          // High contrast mode
          prefersHighContrast && 'border-2 border-white',
          
          className
        )}
        disabled={isDisabled}
        onMouseDown={handleMouseDown}
        {...props}
      >
        {/* ═══════════════════════════════════════════════════════════════════
            ILLUMINATION EFFECT
            Glow spreads from touch point (Apple's touch feedback)
        ═══════════════════════════════════════════════════════════════════ */}
        {illumination && illuminationPos && !prefersReducedMotion && (
          <span
            className={cn(
              'absolute pointer-events-none',
              'w-32 h-32 -translate-x-1/2 -translate-y-1/2',
              'rounded-full',
              'animate-[ping_0.6s_ease-out_forwards]',
              variant === 'primary' && 'bg-white/30',
              variant === 'secondary' && 'bg-white/20',
              variant === 'ghost' && 'bg-white/15',
              variant === 'danger' && 'bg-white/30',
            )}
            style={{
              left: illuminationPos.x,
              top: illuminationPos.y,
            }}
          />
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            TOP HIGHLIGHT
            Specular highlight across top edge
        ═══════════════════════════════════════════════════════════════════ */}
        <span 
          className={cn(
            'absolute inset-x-0 top-0 h-px',
            'bg-gradient-to-r from-transparent via-white/30 to-transparent',
            'pointer-events-none'
          )}
          aria-hidden="true"
        />

        {/* ═══════════════════════════════════════════════════════════════════
            CONTENT
        ═══════════════════════════════════════════════════════════════════ */}
        
        {/* Loading spinner */}
        {loading && (
          <Loader2 className={cn(config.iconSize, 'animate-spin')} />
        )}
        
        {/* Left icon */}
        {!loading && icon && iconPosition === 'left' && (
          <span className={cn('flex-shrink-0', config.iconSize)}>
            {icon}
          </span>
        )}
        
        {/* Button text */}
        <span className="relative z-10">{children}</span>
        
        {/* Right icon */}
        {!loading && icon && iconPosition === 'right' && (
          <span className={cn('flex-shrink-0', config.iconSize)}>
            {icon}
          </span>
        )}
      </button>
    );
  }
);

GlassButton.displayName = 'GlassButton';

// ═══════════════════════════════════════════════════════════════════════════════
// ICON BUTTON VARIANT
// ═══════════════════════════════════════════════════════════════════════════════

interface GlassIconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  label: string; // Required for accessibility
  loading?: boolean;
}

const iconButtonSizeConfig = {
  sm: 'p-1.5',
  md: 'p-2.5',
  lg: 'p-3',
};

export const GlassIconButton = forwardRef<HTMLButtonElement, GlassIconButtonProps>(
  (
    {
      icon,
      className,
      variant = 'ghost',
      size = 'md',
      label,
      loading = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const { prefersReducedMotion, prefersHighContrast } = useLiquidGlass();
    const isDisabled = disabled || loading;
    const variantStyles = variantConfig[variant];

    return (
      <button
        ref={ref}
        className={cn(
          'relative inline-flex items-center justify-center',
          'rounded-xl',
          iconButtonSizeConfig[size],
          
          variantStyles.base,
          !isDisabled && variantStyles.hover,
          !isDisabled && variantStyles.active,
          
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950',
          variantStyles.focus,
          
          !prefersReducedMotion && 'transition-all duration-200 ease-out',
          !prefersReducedMotion && !isDisabled && [
            'hover:scale-[1.05]',
            'active:scale-[0.95]',
          ],
          
          isDisabled && 'opacity-50 cursor-not-allowed',
          prefersHighContrast && 'border-2 border-white',
          
          className
        )}
        disabled={isDisabled}
        aria-label={label}
        {...props}
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          icon
        )}
      </button>
    );
  }
);

GlassIconButton.displayName = 'GlassIconButton';

// ═══════════════════════════════════════════════════════════════════════════════
// BUTTON GROUP
// ═══════════════════════════════════════════════════════════════════════════════

interface GlassButtonGroupProps {
  children: ReactNode;
  className?: string;
  direction?: 'horizontal' | 'vertical';
}

export function GlassButtonGroup({ 
  children, 
  className,
  direction = 'horizontal' 
}: GlassButtonGroupProps) {
  return (
    <div 
      className={cn(
        'flex gap-3',
        direction === 'vertical' && 'flex-col',
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

export default GlassButton;
