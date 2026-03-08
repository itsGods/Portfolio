import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "motion/react";
import { useState } from "react";

const navItems = ["Home", "Projects", "About", "Skills", "Contact"];

export default function Navbar() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [isTop, setIsTop] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
    setIsTop(latest < 50);
  });

  return (
    <>
      <motion.nav
        variants={{
          visible: { y: 0, opacity: 1 },
          hidden: { y: "-100%", opacity: 0 },
        }}
        animate={hidden && !isOpen ? "hidden" : "visible"}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 z-50 w-full transition-[padding,background-color,border-color,backdrop-filter] duration-500 ${
          isTop || isOpen ? "py-8" : "py-4"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 md:px-12">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="group relative z-50 flex items-center gap-2 font-display text-xl font-bold tracking-tighter text-white"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black transition-transform duration-500 group-hover:rotate-90">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <line x1="12" y1="5" x2="12" y2="19"></line>
              </svg>
            </div>
            HABIB<span className="text-brand-orange">.</span>
          </motion.div>

          {/* Desktop Nav (Glass Pill) */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className={`hidden items-center rounded-full border border-white/10 bg-white/5 px-6 py-3 backdrop-blur-md transition-all duration-500 md:flex ${
              isTop ? "bg-transparent border-transparent" : "shadow-[0_0_30px_rgba(0,0,0,0.5)]"
            }`}
          >
            <ul className="flex items-center gap-8">
              {navItems.map((item, i) => (
                <li key={item} className="relative group">
                  <a
                    href={`#${item.toLowerCase()}`}
                    className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/70 transition-colors hover:text-white"
                  >
                    {item}
                  </a>
                  <span className="absolute -bottom-2 left-1/2 h-[2px] w-0 -translate-x-1/2 bg-brand-orange transition-all duration-300 group-hover:w-full" />
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Mobile Toggle */}
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white relative z-50 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-md"
          >
            <motion.svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <motion.line
                x1="4" x2="20" y1="6" y2="6"
                animate={isOpen ? { x1: 6, x2: 18, y1: 6, y2: 18 } : { x1: 4, x2: 20, y1: 6, y2: 6 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              />
              <motion.line
                x1="4" x2="20" y1="12" y2="12"
                animate={isOpen ? { opacity: 0, scale: 0 } : { opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformOrigin: "center" }}
              />
              <motion.line
                x1="4" x2="20" y1="18" y2="18"
                animate={isOpen ? { x1: 6, x2: 18, y1: 18, y2: 6 } : { x1: 4, x2: 20, y1: 18, y2: 18 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              />
            </motion.svg>
          </motion.button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: "circle(0% at 100% 0)" }}
            animate={{ opacity: 1, clipPath: "circle(150% at 100% 0)" }}
            exit={{ opacity: 0, clipPath: "circle(0% at 100% 0)" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-brand-black/98 md:hidden"
          >
            {/* Cinematic Background Elements */}
            <div className="absolute left-0 top-1/4 h-[40vh] w-[40vw] rounded-full bg-brand-orange/10 blur-[100px]" />
            <div className="absolute right-0 bottom-1/4 h-[40vh] w-[40vw] rounded-full bg-brand-orange/5 blur-[100px]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:2rem_2rem]" />

            <ul className="relative z-10 flex flex-col items-center gap-8">
              {navItems.map((item, i) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <a
                    href={`#${item.toLowerCase()}`}
                    onClick={() => setIsOpen(false)}
                    className="group relative flex items-center gap-4 font-display text-5xl font-bold tracking-tighter text-white transition-colors hover:text-brand-orange"
                  >
                    <span className="font-mono text-sm text-brand-orange/50 transition-colors group-hover:text-brand-orange">0{i + 1}</span>
                    {item}
                  </a>
                </motion.li>
              ))}
            </ul>

            {/* Mobile Menu Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="absolute bottom-12 flex flex-col items-center gap-4 text-center"
            >
              <div className="h-[1px] w-12 bg-white/20" />
              <p className="font-mono text-[10px] uppercase tracking-widest text-white/40">
                SYS.ONLINE // {new Date().getFullYear()}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
