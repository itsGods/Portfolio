import { useEffect, lazy, Suspense } from "react";
import { Helmet } from "react-helmet-async";
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
        <meta property="og:image" content="https://raw.githubusercontent.com/itsGods/Personal/refs/heads/main/file_0000000038e47208a7c7e84e80a5026d.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://tghabib.com/" />
        <meta name="twitter:title" content="TG Habib | Full-Stack Developer & Vibecoder" />
        <meta name="twitter:description" content="TG Habib is a Full-Stack Developer and Vibecoder building fast, modern web apps with React, Firebase, and TypeScript." />
        <meta name="twitter:image" content="https://raw.githubusercontent.com/itsGods/Personal/refs/heads/main/file_0000000038e47208a7c7e84e80a5026d.png" />
        <meta name="twitter:creator" content="@tghabib" />
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
