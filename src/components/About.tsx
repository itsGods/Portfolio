import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { useRef, useState, useEffect } from "react";

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentImage, setCurrentImage] = useState(0);

  const images = [
    "https://raw.githubusercontent.com/itsGods/Personal/refs/heads/main/file_0000000038e47208a7c7e84e80a5026d.png",
    "https://res.cloudinary.com/dwlquotvw/image/upload/v1773599675/IMG_20260316_000417_qfhbnd.png"
  ];

  const handleNextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-5, 5]);

  const text = "I am a Premium Digital Engineer, building high-performance, cinematic web applications that elevate brands and drive conversions.";
  const words = text.split(" ");

  return (
    <section id="about" ref={containerRef} className="relative w-full bg-brand-dark py-32 md:py-48 overflow-hidden">
      {/* Background Elements */}
      <div aria-hidden="true" inert={true} className="absolute left-0 top-1/2 -translate-y-1/2 h-[50vh] w-[50vw] rounded-full bg-brand-orange/5 blur-[120px] pointer-events-none" />
      
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center justify-between gap-24 px-6 md:flex-row md:px-12">
        
        {/* Left: Kinetic Typography */}
        <motion.div style={{ y: y1 }} className="flex-1 md:pr-12">
          <div className="mb-8 flex items-center gap-4">
            <div className="h-[1px] w-8 bg-brand-orange" />
            <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-brand-orange">
              IDENTITY // 01
            </h2>
          </div>
          
          <div className="font-serif text-4xl leading-tight text-white md:text-5xl lg:text-6xl">
            {words.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="inline-block mr-[0.25em]"
              >
                {word === "Premium" || word === "Digital" || word === "Engineer," ? (
                  <span className="font-display font-bold italic text-brand-orange relative group">
                    {word}
                    <span className="absolute -bottom-2 left-0 h-[2px] w-full bg-brand-orange/30" />
                    <motion.span 
                      className="absolute left-0 top-0 text-white/20 mix-blend-overlay pointer-events-none"
                      animate={{ 
                        opacity: [0, 1, 0, 0.5, 0],
                        x: [0, -2, 2, -1, 0]
                      }}
                      transition={{ 
                        duration: 0.2, 
                        repeat: Infinity,
                        repeatDelay: 2 + Math.random() * 2
                      }}
                    >
                      {word}
                    </motion.span>
                  </span>
                ) : (
                  word
                )}
              </motion.span>
            ))}
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mt-16 max-w-md font-sans text-lg text-white/60"
          >
            <p className="mb-8 leading-relaxed">
              My work lives at the intersection of design, motion, and engineering. I don't just write code; I craft high-converting digital experiences. Every pixel is intentional, every animation is choreographed to drive business value.
            </p>
            <a href="#contact" aria-label="Contact me" className="group flex w-max items-center gap-4 font-mono text-sm uppercase tracking-widest text-white transition-colors hover:text-brand-orange">
              <span className="relative flex h-12 w-12 items-center justify-center rounded-full border border-white/20 transition-colors group-hover:border-brand-orange">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">
                  <line x1="5" y1="19" x2="19" y2="5"></line>
                  <polyline points="10 5 19 5 19 14"></polyline>
                </svg>
              </span>
              Let's Talk
            </a>
          </motion.div>
        </motion.div>

        {/* Right: Floating Image */}
        <motion.div style={{ y: y2, rotate }} className="relative flex-1 w-full max-w-md">
          <div 
            className="group relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-brand-dark cursor-pointer"
            onClick={handleNextImage}
          >
            <AnimatePresence initial={false}>
              <motion.img
                key={currentImage}
                src={images[currentImage]}
                alt="TG Habib - Creative Developer and Vibecoder Portrait"
                width="600"
                height="800"
                initial={{ opacity: 0, x: "100%", scale: 1.05 }}
                animate={{ opacity: 1, x: "0%", scale: 1 }}
                exit={{ opacity: 0, x: "-100%", scale: 0.95 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 h-full w-full object-cover"
                referrerPolicy="no-referrer"
                loading="lazy"
                decoding="async"
              />
            </AnimatePresence>
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-brand-black/80 via-transparent to-transparent pointer-events-none" />
            
            {/* Decorative Elements */}
            <div aria-hidden="true" inert={true} className="absolute -inset-2 z-20 border border-white/5 bg-white/[0.02] transition-colors duration-500 group-hover:border-brand-orange/20 group-hover:bg-brand-orange/[0.02] pointer-events-none" />
            
            <div aria-hidden="true" inert={true} className="absolute -left-4 -top-4 h-8 w-8 border-l-2 border-t-2 border-brand-orange/50 transition-all duration-500 group-hover:-left-6 group-hover:-top-6 group-hover:border-brand-orange" />
            <div aria-hidden="true" inert={true} className="absolute -right-4 -top-4 h-8 w-8 border-r-2 border-t-2 border-brand-orange/50 transition-all duration-500 group-hover:-right-6 group-hover:-top-6 group-hover:border-brand-orange" />
            <div aria-hidden="true" inert={true} className="absolute -bottom-4 -left-4 h-8 w-8 border-b-2 border-l-2 border-brand-orange/50 transition-all duration-500 group-hover:-bottom-6 group-hover:-left-6 group-hover:border-brand-orange" />
            <div aria-hidden="true" inert={true} className="absolute -bottom-4 -right-4 h-8 w-8 border-b-2 border-r-2 border-brand-orange/50 transition-all duration-500 group-hover:-bottom-6 group-hover:-right-6 group-hover:border-brand-orange" />
            
            {/* Holographic Scanline */}
            <motion.div 
              aria-hidden="true" inert={true}
              className="absolute inset-0 z-20 bg-gradient-to-b from-transparent via-brand-orange/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none"
              animate={{ y: ["-100%", "200%"] }}
              transition={{ duration: 3, ease: "linear", repeat: Infinity }}
            />
            
            {/* Floating Badge */}
            <motion.div 
              aria-hidden="true" inert={true}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-8 top-1/4 hidden rounded-full border border-white/10 bg-white/5 px-6 py-3 backdrop-blur-md md:block pointer-events-none"
            >
              <p className="font-mono text-xs uppercase tracking-widest text-white">Est. 2026</p>
            </motion.div>

            {/* Pagination Indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-30">
              {images.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentImage ? "w-6 bg-brand-orange" : "w-1.5 bg-white/30"}`}
                />
              ))}
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
