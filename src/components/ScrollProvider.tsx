import React, { createContext, useContext, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { useAnimationFrame } from 'motion/react';

interface ScrollContextType {
  lenis: Lenis | null;
}

const ScrollContext = createContext<ScrollContextType>({ lenis: null });

export const useScrollContext = () => useContext(ScrollContext);

export const ScrollProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    const handleStop = () => lenis.stop();
    const handleStart = () => lenis.start();
    window.addEventListener('stop-lenis', handleStop);
    window.addEventListener('start-lenis', handleStart);

    return () => {
      window.removeEventListener('stop-lenis', handleStop);
      window.removeEventListener('start-lenis', handleStart);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Sync Lenis with Framer Motion's internal RAF
  // This prevents double RAF calls and reduces INP (Interaction to Next Paint)
  useAnimationFrame((time) => {
    if (lenisRef.current) {
      lenisRef.current.raf(time);
    }
  });

  return (
    <ScrollContext.Provider value={{ lenis: lenisRef.current }}>
      {children}
    </ScrollContext.Provider>
  );
};
