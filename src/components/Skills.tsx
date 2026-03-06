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
      <div className="mb-2 flex items-center justify-between font-mono text-sm uppercase tracking-widest text-white">
        <span className="transition-colors duration-300 group-hover:text-brand-orange">
          {skill.name}
        </span>
        <span className="text-white/50">{skill.level}%</span>
      </div>
      
      <div className="relative h-[2px] w-full overflow-hidden rounded-full bg-white/10">
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: `${skill.level}%` } : { width: 0 }}
          transition={{ duration: 1.5, delay: index * 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute left-0 top-0 h-full bg-brand-orange shadow-[0_0_10px_#FF5A00]"
        />
      </div>

      {/* Particle Burst on Hover */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          className="absolute -right-4 -top-4 h-8 w-8 rounded-full bg-brand-orange/20 blur-md mix-blend-screen"
        />
      )}
    </div>
  );
}

export default function Skills() {
  return (
    <section id="skills" className="relative w-full bg-brand-dark py-32 md:py-48">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-16 px-6 md:flex-row md:px-12">
        
        {/* Left: Text */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 md:pr-12"
        >
          <h2 className="mb-6 font-serif text-5xl italic text-white md:text-7xl">
            Digital <br />
            <span className="font-display not-italic font-bold text-brand-orange">Arsenal</span>
          </h2>
          <p className="max-w-md font-sans text-lg text-white/60">
            Mastering the tools of the trade to build experiences that blur the line between art and technology. My stack is focused on performance, aesthetics, and seamless interaction.
          </p>
        </motion.div>

        {/* Right: Skills Visualization */}
        <div className="w-full flex-1 md:w-auto">
          {skills.map((skill, i) => (
            <SkillBar key={skill.name} skill={skill} index={i} />
          ))}
        </div>

      </div>
    </section>
  );
}
