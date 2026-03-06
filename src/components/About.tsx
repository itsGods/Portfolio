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

  const text = "I am a Vibecoder & Creative Developer, blending code with cinematic aesthetics to build immersive digital experiences.";
  const words = text.split(" ");

  return (
    <section id="about" ref={containerRef} className="relative w-full bg-brand-black py-32 md:py-48">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-16 px-6 md:flex-row md:px-12">
        
        {/* Left: Kinetic Typography */}
        <motion.div style={{ y: y1 }} className="flex-1 md:pr-12">
          <h2 className="mb-8 font-mono text-xs uppercase tracking-[0.3em] text-brand-orange">
            About Habib
          </h2>
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
                  <span className="font-display font-bold italic text-brand-orange">{word}</span>
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
            className="mt-12 max-w-md font-sans text-lg text-white/60"
          >
            <p className="mb-6">
              My work lives at the intersection of design, motion, and engineering. I don't just write code; I craft vibes.
            </p>
            <a href="#contact" className="group inline-flex items-center gap-4 font-mono text-sm uppercase tracking-widest text-white transition-colors hover:text-brand-orange">
              Let's Talk
              <span className="block h-[1px] w-12 bg-white transition-all group-hover:w-16 group-hover:bg-brand-orange" />
            </a>
          </motion.div>
        </motion.div>

        {/* Right: Floating Image */}
        <motion.div style={{ y: y2 }} className="relative flex-1">
          <div className="relative aspect-[3/4] w-full max-w-md overflow-hidden rounded-2xl bg-brand-dark">
            <motion.div
              initial={{ scale: 1.1, filter: "blur(10px)" }}
              whileInView={{ scale: 1, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="h-full w-full"
            >
              <img
                src="https://raw.githubusercontent.com/itsGods/Personal/refs/heads/main/file_0000000038e47208a7c7e84e80a5026d.png"
                alt="Habib - Slowly but Surely"
                className="h-full w-full object-cover opacity-80 grayscale transition-all duration-700 hover:opacity-100 hover:grayscale-0"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            
            {/* Decorative Elements */}
            <div className="absolute -left-4 -top-4 h-24 w-24 border-l border-t border-brand-orange/50" />
            <div className="absolute -bottom-4 -right-4 h-24 w-24 border-b border-r border-brand-orange/50" />
          </div>
        </motion.div>

      </div>
    </section>
  );
}
