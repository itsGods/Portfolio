import { LazyMotion, domAnimation, m, useScroll, useTransform } from "motion/react";
import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { useAccessibleSpring } from "../hooks/useAccessibleSpring";

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
  const mouseX = useAccessibleSpring(0, springConfig);
  const mouseY = useAccessibleSpring(0, springConfig);
  const rotateX = useAccessibleSpring(0, springConfig);
  const rotateY = useAccessibleSpring(0, springConfig);

  useEffect(() => {
    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      
      animationFrameId = requestAnimationFrame(() => {
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
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [mouseX, mouseY, rotateX, rotateY]);

  return (
    <LazyMotion features={domAnimation}>
      <section
        id="home"
        ref={containerRef}
        className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-brand-black"
        style={{ perspective: "1000px" }}
      >
        {/* SEO H1 Tag - Visually hidden but readable by search engines */}
        <h1 className="sr-only">
          Habib — Premium Digital Engineer | High-Performance Web Applications
        </h1>

        {/* Layer 0: Architectural Grid */}
        <div aria-hidden="true" inert={true} className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)]" />

        {/* Layer 1: Interactive Background Glow */}
        <m.div
          aria-hidden="true" inert={true}
          style={{ x: mouseX, y: mouseY }}
          className="absolute left-1/2 top-1/2 z-0 h-[60vh] w-[60vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-orange/20 blur-[120px] mix-blend-screen"
        />

        {/* Layer 2: Deep Background Typography */}
        <m.div aria-hidden="true" inert={true} style={{ y: yBg, x: useTransform(mouseX, (v: number) => v * 0.5) }} className="pointer-events-none absolute top-1/4 z-0 flex w-full justify-center opacity-5">
          <span className="font-display text-[20vw] font-black tracking-tighter text-white">CREATIVE</span>
        </m.div>

        {/* Layer 3: Main Image Container */}
        <m.div
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
          <m.div
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
                alt="TG Habib Poster"
                width="1200"
                height="800"
                fetchPriority="high"
                loading="eager"
                decoding="sync"
                className="w-[90vw] max-w-6xl h-auto object-contain drop-shadow-[0_0_50px_rgba(255,90,0,0.15)]"
                style={{
                  // Feather the edges of the image so it blends seamlessly into the black background
                  maskImage: "radial-gradient(ellipse 95% 95% at 50% 50%, black 70%, transparent 100%)",
                  WebkitMaskImage: "radial-gradient(ellipse 95% 95% at 50% 50%, black 70%, transparent 100%)",
                }}
                referrerPolicy="no-referrer"
              />
            </div>
          </m.div>
        </m.div>

        {/* Layer 4: Foreground Floating Elements (Parallax) */}
        <m.div 
          style={{ y: yFg, x: useTransform(mouseX, (v: number) => v * 1.5) }} 
          className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
        >
          {/* Outline Typography Overlapping Image */}
          <div className="absolute top-[60%] w-full text-center mix-blend-screen opacity-90">
            <div className="relative inline-block">
              {/* Dark Base */}
              <span className="font-display text-[15vw] font-black tracking-tighter cyber-base">
                DEVELOPER
              </span>
              {/* Subtle Glitch Overlay */}
              <span className="absolute left-0 top-0 font-display text-[15vw] font-black tracking-tighter cyber-glitch pointer-events-none">
                DEVELOPER
              </span>
              {/* Laser Scanline Glow (Blurred) */}
              <span className="absolute left-0 top-0 font-display text-[15vw] font-black tracking-tighter cyber-scanline pointer-events-none blur-[12px] opacity-70">
                DEVELOPER
              </span>
              {/* Laser Scanline (Sharp) */}
              <span className="absolute left-0 top-0 font-display text-[15vw] font-black tracking-tighter cyber-scanline pointer-events-none">
                DEVELOPER
              </span>
            </div>
            
            {/* Primary CTA */}
            <div className="mt-12 pointer-events-auto flex justify-center">
              <m.a 
                href="#projects"
                whileHover="hover"
                initial="initial"
                className="group relative inline-flex items-center justify-center gap-6 px-10 py-5 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full overflow-hidden transition-all duration-500 hover:border-brand-orange/50 hover:bg-black/60"
              >
                {/* Animated Background Glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-orange/0 via-brand-orange/20 to-brand-orange/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-brand-orange/20 rounded-full blur-2xl" />
                </div>

                {/* Text Container */}
                <div className="relative z-10 flex flex-col h-[1.2em] overflow-hidden font-mono text-sm font-bold tracking-[0.2em] uppercase text-white">
                  <m.span 
                    variants={{
                      initial: { y: 0 },
                      hover: { y: "-100%" }
                    }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-center"
                  >
                    View Projects
                  </m.span>
                  <m.span 
                    variants={{
                      initial: { y: "100%" },
                      hover: { y: "-100%" }
                    }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 flex items-center text-brand-orange"
                  >
                    View Projects
                  </m.span>
                </div>

                {/* Arrow Icon */}
                <div className="relative z-10 flex items-center justify-center w-10 h-10 rounded-full bg-white/10 group-hover:bg-brand-orange text-white group-hover:text-black transition-colors duration-500 overflow-hidden">
                  <m.div
                    variants={{
                      initial: { x: 0 },
                      hover: { x: 40 }
                    }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute flex items-center justify-center"
                  >
                    <ArrowRight size={16} />
                  </m.div>
                  <m.div
                    variants={{
                      initial: { x: -40 },
                      hover: { x: 0 }
                    }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute flex items-center justify-center"
                  >
                    <ArrowRight size={16} />
                  </m.div>
                </div>

                {/* Outer Glow on Hover */}
                <div className="absolute inset-0 rounded-full shadow-[0_0_0_rgba(242,125,38,0)] group-hover:shadow-[0_0_40px_rgba(242,125,38,0.4)] transition-shadow duration-700 pointer-events-none" />
              </m.a>
            </div>
          </div>
        </m.div>

        {/* Layer 5: Vignette & Gradient */}
        <div aria-hidden="true" inert={true} className="pointer-events-none absolute inset-0 z-30 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(10,10,10,0.8)_100%)]" />
        <div aria-hidden="true" inert={true} className="pointer-events-none absolute bottom-0 left-0 z-30 h-48 w-full bg-gradient-to-b from-transparent to-brand-black" />

        {/* Scroll Indicator */}
        <m.div
          aria-hidden="true" inert={true}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-8 right-6 z-40 flex flex-col items-center gap-4 md:bottom-12 md:right-12"
        >
          <m.div style={{ opacity: opacityScroll }} className="flex flex-col items-center gap-4">
            <span className="[writing-mode:vertical-rl] font-mono text-xs uppercase tracking-[0.2em] text-white/50">
              Scroll
            </span>
            <m.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="h-12 w-[1px] bg-gradient-to-b from-brand-orange to-transparent"
            />
          </m.div>
        </m.div>
      </section>
    </LazyMotion>
  );
}
