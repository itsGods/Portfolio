import { motion } from "motion/react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { FlaskConical, ArrowLeft } from "lucide-react";
import CustomCursor from "../components/CustomCursor";
import Grain from "../components/Grain";
import PageTransition from "../components/PageTransition";

export default function Lab() {
  const isLabSubdomain = window.location.hostname.startsWith('lab.');
  const canonicalUrl = "https://lab.tghabib.com";

  return (
    <PageTransition>
      <main className="relative min-h-screen bg-brand-black text-brand-light selection:bg-brand-orange selection:text-white md:cursor-none flex flex-col items-center justify-center overflow-hidden">
        <Helmet>
          <title>Lab | TG Habib — Experimental Area</title>
          <meta name="description" content="The Lab: An experimental area for creative coding, WebGL, and future digital experiences by TG Habib." />
          <meta name="robots" content="noindex, nofollow" />
          <link rel="canonical" href={canonicalUrl} />
          
          {/* Open Graph / Facebook */}
          <meta property="og:type" content="website" />
          <meta property="og:url" content={canonicalUrl} />
          <meta property="og:title" content="Lab | TG Habib — Experimental Area" />
          <meta property="og:description" content="The Lab: An experimental area for creative coding, WebGL, and future digital experiences by TG Habib." />
          <meta property="og:site_name" content="TG Habib" />
          <meta property="og:locale" content="en_US" />
          <meta property="og:image" content="https://raw.githubusercontent.com/itsGods/Personal/refs/heads/main/file_0000000038e47208a7c7e84e80a5026d.png" />

          {/* Twitter */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@tghabib" />
          <meta name="twitter:url" content={canonicalUrl} />
          <meta name="twitter:title" content="Lab | TG Habib — Experimental Area" />
          <meta name="twitter:description" content="The Lab: An experimental area for creative coding, WebGL, and future digital experiences by TG Habib." />
          <meta name="twitter:image" content="https://raw.githubusercontent.com/itsGods/Personal/refs/heads/main/file_0000000038e47208a7c7e84e80a5026d.png" />
          <meta name="twitter:creator" content="@tghabib" />
        </Helmet>
        
        <CustomCursor />
        <Grain />

        {/* Background Elements */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[60vh] w-[60vw] rounded-full bg-brand-orange/5 blur-[150px] pointer-events-none" />
        <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)]" />

        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center justify-center px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8 flex h-24 w-24 items-center justify-center rounded-full border border-brand-orange/30 bg-brand-orange/10 text-brand-orange shadow-[0_0_30px_rgba(242,125,38,0.2)]"
          >
            <FlaskConical size={40} strokeWidth={1.5} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="font-display text-5xl font-black tracking-tighter text-white md:text-7xl lg:text-8xl">
              THE <span className="text-brand-orange">LAB</span>
            </h1>
            
            <div className="my-8 flex items-center justify-center gap-4">
              <div className="h-[1px] w-12 bg-brand-orange/50" />
              <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-brand-orange">
                EXPERIMENTAL ZONE
              </h2>
              <div className="h-[1px] w-12 bg-brand-orange/50" />
            </div>

            <p className="mx-auto mb-12 max-w-xl font-sans text-lg leading-relaxed text-white/60">
              Welcome to the Lab. This is a dedicated space for future experiments, creative coding, WebGL prototypes, and bleeding-edge digital experiences. 
              <br /><br />
              <span className="italic text-white/40">Initiating sequence...</span>
            </p>

            {isLabSubdomain ? (
              <a
                href="https://tghabib.com"
                className="group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full border border-white/20 bg-white/5 px-8 py-4 font-mono text-xs uppercase tracking-widest text-white backdrop-blur-md transition-all hover:border-brand-orange hover:bg-brand-orange/10"
              >
                <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                <span>Return to Main Site</span>
              </a>
            ) : (
              <Link
                to="/"
                className="group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full border border-white/20 bg-white/5 px-8 py-4 font-mono text-xs uppercase tracking-widest text-white backdrop-blur-md transition-all hover:border-brand-orange hover:bg-brand-orange/10"
              >
                <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                <span>Return to Main Site</span>
              </Link>
            )}
          </motion.div>
        </div>
      </main>
    </PageTransition>
  );
}
