import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import CustomCursor from "../components/CustomCursor";
import Grain from "../components/Grain";

export default function NotFound() {
  return (
    <main className="relative min-h-screen w-full bg-brand-black overflow-hidden flex items-center justify-center">
      <Helmet>
        <title>404 - Page Not Found | TG Habib</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <CustomCursor />
      <Grain />

      {/* Background Elements */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[50vh] w-[50vw] rounded-full bg-brand-orange/5 blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)]" />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="font-display text-[20vw] font-black leading-none tracking-tighter text-white/90 md:text-[15vw]">
            404<span className="text-brand-orange">.</span>
          </h1>
          
          <div className="mb-8 flex items-center justify-center gap-4">
            <div className="h-[1px] w-8 bg-brand-orange" />
            <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-brand-orange">
              SYSTEM ERROR
            </h2>
            <div className="h-[1px] w-8 bg-brand-orange" />
          </div>

          <p className="mb-12 max-w-md mx-auto font-sans text-lg leading-relaxed text-white/60">
            The coordinates you entered lead to an empty sector. This page has been moved, deleted, or never existed.
          </p>

          <Link
            to="/"
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-none border border-white/20 bg-transparent px-12 py-5 font-mono text-sm uppercase tracking-widest text-white transition-colors hover:border-brand-orange"
          >
            <span className="relative z-10 transition-colors group-hover:text-black">Return to Base</span>
            <div className="absolute inset-0 -z-0 h-full w-full translate-y-full bg-brand-orange transition-transform duration-500 ease-[0.16,1,0.3,1] group-hover:translate-y-0" />
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
