import { motion } from "motion/react";
import React, { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isHovered, setIsHovered] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section id="contact" className="relative w-full bg-brand-black py-32 md:py-48">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-16 px-6 md:flex-row md:px-12">
        
        {/* Left: Text */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 md:pr-12"
        >
          <h2 className="mb-6 font-serif text-5xl italic text-white md:text-7xl">
            Let's <br />
            <span className="font-display not-italic font-bold text-brand-orange">Connect</span>
          </h2>
          <p className="max-w-md font-sans text-lg text-white/60">
            Ready to build something extraordinary? Drop me a line at <a href="mailto:itssolodev@gmail.com" className="text-brand-orange transition-colors hover:text-white">itssolodev@gmail.com</a> or check out my <a href="https://github.com/itsGods" target="_blank" rel="noreferrer" className="text-brand-orange transition-colors hover:text-white">GitHub</a>. Let's create the next big thing together.
          </p>
        </motion.div>

        {/* Right: Form */}
        <motion.form
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full flex-1 space-y-8 md:w-auto"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="relative group">
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="peer w-full border-b border-white/20 bg-transparent py-4 font-mono text-sm text-white placeholder-transparent focus:border-brand-orange focus:outline-none"
              placeholder="Name"
            />
            <label
              htmlFor="name"
              className="absolute left-0 top-4 -translate-y-6 font-mono text-xs uppercase tracking-widest text-brand-orange transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-white/50 peer-focus:-translate-y-6 peer-focus:text-brand-orange"
            >
              Name
            </label>
          </div>

          <div className="relative group">
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="peer w-full border-b border-white/20 bg-transparent py-4 font-mono text-sm text-white placeholder-transparent focus:border-brand-orange focus:outline-none"
              placeholder="Email"
            />
            <label
              htmlFor="email"
              className="absolute left-0 top-4 -translate-y-6 font-mono text-xs uppercase tracking-widest text-brand-orange transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-white/50 peer-focus:-translate-y-6 peer-focus:text-brand-orange"
            >
              Email
            </label>
          </div>

          <div className="relative group">
            <textarea
              name="message"
              id="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={4}
              className="peer w-full resize-none border-b border-white/20 bg-transparent py-4 font-mono text-sm text-white placeholder-transparent focus:border-brand-orange focus:outline-none"
              placeholder="Message"
            />
            <label
              htmlFor="message"
              className="absolute left-0 top-4 -translate-y-6 font-mono text-xs uppercase tracking-widest text-brand-orange transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-white/50 peer-focus:-translate-y-6 peer-focus:text-brand-orange"
            >
              Message
            </label>
          </div>

          <button
            type="submit"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border border-brand-orange bg-transparent px-12 py-4 font-mono text-sm uppercase tracking-widest text-brand-orange transition-colors hover:text-white"
          >
            <span className="relative z-10">Send Message</span>
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={isHovered ? { scale: 1.5, opacity: 1 } : { scale: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute inset-0 z-0 rounded-full bg-brand-orange"
            />
          </button>
        </motion.form>

      </div>
    </section>
  );
}
