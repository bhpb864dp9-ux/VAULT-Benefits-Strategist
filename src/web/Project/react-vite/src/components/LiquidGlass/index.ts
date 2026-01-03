/**
 * VAULT Liquid Glass Component Library
 * Premium glass morphism components with Apple-style aesthetics
 * 
 * Based on Apple WWDC 2025 Liquid Glass specifications
 * 
 * VAULT LLC — A Northstar|Insight Inc. Company
 * © 2026 All Rights Reserved
 */

// Provider (wrap your app with this)
export { 
  LiquidGlassProvider, 
  useLiquidGlass,
  LIQUID_GLASS_CSS_VARS 
} from './LiquidGlassProvider';

// Glass Card and subcomponents
export { 
  GlassCard,
  GlassCardHeader,
  GlassCardTitle,
  GlassCardDescription,
  GlassCardContent,
  GlassCardFooter 
} from './GlassCard';

// Glass Button variants
export { 
  GlassButton,
  GlassIconButton,
  GlassButtonGroup 
} from './GlassButton';

// Glass Panel
export { default as GlassPanel } from './GlassPanel';
