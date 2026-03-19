import { useSpring, useReducedMotion, MotionValue } from 'motion/react';

export function useAccessibleSpring(value: MotionValue<number> | number, config: any = {}): MotionValue<number> {
  const shouldReduceMotion = useReducedMotion();
  
  // If reduced motion is preferred, use a spring with no bounce and instant duration
  // or simply bypass the spring physics.
  const accessibleConfig = shouldReduceMotion 
    ? { duration: 0, bounce: 0, type: "tween" } 
    : config;

  return useSpring(value as any, accessibleConfig) as unknown as MotionValue<number>;
}
