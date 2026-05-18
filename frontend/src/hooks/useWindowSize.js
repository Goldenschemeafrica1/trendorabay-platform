import { useState, useEffect } from 'react';

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

// Hook for responsive breakpoints
export const useBreakpoint = () => {
  const { width } = useWindowSize();

  const breakpoints = {
    xs: width < 576,
    sm: width >= 576 && width < 768,
    md: width >= 768 && width < 992,
    lg: width >= 992 && width < 1200,
    xl: width >= 1200 && width < 1400,
    xxl: width >= 1400,
  };

  const currentBreakpoint = Object.keys(breakpoints).find(
    key => breakpoints[key]
  ) || 'xs';

  return {
    ...breakpoints,
    current: currentBreakpoint,
    isMobile: width < 768,
    isTablet: width >= 768 && width < 992,
    isDesktop: width >= 992,
    width,
    height,
  };
};

// Hook for mobile detection
export const useIsMobile = () => {
  const { isMobile } = useBreakpoint();
  return isMobile;
};

// Hook for tablet detection
export const useIsTablet = () => {
  const { isTablet } = useBreakpoint();
  return isTablet;
};

// Hook for desktop detection
export const useIsDesktop = () => {
  const { isDesktop } = useBreakpoint();
  return isDesktop;
};

// Hook for orientation
export const useOrientation = () => {
  const [orientation, setOrientation] = useState(
    typeof window !== 'undefined' 
      ? window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
      : 'landscape'
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOrientationChange = () => {
      setOrientation(
        window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
      );
    };

    window.addEventListener('resize', handleOrientationChange);
    
    return () => window.removeEventListener('resize', handleOrientationChange);
  }, []);

  return orientation;
};

export default useWindowSize;
