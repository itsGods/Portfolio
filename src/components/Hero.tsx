import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { useEffect, useRef } from "react";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  
  // Parallax for scroll
  const yImage = useTransform(scrollY, [0, 1000], [0, 200]);
  const yBg = useTransform(scrollY, [0, 1000], [0, 300]);
  const yFg = useTransform(scrollY, [0, 1000], [0, -150]);
  const scaleImage = useTransform(scrollY, [0, 800], [1, 1.1]);
  const opacityImage = useTransform(scrollY, [0, 600], [1, 0]);
  const opacityScroll = useTransform(scrollY, [0, 150], [1, 0]);

  // Spring physics for mouse movement
  const springConfig = { damping: 30, stiffness: 50, mass: 0.5 };
  const mouseX = useSpring(0, springConfig);
  const mouseY = useSpring(0, springConfig);
  const rotateX = useSpring(0, springConfig);
  const rotateY = useSpring(0, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      // Calculate mouse position relative to center (-0.5 to 0.5)
      const xPct = e.clientX / innerWidth - 0.5;
      const yPct = e.clientY / innerHeight - 0.5;
      
      // Move image slightly
      mouseX.set(xPct * 30);
      mouseY.set(yPct * 30);
      
      // Tilt image
      rotateX.set(yPct * -15); // Look up/down
      rotateY.set(xPct * 15);  // Look left/right
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY, rotateX, rotateY]);

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-brand-black"
      style={{ perspective: "1000px" }}
    >
      {/* Layer 0: Architectural Grid */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)]" />

      {/* Layer 1: Interactive Background Glow */}
      <motion.div
        style={{ x: mouseX, y: mouseY }}
        className="absolute left-1/2 top-1/2 z-0 h-[60vh] w-[60vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-orange/20 blur-[120px] mix-blend-screen"
      />

      {/* Layer 2: Deep Background Typography */}
      <motion.div style={{ y: yBg, x: useTransform(mouseX, v => v * 0.5) }} className="pointer-events-none absolute top-1/4 z-0 flex w-full justify-center opacity-5">
        <span className="font-display text-[20vw] font-black tracking-tighter text-white">CREATIVE</span>
      </motion.div>

      {/* Layer 3: Main Image Container */}
      <motion.div
        style={{
          y: yImage,
          scale: scaleImage,
          opacity: opacityImage,
          rotateX,
          rotateY,
          x: mouseX,
          transformStyle: "preserve-3d",
        }}
        initial={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex h-full w-full items-center justify-center p-4 md:p-12"
      >
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="relative flex items-center justify-center"
        >
          <div className="relative inline-flex items-center justify-center">
            {/* Corner Brackets framing the image */}
            <div className="absolute -left-4 -top-4 h-16 w-16 border-l-2 border-t-2 border-white/20" style={{ transform: "translateZ(30px)" }} />
            <div className="absolute -right-4 -top-4 h-16 w-16 border-r-2 border-t-2 border-white/20" style={{ transform: "translateZ(30px)" }} />
            <div className="absolute -bottom-4 -left-4 h-16 w-16 border-b-2 border-l-2 border-white/20" style={{ transform: "translateZ(30px)" }} />
            <div className="absolute -bottom-4 -right-4 h-16 w-16 border-b-2 border-r-2 border-white/20" style={{ transform: "translateZ(30px)" }} />

            <img
              src="https://raw.githubusercontent.com/itsGods/Personal/refs/heads/main/file_000000006fd471fd89333f3da8a3d975%20(1).png"
              alt="Habib Poster"
              className="w-[90vw] max-w-6xl h-auto object-contain drop-shadow-[0_0_50px_rgba(255,90,0,0.15)]"
              style={{
                // Feather the edges of the image so it blends seamlessly into the black background
                maskImage: "radial-gradient(ellipse 95% 95% at 50% 50%, black 70%, transparent 100%)",
                WebkitMaskImage: "radial-gradient(ellipse 95% 95% at 50% 50%, black 70%, transparent 100%)",
              }}
              referrerPolicy="no-referrer"
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Layer 4: Foreground Floating Elements (Parallax) */}
      <motion.div 
        style={{ y: yFg, x: useTransform(mouseX, v => v * 1.5) }} 
        className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
      >
        {/* Outline Typography Overlapping Image */}
        <div className="absolute top-[60%] w-full text-center mix-blend-overlay opacity-50">
          <span className="font-display text-[15vw] font-black tracking-tighter text-transparent" style={{ WebkitTextStroke: "2px rgba(255,255,255,0.8)" }}>
            DEVELOPER
          </span>
        </div>

        {/* Floating Tech Data - Top Left */}
        <div className="absolute left-8 top-32 hidden flex-col gap-2 md:flex">
          <div className="h-[2px] w-8 bg-brand-orange" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-white/70">SYS.INIT // 2026</span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-white/40">LAT: 34.0522 N</span>
        </div>

        {/* Floating Tech Data - Bottom Right */}
        <div className="absolute bottom-32 right-8 hidden flex-col items-end gap-2 md:flex">
          <span className="font-mono text-[10px] uppercase tracking-widest text-white/70">STATUS: ONLINE</span>
          <div className="flex items-end gap-1 h-8">
            {[...Array(5)].map((_, i) => (
              <motion.div 
                key={i} 
                animate={{ height: [8, Math.random() * 24 + 8, 8] }}
                transition={{ duration: 1.5 + Math.random(), repeat: Infinity, ease: "easeInOut" }}
                className="w-1 bg-brand-orange/60" 
              />
            ))}
          </div>
        </div>

        {/* Floating Glassmorphic Elements */}
        <motion.div 
          animate={{ y: [0, 20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[15%] top-[20%] h-24 w-24 rounded-full border border-white/10 bg-white/5 backdrop-blur-md"
        />
        <motion.div 
          animate={{ y: [0, -30, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[20%] right-[15%] h-32 w-32 rounded-full border border-brand-orange/20 bg-brand-orange/5 backdrop-blur-md"
        />
      </motion.div>

      {/* Layer 5: Vignette & Gradient */}
      <div className="pointer-events-none absolute inset-0 z-30 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(10,10,10,0.8)_100%)]" />
      <div className="pointer-events-none absolute bottom-0 left-0 z-30 h-48 w-full bg-gradient-to-b from-transparent to-brand-black" />

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-8 right-6 z-40 flex flex-col items-center gap-4 md:bottom-12 md:right-12"
      >
        <motion.div style={{ opacity: opacityScroll }} className="flex flex-col items-center gap-4">
          <span className="[writing-mode:vertical-rl] font-mono text-xs uppercase tracking-[0.2em] text-white/50">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="h-12 w-[1px] bg-gradient-to-b from-brand-orange to-transparent"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
