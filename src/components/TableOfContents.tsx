import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight, List, Sparkles } from "lucide-react";
import GithubSlugger from "github-slugger";

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

export default function TableOfContents({ content }: TableOfContentsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>("");
  const [toc, setToc] = useState<TOCItem[]>([]);

  useEffect(() => {
    const slugger = new GithubSlugger();
    const headings: TOCItem[] = [];
    
    // Extract headings from markdown (## and ###)
    const lines = content.split('\n');
    let isCodeBlock = false;

    lines.forEach(line => {
      if (line.startsWith('```')) {
        isCodeBlock = !isCodeBlock;
      }
      
      if (!isCodeBlock) {
        const match = line.match(/^(#{2,3})\s+(.+)$/);
        if (match) {
          const level = match[1].length;
          const text = match[2].replace(/[\[\]*`_]/g, ''); // Basic markdown cleanup
          const id = slugger.slug(text);
          headings.push({ id, text, level });
        }
      }
    });

    setToc(headings);
  }, [content]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "0px 0px -80% 0px" }
    );

    toc.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [toc]);

  if (toc.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 md:top-32 md:bottom-auto md:right-12">
      <motion.div
        initial={false}
        animate={isOpen ? "open" : "closed"}
        className="relative flex flex-col items-end"
      >
        <AnimatePresence>
          {isOpen && (
            <motion.nav
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="mb-4 w-72 md:w-80 overflow-hidden rounded-2xl border border-white/10 bg-brand-dark/80 backdrop-blur-xl shadow-2xl"
              aria-label="Table of Contents"
            >
              <div className="flex items-center gap-2 border-b border-white/10 bg-white/5 px-5 py-4">
                <Sparkles className="h-4 w-4 text-brand-orange" />
                <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-white">
                  AI Contents
                </h3>
              </div>
              <ul className="max-h-[60vh] overflow-y-auto p-3 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
                {toc.map((item) => (
                  <li
                    key={item.id}
                    style={{ paddingLeft: `${(item.level - 2) * 1}rem` }}
                  >
                    <a
                      href={`#${item.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        const element = document.getElementById(item.id);
                        if (element) {
                          element.scrollIntoView({ behavior: "smooth" });
                          setActiveId(item.id);
                          // Optional: close on mobile after clicking
                          if (window.innerWidth < 768) setIsOpen(false);
                        }
                      }}
                      className={`group flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                        activeId === item.id
                          ? "bg-brand-orange/10 text-brand-orange"
                          : "text-white/60 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <ChevronRight
                        className={`h-3 w-3 transition-transform ${
                          activeId === item.id ? "translate-x-1 text-brand-orange" : "opacity-0 group-hover:opacity-100"
                        }`}
                      />
                      <span className="line-clamp-2">{item.text}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </motion.nav>
          )}
        </AnimatePresence>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-brand-dark/80 text-white backdrop-blur-xl transition-all hover:bg-brand-orange hover:border-brand-orange shadow-lg"
          aria-label="Toggle Table of Contents"
        >
          <List className="h-5 w-5 transition-transform group-hover:scale-110" />
        </button>
      </motion.div>
    </div>
  );
}
