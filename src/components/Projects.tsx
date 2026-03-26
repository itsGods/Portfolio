import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "motion/react";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStructuredData } from "../hooks/useStructuredData";
import { projects, Project } from "../data/projects";

function ProjectCard({ project, onClick }: { project: Project; onClick: () => void }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);
  const scale = useTransform(mouseYSpring, [-0.5, 0.5], [1, 1.02]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.innerWidth < 768) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    if (window.innerWidth < 768) return;
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={{
        rotateX,
        rotateY,
        scale,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className="group relative flex w-full flex-col gap-6 cursor-pointer rounded-2xl bg-brand-dark p-6 transition-colors md:hover:bg-brand-gray [-webkit-tap-highlight-color:transparent]"
    >
      {/* Glowing Border */}
      <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-brand-orange/0 via-brand-orange/0 to-brand-orange/0 opacity-0 blur-xl transition-all duration-700 md:group-hover:from-brand-orange/30 md:group-hover:via-brand-orange/10 md:group-hover:to-transparent md:group-hover:opacity-100" />
      <div className="absolute inset-0 rounded-2xl border border-white/5 transition-colors duration-500 md:group-hover:border-brand-orange/30" />

      {/* Image Container */}
      <div
        style={{ transform: "translateZ(30px)" }}
        className="relative aspect-[2/1] w-full overflow-hidden rounded-xl bg-black"
      >
        <div className="h-full w-full transition-transform duration-700 md:group-hover:scale-110">
          <picture className="block h-full w-full">
            <img
              src={project.image}
              alt={`${project.title} - ${project.category} Project`}
              width="800"
              height="400"
              className="h-full w-full object-cover opacity-50 grayscale transition-[filter,opacity] duration-700 md:group-hover:opacity-100 md:group-hover:grayscale-0"
              referrerPolicy="no-referrer"
              loading="lazy"
              decoding="async"
            />
          </picture>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
        
        {/* Year Badge */}
        <div className="absolute right-4 top-4 rounded-full border border-white/20 bg-black/50 px-3 py-1 font-mono text-[10px] text-white backdrop-blur-md transition-colors md:group-hover:border-brand-orange/50 md:group-hover:text-brand-orange">
          {project.year}
        </div>
      </div>

      {/* Content */}
      <div
        style={{ transform: "translateZ(50px)" }}
        className="flex flex-col"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="h-[1px] w-6 bg-brand-orange transition-all duration-500 md:group-hover:w-12" />
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-brand-orange">
            {project.category}
          </p>
        </div>
        <h3 className="font-display text-3xl font-bold text-white md:text-4xl">
          <span className="inline-block transition-transform duration-500 md:group-hover:translate-x-2">{project.title}</span>
        </h3>
        
        {/* Animated Description */}
        <div className="grid grid-rows-[0fr] overflow-hidden transition-all duration-500 md:group-hover:grid-rows-[1fr]">
          <p className="min-h-0 pt-4 font-sans text-sm text-white/60 opacity-0 transition-opacity duration-500 delay-100 md:group-hover:opacity-100 line-clamp-2">
            {project.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const navigate = useNavigate();

  useStructuredData({
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": projects.map((p, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "item": {
        "@type": "CreativeWork",
        "name": p.title,
        "description": p.description,
        "image": p.image,
        "url": p.link !== "#" ? p.link : "https://tghabib.com/#projects"
      }
    }))
  });

  return (
    <section id="projects" className="relative w-full bg-brand-dark py-32 md:py-48">
      {/* Background Grid */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_20%,transparent_100%)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-24 flex flex-col items-start justify-between gap-8 md:flex-row md:items-end"
        >
          <div>
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-brand-orange">
              PORTFOLIO // 03
            </p>
            <h2 className="font-serif text-5xl italic text-white md:text-7xl">
              Selected <span className="font-display not-italic font-bold text-brand-orange">Works</span>
            </h2>
          </div>
          <p className="max-w-xs font-sans text-sm text-white/50">
            A curated collection of digital experiences, blending creative coding with cinematic design.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:gap-16">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 1, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={i % 2 !== 0 ? "md:mt-32" : ""}
            >
              <ProjectCard project={project} onClick={() => navigate(`/project/${project.slug}`)} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
