import { motion } from "motion/react";
import { Code2, Zap, Layout, Server, ArrowRight } from "lucide-react";

const services = [
  {
    icon: <Layout className="w-8 h-8 text-brand-orange" />,
    title: "Cinematic Web Experiences",
    description: "I build high-performance, visually stunning websites that captivate users and elevate brand perception. Leveraging React, Framer Motion, and WebGL.",
    features: ["Interactive 3D Elements", "Smooth Page Transitions", "Award-winning UI/UX"]
  },
  {
    icon: <Zap className="w-8 h-8 text-brand-orange" />,
    title: "Conversion-Optimized Funnels",
    description: "Your website should be your best salesperson. I design and engineer user journeys that turn casual visitors into paying clients.",
    features: ["A/B Testing Ready", "Lead Capture Integration", "Performance Optimized"]
  },
  {
    icon: <Server className="w-8 h-8 text-brand-orange" />,
    title: "Full-Stack Architecture",
    description: "From database design to API development, I build robust, scalable backends that power your digital products securely.",
    features: ["Firebase & Supabase", "Node.js / Edge Functions", "Secure Authentication"]
  }
];

export default function Services() {
  return (
    <section id="services" className="relative w-full bg-brand-black py-32 md:py-48 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute left-0 top-1/2 h-[60vh] w-[40vw] -translate-y-1/2 rounded-full bg-brand-orange/5 blur-[120px] pointer-events-none" />
      
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-start gap-16 px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-2xl"
        >
          <div className="mb-8 flex items-center gap-4">
            <div className="h-[1px] w-8 bg-brand-orange" />
            <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-brand-orange">
              SERVICES // 02
            </h2>
          </div>

          <h2 className="mb-8 font-serif text-5xl italic text-white md:text-7xl">
            Premium <br />
            <span className="font-display not-italic font-bold text-brand-orange">Digital Engineering</span>
          </h2>
          <p className="font-sans text-lg leading-relaxed text-white/60">
            I don't just write code. I engineer digital products that solve business problems, drive growth, and leave a lasting impression.
          </p>
        </motion.div>

        <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-3">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 1, delay: index * 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="group relative flex flex-col justify-between overflow-hidden border border-white/10 bg-white/5 p-8 transition-colors hover:border-brand-orange/50 hover:bg-white/10"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />
              
              <div className="relative z-10">
                <div className="mb-8 inline-flex rounded-2xl bg-black/50 p-4 border border-white/5 shadow-xl">
                  {service.icon}
                </div>
                <h3 className="mb-4 font-display text-2xl font-bold text-white">
                  {service.title}
                </h3>
                <p className="mb-8 font-sans text-white/60 leading-relaxed">
                  {service.description}
                </p>
              </div>

              <div className="relative z-10 border-t border-white/10 pt-6">
                <ul className="flex flex-col gap-3">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 font-mono text-xs text-white/50">
                      <ArrowRight size={12} className="text-brand-orange" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
