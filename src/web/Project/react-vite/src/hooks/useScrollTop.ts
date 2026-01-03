import { useLayoutEffect } from 'react';

export function useScrollTop(dependency: unknown, behavior: ScrollBehavior = 'smooth') {
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior });
  }, [dependency]);
}

export function useScrollToElement(elementId: string, dependency: unknown, behavior: ScrollBehavior = 'smooth') {
  useLayoutEffect(() => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior, block: 'start' });
      setTimeout(() => {
        const firstFocusable = element.querySelector<HTMLElement>('input, button, select, textarea');
        firstFocusable?.focus();
      }, 100);
    }
  }, [elementId, dependency]);
}

export default useScrollTop;
