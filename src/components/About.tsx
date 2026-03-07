import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-5, 5]);

  const text = "I am a Vibecoder & Creative Developer, blending code with cinematic aesthetics to build immersive digital experiences.";
  const words = text.split(" ");

  return (
    <section id="about" ref={containerRef} className="relative w-full bg-brand-black py-32 md:py-48 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[50vh] w-[50vw] rounded-full bg-brand-orange/5 blur-[120px] pointer-events-none" />
      
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center justify-between gap-24 px-6 md:flex-row md:px-12">
        
        {/* Left: Kinetic Typography */}
        <motion.div style={{ y: y1 }} className="flex-1 md:pr-12">
          <div className="mb-8 flex items-center gap-4">
            <div className="h-[1px] w-8 bg-brand-orange" />
            <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-brand-orange">
              About Habib
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
                {word === "Vibecoder" || word === "Creative" || word === "Developer," ? (
                  <span className="font-display font-bold italic text-brand-orange relative">
                    {word}
                    <span className="absolute -bottom-2 left-0 h-[2px] w-full bg-brand-orange/30" />
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
              My work lives at the intersection of design, motion, and engineering. I don't just write code; I craft vibes. Every pixel is intentional, every animation is choreographed.
            </p>
            <a href="#contact" className="group flex w-max items-center gap-4 font-mono text-sm uppercase tracking-widest text-white transition-colors hover:text-brand-orange">
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
          <div className="group relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-brand-dark">
            <motion.div
              initial={{ scale: 1.2, filter: "blur(20px)" }}
              whileInView={{ scale: 1, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="h-full w-full"
            >
              <img
                src="https://raw.githubusercontent.com/itsGods/Personal/refs/heads/main/file_0000000038e47208a7c7e84e80a5026d.png"
                alt="Habib - Slowly but Surely"
                className="h-full w-full object-cover opacity-60 grayscale transition-all duration-1000 group-hover:scale-110 group-hover:opacity-100 group-hover:grayscale-0"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-black/80 via-transparent to-transparent" />
            </motion.div>
            
            {/* Decorative Elements */}
            <div className="absolute -left-4 -top-4 h-32 w-32 border-l-2 border-t-2 border-brand-orange/30 transition-all duration-500 group-hover:-left-6 group-hover:-top-6 group-hover:border-brand-orange" />
            <div className="absolute -bottom-4 -right-4 h-32 w-32 border-b-2 border-r-2 border-brand-orange/30 transition-all duration-500 group-hover:-bottom-6 group-hover:-right-6 group-hover:border-brand-orange" />
            
            {/* Floating Badge */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-8 top-1/4 hidden rounded-full border border-white/10 bg-white/5 px-6 py-3 backdrop-blur-md md:block"
            >
              <p className="font-mono text-xs uppercase tracking-widest text-white">Est. 2026</p>
            </motion.div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
