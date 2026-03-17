import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "motion/react";
import React, { useState, useEffect } from "react";

import { useStructuredData } from "../hooks/useStructuredData";

const projects = [
  {
    id: 1,
    title: "Solo Dev",
    category: "Full Stack Blog",
    year: "2026",
    role: "Vibecoder",
    image: "https://res.cloudinary.com/djo33javr/image/upload/v1773247850/Google_play_store_feature_graphic_1024x500_for_a_d_delpmaspu_3_t8i8em.jpg",
    landscapeImage: "https://res.cloudinary.com/djo33javr/image/upload/v1773247850/Google_play_store_feature_graphic_1024x500_for_a_d_delpmaspu_2_hri9am.jpg",
    description: "A full-stack personal blog site made with Vibe coding. It features a complete backend powered by Supabase for managing posts and content.",
    techStack: "React, Supabase, Tailwind",
    link: "https://habibul.online"
  },
  {
    id: 2,
    title: "Bio Link",
    category: "Linktree Clone",
    year: "2026",
    role: "Vibecoder",
    image: "https://res.cloudinary.com/djo33javr/image/upload/v1773247852/Create_a_google_play_store_feature_graphic_1024x50_delpmaspu_ttvbcd.jpg",
    landscapeImage: "https://res.cloudinary.com/djo33javr/image/upload/v1773247850/Create_a_google_play_store_feature_graphic_1024x50_delpmaspu_1_sg99pr.jpg",
    description: "A completely free and easy-to-use full-stack Linktree clone. Built entirely with Vibe coding, allowing users to create and manage their personalized bio links seamlessly.",
    techStack: "React, Node.js, Tailwind",
    link: "https://biolink.us.cc"
  },
  {
    id: 3,
    title: "Atpukur Boys",
    category: "Messaging App",
    year: "2026",
    role: "Full Stack",
    image: "https://raw.githubusercontent.com/itsGods/Blog-asset/refs/heads/main/file_0000000040ac720b9327bdd5ddd9ae92.png",
    landscapeImage: "https://res.cloudinary.com/djo33javr/image/upload/v1773247849/Create_an_image_play_store_feature_graphic_1024x50_delpmaspu_uogfy8.jpg",
    description: "A full-stack messaging app with powerful admin controls. It features end-to-end encryption and group messaging, built exclusively for the Atpukur gang.",
    techStack: "React, Node.js, WebSockets",
    link: "https://atpukurboys.qzz.io/"
  },
  {
    id: 4,
    title: "Neon Genesis",
    category: "WebGL Experience",
    year: "2026",
    role: "Creative Developer",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop",
    description: "An immersive 3D journey through a cyberpunk cityscape built with Three.js and React Three Fiber. This project explores the intersection of real-time rendering and cinematic lighting.",
    techStack: "React, Three.js, GSAP",
    link: "#"
  },
  {
    id: 5,
    title: "Aura Flow",
    category: "Creative Coding",
    year: "2025",
    role: "Vibecoder",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop",
    description: "Generative art platform exploring fluid dynamics and particle systems in real-time. Users can interact with the simulation using their webcam and hand gestures.",
    techStack: "WebGL, GLSL, React",
    link: "#"
  },
  {
    id: 6,
    title: "Vibe Check",
    category: "Interactive App",
    year: "2025",
    role: "Full Stack",
    image: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=1000&auto=format&fit=crop",
    description: "A social platform for sharing moods through abstract visual representations and soundscapes. Built with Next.js, Framer Motion, and Web Audio API.",
    techStack: "Next.js, Framer Motion, Web Audio",
    link: "#"
  },
  {
    id: 7,
    title: "Dark Matter",
    category: "E-Commerce",
    year: "2024",
    role: "Frontend Lead",
    image: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=1000&auto=format&fit=crop",
    description: "High-end streetwear brand website featuring cinematic scroll animations and 3D product viewers. Awarded Site of the Day on Awwwards.",
    techStack: "React, Three.js, Tailwind",
    link: "#"
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
  const [selectedProject, setSelectedProject] = useState<any | null>(null);

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

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (selectedProject) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      window.dispatchEvent(new Event('stop-lenis'));
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      window.dispatchEvent(new Event('start-lenis'));
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      window.dispatchEvent(new Event('start-lenis'));
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
              className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-brand-dark border border-white/10 shadow-2xl"
            >
              {/* Close Button */}
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: 0.1 }}
                onClick={() => setSelectedProject(null)}
                aria-label="Close project details"
                className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition-all hover:bg-brand-orange hover:rotate-90 md:right-6 md:top-6 md:h-12 md:w-12 [-webkit-tap-highlight-color:transparent]"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </motion.button>

              {/* Image Section */}
              <div className="relative aspect-[2/1] w-full shrink-0 overflow-hidden bg-black">
                <picture className="block h-full w-full">
                  <img
                    src={selectedProject.image}
                    alt={`${selectedProject.title} - ${selectedProject.category} Project Details`}
                    width="1200"
                    height="600"
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                    loading="eager"
                  />
                </picture>
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Content Section */}
              <div className="flex w-full flex-col overflow-y-auto p-6 md:p-12">
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
                      <p className="font-sans text-sm text-white">{selectedProject.techStack || "React, Three.js, GSAP"}</p>
                    </div>
                  </div>

                  <p className="mb-8 font-sans text-base leading-relaxed text-white/70 md:mb-12 md:text-lg">
                    {selectedProject.description}
                    <br className="hidden md:block" /><br className="hidden md:block" />
                    <span className="hidden md:inline">This project showcases advanced techniques in creative coding, focusing on performance, aesthetics, and user interaction to deliver a memorable digital experience.</span>
                  </p>
                  
                  <a 
                    href={selectedProject.link || "#"} 
                    onClick={(e) => {
                      if (!selectedProject.link || selectedProject.link === "#") {
                        e.preventDefault();
                      }
                    }}
                    aria-label={`View live site for ${selectedProject.title}`} 
                    target={selectedProject.link && selectedProject.link !== "#" ? "_blank" : "_self"} 
                    rel="noopener noreferrer" 
                    className="group relative inline-flex w-full items-center justify-center overflow-hidden rounded-full border border-white/20 bg-transparent px-8 py-4 font-mono text-sm uppercase tracking-widest text-white transition-all hover:border-brand-orange md:w-max [-webkit-tap-highlight-color:transparent]"
                  >
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
