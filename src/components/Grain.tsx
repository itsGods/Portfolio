import { motion } from "motion/react";

export default function Grain() {
  return (
    <div aria-hidden="true" inert={true} className="pointer-events-none fixed inset-0 z-50 h-full w-full opacity-[0.03] mix-blend-overlay">
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
        <filter id="noiseFilter">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>
    </div>
  );
}
