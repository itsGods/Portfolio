import { motion } from "motion/react";
import React, { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isHovered, setIsHovered] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section id="contact" className="relative w-full bg-brand-black py-32 md:py-48 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute right-0 top-0 h-[80vh] w-[50vw] rounded-full bg-brand-orange/5 blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_100%_0%,#000_20%,transparent_100%)]" />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-start justify-between gap-24 px-6 md:flex-row md:px-12">
        
        {/* Left: Text */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 md:pr-12"
        >
          <div className="mb-8 flex items-center gap-4">
            <div className="h-[1px] w-8 bg-brand-orange" />
            <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-brand-orange">
              SECURE UPLINK // 04
            </h2>
          </div>

          <h2 className="mb-8 font-serif text-5xl italic text-white md:text-7xl lg:text-8xl">
            Let's <br />
            <span className="font-display not-italic font-bold text-brand-orange">Connect</span>
          </h2>
          <p className="mb-12 max-w-md font-sans text-lg leading-relaxed text-white/60">
            Ready to build something extraordinary? Drop me a line. Let's create the next big thing together.
          </p>

          <div className="flex flex-col gap-6 font-mono text-sm tracking-widest text-white/50">
            <a href="mailto:hello@tghabib.com" aria-label="Email me at hello@tghabib.com" className="group flex items-center gap-4 transition-colors hover:text-white">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-colors group-hover:border-brand-orange group-hover:bg-brand-orange/10 group-hover:text-brand-orange">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              </span>
              hello@tghabib.com
            </a>
            <a href="https://github.com/itsGods" target="_blank" rel="noreferrer" aria-label="Visit my GitHub profile" className="group flex items-center gap-4 transition-colors hover:text-white">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-colors group-hover:border-brand-orange group-hover:bg-brand-orange/10 group-hover:text-brand-orange">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
              </span>
              github.com/itsGods
            </a>
          </div>
        </motion.div>

        {/* Right: Form */}
        <motion.form
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full flex-1 space-y-8 md:w-auto bg-black/40 p-8 border border-white/10 backdrop-blur-md"
          onSubmit={(e) => e.preventDefault()}
        >
          {/* Tech Brackets */}
          <div className="absolute -left-2 -top-2 h-6 w-6 border-l-2 border-t-2 border-brand-orange/50" />
          <div className="absolute -right-2 -top-2 h-6 w-6 border-r-2 border-t-2 border-brand-orange/50" />
          <div className="absolute -bottom-2 -left-2 h-6 w-6 border-b-2 border-l-2 border-brand-orange/50" />
          <div className="absolute -bottom-2 -right-2 h-6 w-6 border-b-2 border-r-2 border-brand-orange/50" />
          
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-dark px-4 font-mono text-[10px] text-brand-orange tracking-widest flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-orange animate-pulse" />
            TERMINAL
          </div>
          <div className="relative group">
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              onFocus={() => setFocusedInput('name')}
              onBlur={() => setFocusedInput(null)}
              required
              className="peer w-full border-b border-white/20 bg-transparent py-4 font-mono text-sm text-white placeholder-transparent transition-colors focus:border-brand-orange focus:outline-none focus:bg-white/5 px-2"
              placeholder="Name"
            />
            <label
              htmlFor="name"
              className="absolute left-2 top-4 -translate-y-6 font-mono text-xs uppercase tracking-widest text-brand-orange transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-white/50 peer-focus:-translate-y-6 peer-focus:text-brand-orange"
            >
              &gt; Name_
            </label>
            <motion.div 
              initial={{ scaleX: 0 }}
              animate={{ scaleX: focusedInput === 'name' ? 1 : 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="absolute bottom-0 left-0 h-[2px] w-full origin-left bg-brand-orange shadow-[0_0_10px_#FF5A00]"
            />
          </div>

          <div className="relative group">
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              onFocus={() => setFocusedInput('email')}
              onBlur={() => setFocusedInput(null)}
              required
              className="peer w-full border-b border-white/20 bg-transparent py-4 font-mono text-sm text-white placeholder-transparent transition-colors focus:border-brand-orange focus:outline-none focus:bg-white/5 px-2"
              placeholder="Email"
            />
            <label
              htmlFor="email"
              className="absolute left-2 top-4 -translate-y-6 font-mono text-xs uppercase tracking-widest text-brand-orange transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-white/50 peer-focus:-translate-y-6 peer-focus:text-brand-orange"
            >
              &gt; Email_
            </label>
            <motion.div 
              initial={{ scaleX: 0 }}
              animate={{ scaleX: focusedInput === 'email' ? 1 : 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="absolute bottom-0 left-0 h-[2px] w-full origin-left bg-brand-orange shadow-[0_0_10px_#FF5A00]"
            />
          </div>

          <div className="relative group">
            <textarea
              name="message"
              id="message"
              value={formData.message}
              onChange={handleChange}
              onFocus={() => setFocusedInput('message')}
              onBlur={() => setFocusedInput(null)}
              required
              rows={4}
              className="peer w-full resize-none border-b border-white/20 bg-transparent py-4 font-mono text-sm text-white placeholder-transparent transition-colors focus:border-brand-orange focus:outline-none focus:bg-white/5 px-2"
              placeholder="Message"
            />
            <label
              htmlFor="message"
              className="absolute left-2 top-4 -translate-y-6 font-mono text-xs uppercase tracking-widest text-brand-orange transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-white/50 peer-focus:-translate-y-6 peer-focus:text-brand-orange"
            >
              &gt; Message_
            </label>
            <motion.div 
              initial={{ scaleX: 0 }}
              animate={{ scaleX: focusedInput === 'message' ? 1 : 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="absolute bottom-0 left-0 h-[2px] w-full origin-left bg-brand-orange shadow-[0_0_10px_#FF5A00]"
            />
          </div>

          <button
            type="submit"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group relative mt-8 inline-flex w-full items-center justify-center overflow-hidden rounded-none border border-white/20 bg-transparent px-12 py-5 font-mono text-sm uppercase tracking-widest text-white transition-colors hover:border-brand-orange md:w-auto"
          >
            <span className="relative z-10 transition-colors group-hover:text-black">Transmit Message</span>
            <div className="absolute inset-0 -z-0 h-full w-full translate-y-full bg-brand-orange transition-transform duration-500 ease-[0.16,1,0.3,1] group-hover:translate-y-0" />
          </button>
        </motion.form>

      </div>
    </section>
  );
}
