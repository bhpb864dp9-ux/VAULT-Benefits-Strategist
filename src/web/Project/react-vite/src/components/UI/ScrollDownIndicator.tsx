/**
 * VAULT — Liquid Glass Scroll Down Indicator
 * Floating button to quickly scroll down on phase pages
 */

import { ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ScrollDownIndicatorProps {
  threshold?: number;  // Hide after scrolling this many pixels
}

export default function ScrollDownIndicator({ threshold = 200 }: ScrollDownIndicatorProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY < threshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  const scrollDown = () => {
    window.scrollBy({
      top: window.innerHeight * 0.7,
      behavior: 'smooth'
    });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollDown}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 group"
      aria-label="Scroll down"
    >
      <div className="relative flex flex-col items-center gap-2">
        {/* Glass pill container */}
        <div
          className="px-4 py-2 rounded-full backdrop-blur-xl transition-all duration-300
                     group-hover:scale-105 group-active:scale-95"
          style={{
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          }}
        >
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">
              Scroll
            </span>
            <ChevronDown
              className="w-4 h-4 text-slate-300 animate-bounce"
              style={{ animationDuration: '1.5s' }}
            />
          </div>
        </div>
      </div>
    </button>
  );
}
