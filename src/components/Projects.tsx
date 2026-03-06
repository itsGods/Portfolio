import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import React, { useState } from "react";

const projects = [
  {
    id: 1,
    title: "Neon Genesis",
    category: "WebGL Experience",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop",
    description: "An immersive 3D journey through a cyberpunk cityscape built with Three.js and React Three Fiber.",
  },
  {
    id: 2,
    title: "Aura Flow",
    category: "Creative Coding",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop",
    description: "Generative art platform exploring fluid dynamics and particle systems in real-time.",
  },
  {
    id: 3,
    title: "Vibe Check",
    category: "Interactive App",
    image: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=1000&auto=format&fit=crop",
    description: "A social platform for sharing moods through abstract visual representations and soundscapes.",
  },
  {
    id: 4,
    title: "Dark Matter",
    category: "E-Commerce",
    image: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=1000&auto=format&fit=crop",
    description: "High-end streetwear brand website featuring cinematic scroll animations and 3D product viewers.",
  },
];

function ProjectCard({ project, onClick }: { project: any; onClick: () => void }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
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
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className="group relative aspect-[4/5] w-full cursor-pointer rounded-2xl bg-brand-dark p-6 transition-colors hover:bg-brand-gray"
    >
      {/* Glowing Border */}
      <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-brand-orange/0 via-brand-orange/0 to-brand-orange/0 opacity-0 blur-xl transition-all duration-500 group-hover:from-brand-orange/20 group-hover:via-brand-orange/10 group-hover:to-transparent group-hover:opacity-100" />
      <div className="absolute inset-0 rounded-2xl border border-white/5 transition-colors duration-500 group-hover:border-brand-orange/50" />

      {/* Image Container */}
      <div
        style={{ transform: "translateZ(50px)" }}
        className="relative h-3/4 w-full overflow-hidden rounded-xl bg-black"
      >
        <img
          src={project.image}
          alt={project.title}
          className="h-full w-full object-cover opacity-60 grayscale transition-all duration-700 group-hover:scale-110 group-hover:opacity-100 group-hover:grayscale-0"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
      </div>

      {/* Content */}
      <div
        style={{ transform: "translateZ(75px)" }}
        className="absolute bottom-6 left-6 right-6"
      >
        <p className="mb-2 font-mono text-xs uppercase tracking-widest text-brand-orange">
          {project.category}
        </p>
        <h3 className="font-display text-2xl font-bold text-white md:text-3xl">
          {project.title}
        </h3>
        
        {/* Animated Description */}
        <div className="grid grid-rows-[0fr] overflow-hidden transition-all duration-500 group-hover:grid-rows-[1fr]">
          <p className="min-h-0 pt-4 font-sans text-sm text-white/60 opacity-0 transition-opacity duration-500 delay-100 group-hover:opacity-100">
            {project.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<any | null>(null);

  return (
    <section id="projects" className="relative w-full bg-brand-black py-32 md:py-48">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-24 text-center md:text-left"
        >
          <h2 className="font-serif text-5xl italic text-white md:text-7xl">
            Selected <span className="font-display not-italic font-bold text-brand-orange">Works</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:gap-16">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 1, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={i % 2 !== 0 ? "md:mt-24" : ""}
            >
              <ProjectCard project={project} onClick={() => setSelectedProject(project)} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Fullscreen Modal */}
      {selectedProject && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-brand-black/90 p-6 backdrop-blur-xl"
        >
          <motion.div
            initial={{ scale: 0.9, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-3xl bg-brand-dark border border-white/10"
          >
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute right-6 top-6 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition-colors hover:bg-brand-orange"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <div className="flex flex-col md:flex-row h-full">
              <div className="h-64 md:h-auto md:w-1/2">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col justify-center p-8 md:w-1/2 md:p-16">
                <p className="mb-4 font-mono text-sm uppercase tracking-widest text-brand-orange">
                  {selectedProject.category}
                </p>
                <h3 className="mb-6 font-display text-4xl font-bold text-white md:text-5xl">
                  {selectedProject.title}
                </h3>
                <p className="mb-8 font-sans text-lg text-white/70">
                  {selectedProject.description}
                  <br /><br />
                  This project showcases advanced techniques in creative coding, focusing on performance, aesthetics, and user interaction to deliver a memorable digital experience.
                </p>
                <a href="#" className="inline-flex w-max items-center gap-4 rounded-full border border-white/20 px-8 py-4 font-mono text-sm uppercase tracking-widest text-white transition-colors hover:border-brand-orange hover:bg-brand-orange">
                  View Live Site
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
