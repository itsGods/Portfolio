import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const navItems = ["Home", "Projects", "About", "Skills", "Contact", "Blog"];

export default function Navbar() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [isTop, setIsTop] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isBlogSubdomain = window.location.hostname.startsWith('blog.');
  const isPortfolioHome = location.pathname === "/" && !isBlogSubdomain;

  const getHref = (item: string) => {
    if (item === "Blog") {
      return isBlogSubdomain ? "/" : "/blog";
    }
    if (isBlogSubdomain) {
      return item === "Home" ? "https://tghabib.com/" : `https://tghabib.com/#${item.toLowerCase()}`;
    }
    return isPortfolioHome ? `#${item.toLowerCase()}` : `/#${item.toLowerCase()}`;
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.dispatchEvent(new Event('stop-lenis'));
    } else {
      document.body.style.overflow = "";
      window.dispatchEvent(new Event('start-lenis'));
    }
    return () => {
      document.body.style.overflow = "";
      window.dispatchEvent(new Event('start-lenis'));
    };
  }, [isOpen]);

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
            <Link to="/">TG HABIB<span className="text-brand-orange">.</span></Link>
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
              {navItems.map((item, i) => {
                const isBlog = item === "Blog";
                const href = getHref(item);
                const isExternal = isBlogSubdomain && !isBlog;
                
                return (
                  <li key={item} className="relative group">
                    {isBlog ? (
                      <Link
                        to={href}
                        aria-label={`Go to ${item} page`}
                        className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/70 transition-colors hover:text-white"
                      >
                        {item}
                      </Link>
                    ) : (
                      <a
                        href={href}
                        aria-label={`Jump to ${item} section`}
                        className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/70 transition-colors hover:text-white"
                      >
                        {item}
                      </a>
                    )}
                    <span className="absolute -bottom-2 left-1/2 h-[2px] w-0 -translate-x-1/2 bg-brand-orange transition-all duration-300 group-hover:w-full" />
                  </li>
                );
              })}
            </ul>
          </motion.div>

          {/* Mobile Toggle */}
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            className="md:hidden text-white relative z-50 flex h-12 w-12 flex-col items-center justify-center gap-[6px]"
          >
            <motion.span
              animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="h-[2px] w-6 bg-white block origin-center rounded-full"
            />
            <motion.span
              animate={isOpen ? { opacity: 0, scale: 0.5 } : { opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="h-[2px] w-6 bg-white block origin-center rounded-full"
            />
            <motion.span
              animate={isOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="h-[2px] w-6 bg-white block origin-center rounded-full"
            />
          </motion.button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { delay: 0.4, duration: 0.5, ease: [0.22, 1, 0.36, 1] } }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-brand-black/95 backdrop-blur-xl md:hidden"
          >
            {/* Cinematic Background Elements */}
            <div className="absolute left-0 top-1/4 h-[40vh] w-[40vw] rounded-full bg-brand-orange/10 blur-[100px]" />
            <div className="absolute right-0 bottom-1/4 h-[40vh] w-[40vw] rounded-full bg-brand-orange/5 blur-[100px]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:2rem_2rem]" />

            <ul className="relative z-10 flex flex-col items-center gap-8">
              {navItems.map((item, i) => {
                const isBlog = item === "Blog";
                const href = getHref(item);
                const isExternal = isBlogSubdomain && !isBlog;

                return (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, y: 40, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ 
                      opacity: 0, 
                      y: 20, 
                      scale: 0.9,
                      transition: { duration: 0.4, delay: (navItems.length - 1 - i) * 0.04, ease: [0.22, 1, 0.36, 1] }
                    }}
                    transition={{ duration: 0.6, delay: 0.1 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {isBlog ? (
                      <Link
                        to={href}
                        onClick={() => setIsOpen(false)}
                        aria-label={`Go to ${item} page`}
                        className="group relative flex items-center gap-4 font-display text-5xl font-bold tracking-tighter text-white transition-colors hover:text-brand-orange"
                      >
                        <span className="font-mono text-sm text-brand-orange/50 transition-colors group-hover:text-brand-orange">0{i + 1}</span>
                        {item}
                      </Link>
                    ) : (
                      <a
                        href={href}
                        onClick={() => setIsOpen(false)}
                        aria-label={`Jump to ${item} section`}
                        className="group relative flex items-center gap-4 font-display text-5xl font-bold tracking-tighter text-white transition-colors hover:text-brand-orange"
                      >
                        <span className="font-mono text-sm text-brand-orange/50 transition-colors group-hover:text-brand-orange">0{i + 1}</span>
                        {item}
                      </a>
                    )}
                  </motion.li>
                );
              })}
            </ul>

            {/* Mobile Menu Footer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ 
                opacity: 0, 
                y: 10,
                transition: { duration: 0.4, delay: 0, ease: [0.22, 1, 0.36, 1] }
              }}
              transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
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
