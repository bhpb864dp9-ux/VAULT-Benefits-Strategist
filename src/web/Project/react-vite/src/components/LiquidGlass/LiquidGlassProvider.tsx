/**
 * VAULT LiquidGlassProvider
 * Global SVG filter injection for Liquid Glass effects
 * 
 * Based on Apple WWDC 2025 Liquid Glass specifications
 * 
 * ODT-2 Vault-Dev — Tidewater Convergence
 * VAULT LLC — A Northstar|Insight Inc. Company
 * © 2026 All Rights Reserved
 */

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface LiquidGlassContextType {
  supportsDistortion: boolean;
  prefersReducedMotion: boolean;
  prefersReducedTransparency: boolean;
  prefersHighContrast: boolean;
  filtersReady: boolean;
}

interface LiquidGlassProviderProps {
  children: ReactNode;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SVG FILTER DEFINITIONS
// Based on Apple's Liquid Glass implementation research
// ═══════════════════════════════════════════════════════════════════════════════

const SVG_FILTERS = `
<svg 
  xmlns="http://www.w3.org/2000/svg" 
  width="0" 
  height="0" 
  style="position: absolute; overflow: hidden; pointer-events: none;"
  aria-hidden="true"
>
  <defs>
    <!-- 
      LIQUID GLASS DISTORTION FILTER - Standard
      Creates the "lensing" effect where content bends at glass edges
      Scale: 50 provides subtle, elegant distortion
    -->
    <filter 
      id="vault-lg-distort" 
      x="-10%" 
      y="-10%" 
      width="120%" 
      height="120%"
      filterUnits="objectBoundingBox"
      primitiveUnits="userSpaceOnUse"
    >
      <!-- Generate organic noise texture -->
      <feTurbulence 
        type="fractalNoise" 
        baseFrequency="0.008 0.008" 
        numOctaves="2" 
        seed="42" 
        result="noise"
        stitchTiles="stitch"
      />
      
      <!-- Soften the noise for smoother distortion -->
      <feGaussianBlur 
        in="noise" 
        stdDeviation="1.5" 
        result="softNoise" 
      />
      
      <!-- Apply displacement to create glass refraction effect -->
      <feDisplacementMap 
        in="SourceGraphic" 
        in2="softNoise" 
        scale="50" 
        xChannelSelector="R" 
        yChannelSelector="G"
        result="displaced"
      />
    </filter>
    
    <!-- 
      LIQUID GLASS DISTORTION FILTER - Large Elements
      For hero sections, modals - more pronounced effect
    -->
    <filter 
      id="vault-lg-distort-lg" 
      x="-10%" 
      y="-10%" 
      width="120%" 
      height="120%"
      filterUnits="objectBoundingBox"
    >
      <feTurbulence 
        type="fractalNoise" 
        baseFrequency="0.005 0.005" 
        numOctaves="3" 
        seed="42" 
        result="noise"
        stitchTiles="stitch"
      />
      <feGaussianBlur 
        in="noise" 
        stdDeviation="2" 
        result="softNoise" 
      />
      <feDisplacementMap 
        in="SourceGraphic" 
        in2="softNoise" 
        scale="70" 
        xChannelSelector="R" 
        yChannelSelector="G"
      />
    </filter>
    
    <!-- 
      LIQUID GLASS DISTORTION FILTER - Subtle
      For buttons and small controls - minimal distortion
    -->
    <filter 
      id="vault-lg-distort-sm" 
      x="-5%" 
      y="-5%" 
      width="110%" 
      height="110%"
      filterUnits="objectBoundingBox"
    >
      <feTurbulence 
        type="fractalNoise" 
        baseFrequency="0.01 0.01" 
        numOctaves="1" 
        seed="42" 
        result="noise"
      />
      <feGaussianBlur 
        in="noise" 
        stdDeviation="1" 
        result="softNoise" 
      />
      <feDisplacementMap 
        in="SourceGraphic" 
        in2="softNoise" 
        scale="30" 
        xChannelSelector="R" 
        yChannelSelector="G"
      />
    </filter>
    
    <!--
      SPECULAR LIGHTING FILTER
      Creates realistic light reflection on glass surface
    -->
    <filter id="vault-lg-specular" x="0%" y="0%" width="100%" height="100%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="4" result="blur" />
      <feSpecularLighting 
        in="blur" 
        surfaceScale="5" 
        specularConstant="0.75" 
        specularExponent="20" 
        lighting-color="#ffffff"
        result="specOut"
      >
        <fePointLight x="-5000" y="-10000" z="20000" />
      </feSpecularLighting>
      <feComposite 
        in="specOut" 
        in2="SourceAlpha" 
        operator="in" 
        result="specOut2"
      />
      <feComposite 
        in="SourceGraphic" 
        in2="specOut2" 
        operator="arithmetic" 
        k1="0" k2="1" k3="1" k4="0"
      />
    </filter>
  </defs>
</svg>
`;

// ═══════════════════════════════════════════════════════════════════════════════
// CONTEXT
// ═══════════════════════════════════════════════════════════════════════════════

const LiquidGlassContext = createContext<LiquidGlassContextType>({
  supportsDistortion: false,
  prefersReducedMotion: false,
  prefersReducedTransparency: false,
  prefersHighContrast: false,
  filtersReady: false,
});

// ═══════════════════════════════════════════════════════════════════════════════
// PROVIDER COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export function LiquidGlassProvider({ children }: LiquidGlassProviderProps) {
  const [filtersReady, setFiltersReady] = useState(false);
  const [supportsDistortion, setSupportsDistortion] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [prefersReducedTransparency, setPrefersReducedTransparency] = useState(false);
  const [prefersHighContrast, setPrefersHighContrast] = useState(false);

  useEffect(() => {
    // Inject SVG filters into document
    if (!document.getElementById('vault-liquid-glass-filters')) {
      const container = document.createElement('div');
      container.id = 'vault-liquid-glass-filters';
      container.innerHTML = SVG_FILTERS;
      document.body.appendChild(container);
      setFiltersReady(true);
    }

    // Detect browser support for SVG filters with backdrop-filter
    // Safari doesn't support this combination well
    const detectSupport = () => {
      const ua = navigator.userAgent.toLowerCase();
      const isSafari = ua.includes('safari') && !ua.includes('chrome');
      const isIOS = /iphone|ipad|ipod/.test(ua);
      
      // Safari and iOS don't fully support SVG displacement with backdrop-filter
      setSupportsDistortion(!isSafari && !isIOS);
    };

    // Listen for accessibility preferences
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const transparencyQuery = window.matchMedia('(prefers-reduced-transparency: reduce)');
    const contrastQuery = window.matchMedia('(prefers-contrast: more)');

    setPrefersReducedMotion(motionQuery.matches);
    setPrefersReducedTransparency(transparencyQuery.matches);
    setPrefersHighContrast(contrastQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    const handleTransparencyChange = (e: MediaQueryListEvent) => setPrefersReducedTransparency(e.matches);
    const handleContrastChange = (e: MediaQueryListEvent) => setPrefersHighContrast(e.matches);

    motionQuery.addEventListener('change', handleMotionChange);
    transparencyQuery.addEventListener('change', handleTransparencyChange);
    contrastQuery.addEventListener('change', handleContrastChange);

    detectSupport();

    return () => {
      motionQuery.removeEventListener('change', handleMotionChange);
      transparencyQuery.removeEventListener('change', handleTransparencyChange);
      contrastQuery.removeEventListener('change', handleContrastChange);
    };
  }, []);

  return (
    <LiquidGlassContext.Provider
      value={{
        supportsDistortion,
        prefersReducedMotion,
        prefersReducedTransparency,
        prefersHighContrast,
        filtersReady,
      }}
    >
      {children}
    </LiquidGlassContext.Provider>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// HOOK
// ═══════════════════════════════════════════════════════════════════════════════

export function useLiquidGlass() {
  const context = useContext(LiquidGlassContext);
  
  if (!context) {
    // Return safe defaults if used outside provider
    return {
      supportsDistortion: false,
      prefersReducedMotion: false,
      prefersReducedTransparency: false,
      prefersHighContrast: false,
      filtersReady: false,
      getFilterStyle: () => ({}),
      getGlassStyle: () => ({}),
    };
  }

  // Helper to get appropriate filter style based on preferences
  const getFilterStyle = (size: 'sm' | 'md' | 'lg' = 'md') => {
    if (context.prefersReducedTransparency || !context.supportsDistortion) {
      return {};
    }

    const filterIds = {
      sm: 'vault-lg-distort-sm',
      md: 'vault-lg-distort',
      lg: 'vault-lg-distort-lg',
    };

    return {
      filter: `url(#${filterIds[size]})`,
    };
  };

  // Helper to get glass material style based on preferences
  const getGlassStyle = () => {
    if (context.prefersReducedTransparency) {
      return {
        background: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'none',
      };
    }

    if (context.prefersHighContrast) {
      return {
        background: 'rgba(0, 0, 0, 0.9)',
        border: '2px solid white',
      };
    }

    return {
      background: 'rgba(15, 23, 42, 0.6)',
      backdropFilter: 'blur(20px) saturate(180%)',
    };
  };

  return {
    ...context,
    getFilterStyle,
    getGlassStyle,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// CSS CUSTOM PROPERTIES (Inject via style tag)
// ═══════════════════════════════════════════════════════════════════════════════

export const LIQUID_GLASS_CSS_VARS = `
:root {
  /* Glass backgrounds */
  --lg-bg-light: rgba(255, 255, 255, 0.1);
  --lg-bg-medium: rgba(15, 23, 42, 0.6);
  --lg-bg-heavy: rgba(15, 23, 42, 0.8);
  
  /* Glass borders */
  --lg-border-subtle: rgba(255, 255, 255, 0.06);
  --lg-border-medium: rgba(255, 255, 255, 0.1);
  --lg-border-strong: rgba(255, 255, 255, 0.15);
  
  /* Specular highlights */
  --lg-highlight-soft: rgba(255, 255, 255, 0.05);
  --lg-highlight-medium: rgba(255, 255, 255, 0.15);
  --lg-highlight-bright: rgba(255, 255, 255, 0.25);
  
  /* Shadows */
  --lg-shadow-sm: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --lg-shadow-md: 0 10px 15px -3px rgba(0, 0, 0, 0.2);
  --lg-shadow-lg: 0 25px 50px -12px rgba(0, 0, 0, 0.35);
  
  /* Transitions */
  --lg-transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --lg-transition-normal: 300ms cubic-bezier(0.4, 0, 0.2, 1);
  --lg-transition-slow: 500ms cubic-bezier(0.4, 0, 0.2, 1);
  
  /* Border radius */
  --lg-radius-sm: 0.75rem;
  --lg-radius-md: 1rem;
  --lg-radius-lg: 1.5rem;
  --lg-radius-xl: 2rem;
}

/* Reduced transparency mode */
@media (prefers-reduced-transparency: reduce) {
  :root {
    --lg-bg-light: rgba(30, 41, 59, 0.95);
    --lg-bg-medium: rgba(15, 23, 42, 0.98);
    --lg-bg-heavy: rgba(2, 6, 23, 0.99);
  }
}

/* High contrast mode */
@media (prefers-contrast: more) {
  :root {
    --lg-border-subtle: rgba(255, 255, 255, 0.3);
    --lg-border-medium: rgba(255, 255, 255, 0.5);
    --lg-border-strong: rgba(255, 255, 255, 0.8);
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  :root {
    --lg-transition-fast: 0.01ms;
    --lg-transition-normal: 0.01ms;
    --lg-transition-slow: 0.01ms;
  }
}
`;

export default LiquidGlassProvider;
