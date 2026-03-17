import { useEffect, lazy, Suspense } from "react";
import { Helmet } from "react-helmet-async";
import Lenis from "lenis";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Grain from "../components/Grain";
import Particles from "../components/Particles";
import PageTransition from "../components/PageTransition";
import CustomCursor from "../components/CustomCursor";
import { useStructuredData } from "../hooks/useStructuredData";

const About = lazy(() => import("../components/About"));
const Projects = lazy(() => import("../components/Projects"));
const Skills = lazy(() => import("../components/Skills"));
const Contact = lazy(() => import("../components/Contact"));
const Footer = lazy(() => import("../components/Footer"));

const Skeleton = ({ height }: { height: string }) => (
  <div className={`w-full ${height} bg-brand-black animate-pulse`} />
);

export default function Home() {
  useStructuredData({
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Habib",
    "url": "https://tghabib.com",
    "jobTitle": "Full-Stack Developer",
    "description": "Vibecoder building modern web apps with React, Firebase, and TypeScript",
    "email": "hello@tghabib.com",
    "sameAs": [
      "https://github.com/itsGods"
    ]
  });

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    const handleStop = () => lenis.stop();
    const handleStart = () => lenis.start();
    window.addEventListener('stop-lenis', handleStop);
    window.addEventListener('start-lenis', handleStart);

    return () => {
      window.removeEventListener('stop-lenis', handleStop);
      window.removeEventListener('start-lenis', handleStart);
      lenis.destroy();
    };
  }, []);

  return (
    <PageTransition>
      <Helmet>
        <title>TG Habib | Full-Stack Developer & Vibecoder</title>
        <meta name="description" content="TG Habib is a Full-Stack Developer and Vibecoder building fast, modern web apps with React, Firebase, and TypeScript. Available for freelance projects." />
        <meta name="keywords" content="Full-Stack Developer, React Developer, Firebase, TypeScript, Vibecoder, Solo Developer, Web Apps, Next.js" />
        <link rel="canonical" href="https://tghabib.com/" />
        <meta property="og:title" content="TG Habib | Full-Stack Developer & Vibecoder" />
        <meta property="og:description" content="TG Habib is a Full-Stack Developer and Vibecoder building fast, modern web apps with React, Firebase, and TypeScript." />
        <meta property="og:url" content="https://tghabib.com/" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <main className="relative bg-brand-black text-brand-light selection:bg-brand-orange selection:text-white md:cursor-none">
        <CustomCursor />
        <Grain />
        <Particles />
        <Navbar />
        <Hero />
        <Suspense fallback={<Skeleton height="h-screen" />}>
          <About />
        </Suspense>
        <Suspense fallback={<Skeleton height="h-screen" />}>
          <Projects />
        </Suspense>
        <Suspense fallback={<Skeleton height="h-screen" />}>
          <Skills />
        </Suspense>
        <Suspense fallback={<Skeleton height="h-screen" />}>
          <Contact />
        </Suspense>
        <Suspense fallback={<Skeleton height="h-64" />}>
          <Footer />
        </Suspense>
      </main>
    </PageTransition>
  );
}
