/**
 * VAULT Glass Container — Content Wrapper Component
 * Provides consistent glass-styled content containment
 *
 * VAULT LLC — A Northstar|Insight Inc. Company
 * © 2026 All Rights Reserved
 */

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlassContainerProps {
  children: ReactNode;
  className?: string;
  /** Container max-width preset */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Vertical padding preset */
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  /** Center content horizontally */
  centered?: boolean;
}

const sizeClasses = {
  sm: 'max-w-2xl',
  md: 'max-w-4xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  full: 'max-w-full',
};

const paddingClasses = {
  none: '',
  sm: 'py-8',
  md: 'py-12',
  lg: 'py-16',
  xl: 'py-24',
};

export function GlassContainer({
  children,
  className = '',
  size = 'lg',
  padding = 'md',
  centered = true,
}: GlassContainerProps) {
  return (
    <div
      className={cn(
        'w-full px-4 sm:px-6 lg:px-8',
        sizeClasses[size],
        paddingClasses[padding],
        centered && 'mx-auto',
        className
      )}
    >
      {children}
    </div>
  );
}

export default GlassContainer;
