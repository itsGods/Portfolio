import { motion } from "motion/react";

const testimonials = [
  {
    quote: "Habib completely transformed our digital presence. The attention to detail and performance optimization resulted in a 40% increase in conversion rate.",
    author: "Sarah Jenkins",
    role: "Marketing Director, TechNova",
    image: "https://i.pravatar.cc/150?img=1"
  },
  {
    quote: "Working with Habib was a game-changer. He doesn't just write code; he understands the business goals and engineers solutions that actually drive results.",
    author: "David Chen",
    role: "Founder, Elevate Startup",
    image: "https://i.pravatar.cc/150?img=11"
  },
  {
    quote: "The cinematic web experience Habib built for us won multiple design awards. His mastery of WebGL and React is truly top-tier.",
    author: "Elena Rodriguez",
    role: "Creative Lead, Studio X",
    image: "https://i.pravatar.cc/150?img=5"
  }
];

export default function Testimonials() {
  return (
    <section className="relative w-full bg-brand-black py-32 md:py-48 overflow-hidden">
      <div className="absolute right-0 top-1/2 h-[40vh] w-[30vw] -translate-y-1/2 rounded-full bg-brand-orange/5 blur-[100px] pointer-events-none" />
      
      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 text-center"
        >
          <div className="mb-8 flex items-center justify-center gap-4">
            <div className="h-[1px] w-8 bg-brand-orange" />
            <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-brand-orange">
              TESTIMONIALS // 04
            </h2>
            <div className="h-[1px] w-8 bg-brand-orange" />
          </div>
          <h2 className="font-serif text-4xl italic text-white md:text-5xl">
            Client <span className="font-display not-italic font-bold text-brand-orange">Impact</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 1, delay: index * 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex flex-col justify-between rounded-2xl border border-white/10 bg-white/5 p-8"
            >
              <div className="mb-8">
                <svg className="mb-4 h-8 w-8 text-brand-orange/30" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="font-sans text-lg leading-relaxed text-white/80">
                  "{testimonial.quote}"
                </p>
              </div>
              
              <div className="flex items-center gap-4 border-t border-white/10 pt-6">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.author} 
                  loading="lazy"
                  decoding="async"
                  className="h-12 w-12 rounded-full border border-white/20 object-cover"
                />
                <div>
                  <h4 className="font-display font-bold text-white">{testimonial.author}</h4>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-brand-orange">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
