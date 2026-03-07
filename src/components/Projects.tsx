import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "motion/react";
import React, { useState, useEffect } from "react";

const projects = [
  {
    id: 1,
    title: "Neon Genesis",
    category: "WebGL Experience",
    year: "2026",
    role: "Creative Developer",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop",
    description: "An immersive 3D journey through a cyberpunk cityscape built with Three.js and React Three Fiber. This project explores the intersection of real-time rendering and cinematic lighting.",
  },
  {
    id: 2,
    title: "Aura Flow",
    category: "Creative Coding",
    year: "2025",
    role: "Vibecoder",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop",
    description: "Generative art platform exploring fluid dynamics and particle systems in real-time. Users can interact with the simulation using their webcam and hand gestures.",
  },
  {
    id: 3,
    title: "Vibe Check",
    category: "Interactive App",
    year: "2025",
    role: "Full Stack",
    image: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=1000&auto=format&fit=crop",
    description: "A social platform for sharing moods through abstract visual representations and soundscapes. Built with Next.js, Framer Motion, and Web Audio API.",
  },
  {
    id: 4,
    title: "Dark Matter",
    category: "E-Commerce",
    year: "2024",
    role: "Frontend Lead",
    image: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=1000&auto=format&fit=crop",
    description: "High-end streetwear brand website featuring cinematic scroll animations and 3D product viewers. Awarded Site of the Day on Awwwards.",
  },
];

function ProjectCard({ project, onClick }: { project: any; onClick: () => void }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);
  const scale = useTransform(mouseYSpring, [-0.5, 0.5], [1, 1.02]);

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
        scale,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className="group relative aspect-[4/5] w-full cursor-pointer rounded-2xl bg-brand-dark p-6 transition-colors hover:bg-brand-gray"
    >
      {/* Glowing Border */}
      <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-brand-orange/0 via-brand-orange/0 to-brand-orange/0 opacity-0 blur-xl transition-all duration-700 group-hover:from-brand-orange/30 group-hover:via-brand-orange/10 group-hover:to-transparent group-hover:opacity-100" />
      <div className="absolute inset-0 rounded-2xl border border-white/5 transition-colors duration-500 group-hover:border-brand-orange/30" />

      {/* Image Container */}
      <div
        style={{ transform: "translateZ(30px)" }}
        className="relative h-3/4 w-full overflow-hidden rounded-xl bg-black"
      >
        <div className="h-full w-full transition-transform duration-700 group-hover:scale-110">
          <img
            src={project.image}
            alt={project.title}
            className="h-full w-full object-cover opacity-50 grayscale transition-[filter,opacity] duration-700 group-hover:opacity-100 group-hover:grayscale-0"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
        
        {/* Year Badge */}
        <div className="absolute right-4 top-4 rounded-full border border-white/20 bg-black/50 px-3 py-1 font-mono text-[10px] text-white backdrop-blur-md transition-colors group-hover:border-brand-orange/50 group-hover:text-brand-orange">
          {project.year}
        </div>
      </div>

      {/* Content */}
      <div
        style={{ transform: "translateZ(50px)" }}
        className="absolute bottom-6 left-6 right-6"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="h-[1px] w-6 bg-brand-orange transition-all duration-500 group-hover:w-12" />
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-brand-orange">
            {project.category}
          </p>
        </div>
        <h3 className="font-display text-3xl font-bold text-white md:text-4xl">
          <span className="inline-block transition-transform duration-500 group-hover:translate-x-2">{project.title}</span>
        </h3>
        
        {/* Animated Description */}
        <div className="grid grid-rows-[0fr] overflow-hidden transition-all duration-500 group-hover:grid-rows-[1fr]">
          <p className="min-h-0 pt-4 font-sans text-sm text-white/60 opacity-0 transition-opacity duration-500 delay-100 group-hover:opacity-100 line-clamp-2">
            {project.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<any | null>(null);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedProject]);

  return (
    <section id="projects" className="relative w-full bg-brand-black py-32 md:py-48">
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
              Portfolio
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
              <ProjectCard project={project} onClick={() => setSelectedProject(project)} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-black/95 p-4 md:p-12"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl bg-brand-dark border border-white/10 shadow-2xl md:flex-row"
            >
              {/* Close Button */}
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: 0.1 }}
                onClick={() => setSelectedProject(null)}
                className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition-all hover:bg-brand-orange hover:rotate-90 md:right-6 md:top-6 md:h-12 md:w-12"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </motion.button>

              {/* Image Section */}
              <div className="relative h-64 w-full overflow-hidden md:h-auto md:w-1/2">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent md:bg-gradient-to-r pointer-events-none" />
              </div>

              {/* Content Section */}
              <div className="flex w-full flex-col justify-center overflow-y-auto p-6 md:w-1/2 md:p-16">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
                >
                  <div className="mb-4 flex items-center gap-4 md:mb-6">
                    <p className="font-mono text-xs uppercase tracking-widest text-brand-orange">
                      {selectedProject.category}
                    </p>
                    <span className="h-1 w-1 rounded-full bg-white/30" />
                    <p className="font-mono text-xs text-white/50">{selectedProject.year}</p>
                  </div>
                  
                  <h3 className="mb-6 font-display text-3xl font-bold text-white md:mb-8 md:text-6xl">
                    {selectedProject.title}
                  </h3>
                  
                  <div className="mb-6 h-[1px] w-full bg-white/10 md:mb-8" />
                  
                  <div className="mb-6 grid grid-cols-2 gap-4 md:mb-8 md:gap-8">
                    <div>
                      <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-white/40 md:mb-2">Role</p>
                      <p className="font-sans text-sm text-white">{selectedProject.role}</p>
                    </div>
                    <div>
                      <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-white/40 md:mb-2">Tech Stack</p>
                      <p className="font-sans text-sm text-white">React, Three.js, GSAP</p>
                    </div>
                  </div>

                  <p className="mb-8 font-sans text-base leading-relaxed text-white/70 md:mb-12 md:text-lg">
                    {selectedProject.description}
                    <br className="hidden md:block" /><br className="hidden md:block" />
                    <span className="hidden md:inline">This project showcases advanced techniques in creative coding, focusing on performance, aesthetics, and user interaction to deliver a memorable digital experience.</span>
                  </p>
                  
                  <a href="#" className="group relative inline-flex w-full items-center justify-center overflow-hidden rounded-full border border-white/20 bg-transparent px-8 py-4 font-mono text-sm uppercase tracking-widest text-white transition-all hover:border-brand-orange md:w-max">
                    <span className="relative z-10 transition-colors group-hover:text-black">View Live Site</span>
                    <div className="absolute inset-0 -z-0 h-full w-full translate-y-full bg-brand-orange transition-transform duration-500 ease-[0.16,1,0.3,1] group-hover:translate-y-0" />
                  </a>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
