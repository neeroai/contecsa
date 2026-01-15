'use client';

import * as React from 'react';

const MOBILE_BREAKPOINT = 768;

/**
 * Detect if viewport width is mobile (less than 768px)
 * Uses matchMedia API for responsive behavior on window resize events
 *
 * @returns True if viewport is <768px width, false for desktop
 *
 * @example
 * ```ts
 * function MyComponent() {
 *   const isMobile = useIsMobile();
 *   return isMobile ? <MobileNav /> : <DesktopNav />;
 * }
 * ```
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener('change', onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return !!isMobile;
}
