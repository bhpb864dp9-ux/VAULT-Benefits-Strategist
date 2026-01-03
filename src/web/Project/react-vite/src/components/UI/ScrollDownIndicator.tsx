/**
 * VAULT — Liquid Glass Scroll Down Indicator
 * REL-022: Floating button to scroll to bottom of page
 * Shows when not at bottom, complements scroll-to-top functionality
 */

import { ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ScrollDownIndicatorProps {
  threshold?: number;  // Buffer from bottom to consider "at bottom"
}

export default function ScrollDownIndicator({ threshold = 100 }: ScrollDownIndicatorProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const clientHeight = window.innerHeight;

      // Show when not at bottom (with threshold buffer)
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - threshold;

      // Show when there's content to scroll and not at bottom
      setVisible(!isAtBottom && scrollHeight > clientHeight + 200);
    };

    handleScroll(); // Check initial state
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [threshold]);

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToBottom}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 group"
      aria-label="Scroll to bottom"
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
