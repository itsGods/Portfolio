import { motion } from "motion/react";

const socials = [
  { name: "Twitter", url: "#" },
  { name: "GitHub", url: "#" },
  { name: "LinkedIn", url: "#" },
  { name: "Dribbble", url: "#" },
];

export default function Footer() {
  return (
    <footer className="relative w-full bg-brand-black py-12 border-t border-white/10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-6 md:flex-row md:px-12">
        
        {/* Left: Logo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="font-display text-xl font-bold tracking-tighter text-white"
        >
          HABIB<span className="text-brand-orange">.</span>
        </motion.div>

        {/* Center: Socials */}
        <ul className="flex items-center gap-6">
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
                className="group relative font-mono text-xs uppercase tracking-widest text-white/50 transition-colors hover:text-brand-orange"
              >
                {social.name}
                <span className="absolute -bottom-2 left-0 h-[1px] w-0 bg-brand-orange transition-all duration-300 group-hover:w-full" />
              </a>
            </motion.li>
          ))}
        </ul>

        {/* Right: Copyright */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-mono text-xs uppercase tracking-widest text-white/30"
        >
          &copy; {new Date().getFullYear()} All Rights Reserved.
        </motion.div>

      </div>
    </footer>
  );
}
