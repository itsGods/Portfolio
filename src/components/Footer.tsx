import { motion } from "motion/react";

const socials = [
  { name: "GitHub", url: "https://github.com/itsGods" },
  { name: "Email", url: "mailto:itssolodev@gmail.com" },
  { name: "Twitter", url: "#" },
  { name: "LinkedIn", url: "#" },
];

export default function Footer() {
  return (
    <footer className="relative w-full overflow-hidden bg-brand-black pt-32 pb-12 border-t border-white/5">
      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/2 h-[50vh] w-[80vw] -translate-x-1/2 translate-y-1/2 rounded-full bg-brand-orange/10 blur-[150px] pointer-events-none" />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col px-6 md:px-12">
        
        {/* Top Section: Links & Info */}
        <div className="mb-24 flex flex-col justify-between gap-12 md:flex-row md:items-end">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="h-[1px] w-8 bg-brand-orange" />
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-brand-orange">
                End of Transmission
              </span>
            </div>
            <p className="max-w-sm font-sans text-lg text-white/50">
              Crafting digital experiences that blur the line between art and technology.
            </p>
          </div>

          <ul className="flex flex-wrap items-center gap-8 md:gap-12">
            {socials.map((social, i) => (
              <motion.li
                key={social.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
              >
                <a
                  href={social.url}
                  className="group relative flex items-center gap-2 font-mono text-sm uppercase tracking-widest text-white/70 transition-colors hover:text-white"
                >
                  <span className="text-brand-orange opacity-0 transition-opacity group-hover:opacity-100">&gt;</span>
                  {social.name}
                  <span className="absolute -bottom-2 left-0 h-[1px] w-0 bg-brand-orange transition-all duration-300 group-hover:w-full" />
                </a>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Massive Typography */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="flex w-full justify-center border-b border-white/10 pb-12"
        >
          <h2 className="font-display text-[18vw] font-black leading-none tracking-tighter text-white/90 md:text-[15vw]">
            HABIB<span className="text-brand-orange">.</span>
          </h2>
        </motion.div>

        {/* Bottom Section: Copyright & Status */}
        <div className="mt-12 flex flex-col items-center justify-between gap-6 md:flex-row">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex items-center gap-4 font-mono text-xs uppercase tracking-widest text-white/40"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-orange opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-orange"></span>
            </span>
            System Online
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="font-mono text-[10px] uppercase tracking-widest text-white/30"
          >
            &copy; {new Date().getFullYear()} Habib. All Rights Reserved.
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="font-mono text-[10px] uppercase tracking-widest text-white/30"
          >
            Designed & Built with <span className="text-brand-orange">Vibe</span>
          </motion.div>
        </div>

      </div>
    </footer>
  );
}
