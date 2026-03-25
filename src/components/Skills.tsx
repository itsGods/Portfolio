import { motion, useInView } from "motion/react";
import React, { useRef, useState } from "react";

const skills = [
  { name: "Creative Coding", level: 95, color: "#FF5A00" },
  { name: "WebGL / Three.js", level: 85, color: "#FF5A00" },
  { name: "React / Next.js", level: 90, color: "#FF5A00" },
  { name: "Motion Design", level: 80, color: "#FF5A00" },
  { name: "UI/UX Architecture", level: 88, color: "#FF5A00" },
];

const SkillBar: React.FC<{ skill: any; index: number }> = ({ skill, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      ref={ref}
      className="group relative mb-8 w-full cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="mb-3 flex items-end justify-between font-mono text-sm uppercase tracking-widest text-white">
        <div className="flex items-center gap-4">
          <span className="text-[10px] text-white/30">0{index + 1}</span>
          <span className="transition-colors duration-300 group-hover:text-brand-orange">
            {skill.name}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-brand-orange">{skill.level}</span>
          <span className="text-[10px] text-white/30">PCT</span>
        </div>
      </div>
      
      <div className="relative h-[1px] w-full overflow-hidden bg-white/10">
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: `${skill.level}%` } : { width: 0 }}
          transition={{ duration: 1.5, delay: index * 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute left-0 top-0 h-full bg-brand-orange shadow-[0_0_15px_#FF5A00]"
        />
        {/* Animated dot at the end of the progress bar */}
        <motion.div
          initial={{ left: 0, opacity: 0 }}
          animate={isInView ? { left: `calc(${skill.level}% - 4px)`, opacity: 1 } : { left: 0, opacity: 0 }}
          transition={{ duration: 1.5, delay: index * 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-1/2 h-2 w-2 -translate-y-1/2 bg-white shadow-[0_0_10px_#fff]"
          style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }} // Diamond shape
        />
      </div>

      {/* Grid background on hover */}
      <div className="absolute inset-0 -z-10 -m-4 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:1rem_1rem] opacity-0 transition-opacity duration-500 group-hover:opacity-100 [mask-image:radial-gradient(ellipse_at_center,#000_20%,transparent_70%)]" />
    </div>
  );
}

export default function Skills() {
  return (
    <section id="skills" className="relative w-full bg-brand-dark py-32 md:py-48 overflow-hidden">
      {/* Tech Grid Background */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute left-[10%] top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-white/20 to-transparent" />
        <div className="absolute left-[90%] top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-white/20 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center justify-between gap-24 px-6 md:flex-row md:px-12">
        
        {/* Left: Text */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 md:pr-12"
        >
          <div className="mb-8 flex items-center gap-4">
            <div className="h-[1px] w-8 bg-brand-orange" />
            <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-brand-orange">
              EXPERTISE // 05
            </h2>
          </div>

          <h2 className="mb-8 font-serif text-5xl italic text-white md:text-7xl">
            Digital <br />
            <span className="font-display not-italic font-bold text-brand-orange relative">
              Arsenal
              <svg className="absolute -bottom-4 left-0 w-full" height="8" viewBox="0 0 100 8" preserveAspectRatio="none">
                <path d="M0,7 L100,7" stroke="rgba(255,90,0,0.3)" strokeWidth="1" strokeDasharray="4 4" fill="none" />
                <rect x="0" y="5" width="4" height="4" fill="#FF5A00" />
                <rect x="96" y="5" width="4" height="4" fill="#FF5A00" />
              </svg>
            </span>
          </h2>
          <p className="max-w-md font-sans text-lg leading-relaxed text-white/60">
            Mastering the tools of the trade to build experiences that blur the line between art and technology. My stack is focused on performance, aesthetics, and seamless interaction.
          </p>

          {/* Decorative Tech Circle */}
          <div className="mt-16 hidden h-32 w-32 items-center justify-center rounded-full border border-white/10 relative md:flex">
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border border-dashed border-brand-orange/30"
            />
            <motion.div 
              animate={{ rotate: -360 }} 
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute inset-2 rounded-full border border-white/5"
            />
            <span className="font-mono text-[10px] text-brand-orange animate-pulse">SYS.RDY</span>
          </div>
        </motion.div>

        {/* Right: Skills Visualization */}
        <div className="w-full flex-1 md:w-auto relative p-8 bg-black/20 border border-white/5 backdrop-blur-sm rounded-xl">
          {/* HUD Brackets */}
          <div className="absolute -left-2 -top-2 h-8 w-8 border-l-2 border-t-2 border-brand-orange/50" />
          <div className="absolute -right-2 -top-2 h-8 w-8 border-r-2 border-t-2 border-brand-orange/50" />
          <div className="absolute -bottom-2 -left-2 h-8 w-8 border-b-2 border-l-2 border-brand-orange/50" />
          <div className="absolute -bottom-2 -right-2 h-8 w-8 border-b-2 border-r-2 border-brand-orange/50" />
          
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-dark px-4 font-mono text-[10px] text-brand-orange tracking-widest">
            DIAGNOSTICS
          </div>
          
          <div className="relative z-10">
            {skills.map((skill, i) => (
              <SkillBar key={skill.name} skill={skill} index={i} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
