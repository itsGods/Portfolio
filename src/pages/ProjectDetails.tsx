import React, { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, ExternalLink, Github, CheckCircle2 } from "lucide-react";
import { projects } from "../data/projects";
import PageTransition from "../components/PageTransition";
import { useStructuredData } from "../hooks/useStructuredData";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CustomCursor from "../components/CustomCursor";

export default function ProjectDetails() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const project = projects.find(p => p.slug === slug);

  useEffect(() => {
    if (!project) {
      navigate("/404", { replace: true });
    }
  }, [project, navigate]);

  if (!project) return null;

  useStructuredData({
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `${project.title} - Case Study`,
    "description": project.caseStudy.overview,
    "image": project.landscapeImage || project.image,
    "author": {
      "@type": "Person",
      "name": "TG Habib"
    },
    "publisher": {
      "@type": "Organization",
      "name": "TG Habib"
    }
  });

  const canonicalUrl = `https://tghabib.com/project/${project.slug}`;

  return (
    <PageTransition>
      <Helmet>
        <title>{project.title} - Case Study | TG Habib</title>
        <meta name="description" content={project.caseStudy.overview} />
        <meta name="keywords" content={`${project.title}, case study, ${project.techStack.join(', ')}, web development, portfolio`} />
        <link rel="canonical" href={canonicalUrl} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={`${project.title} - Case Study | TG Habib`} />
        <meta property="og:description" content={project.caseStudy.overview} />
        <meta property="og:image" content={project.landscapeImage || project.image} />
        <meta property="og:site_name" content="TG Habib" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@tghabib" />
        <meta name="twitter:url" content={canonicalUrl} />
        <meta name="twitter:title" content={`${project.title} - Case Study | TG Habib`} />
        <meta name="twitter:description" content={project.caseStudy.overview} />
        <meta name="twitter:image" content={project.landscapeImage || project.image} />
        <meta name="twitter:creator" content="@tghabib" />
      </Helmet>

      <main className="relative bg-brand-black text-brand-light selection:bg-brand-orange selection:text-white md:cursor-none">
        <CustomCursor />
        <Navbar />

        <div className="min-h-screen pt-32 pb-24">
          {/* Background Grid */}
          <div className="fixed inset-0 z-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_20%,transparent_100%)] pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-5xl px-6 md:px-12">
          {/* Back Button */}
          <Link 
            to="/#projects" 
            className="inline-flex items-center gap-2 text-brand-orange hover:text-white transition-colors mb-12 font-mono text-xs uppercase tracking-widest"
          >
            <ArrowLeft size={16} />
            Back to Projects
          </Link>

          {/* Header */}
          <header className="mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-4 mb-6">
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-brand-orange px-3 py-1 border border-brand-orange/30 rounded-full bg-brand-orange/10">
                  {project.category}
                </span>
                <span className="font-mono text-xs text-white/50">{project.year}</span>
              </div>
              
              <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight">
                {project.title}
              </h1>
              
              <p className="text-xl md:text-2xl text-white/70 font-sans leading-relaxed max-w-3xl mb-10">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-4">
                {project.link && project.link !== "#" && (
                  <a 
                    href={project.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-brand-orange text-black font-bold px-8 py-4 rounded-full hover:bg-white transition-colors shadow-[0_0_20px_rgba(242,125,38,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]"
                  >
                    <ExternalLink size={18} />
                    Visit Live Site
                  </a>
                )}
                {project.github && (
                  <a 
                    href={project.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-white/5 text-white font-bold px-8 py-4 rounded-full border border-white/10 hover:bg-white/10 transition-colors"
                  >
                    <Github size={18} />
                    View Source
                  </a>
                )}
              </div>
            </motion.div>
          </header>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-24 relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-black aspect-[16/9] md:aspect-[21/9]"
          >
            <img 
              src={project.landscapeImage || project.image} 
              alt={`${project.title} Hero`}
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-transparent" />
          </motion.div>

          {/* Project Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-24">
            {/* Sidebar Info */}
            <div className="md:col-span-1 space-y-10">
              <div>
                <h3 className="font-mono text-xs uppercase tracking-widest text-white/40 mb-3">Role</h3>
                <p className="text-white font-sans text-lg">{project.role}</p>
              </div>
              <div>
                <h3 className="font-mono text-xs uppercase tracking-widest text-white/40 mb-3">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map(tech => (
                    <span key={tech} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm text-white/80">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="md:col-span-2 space-y-16">
              <section>
                <h2 className="font-display text-3xl font-bold text-white mb-6">Overview</h2>
                <p className="text-white/70 font-sans text-lg leading-relaxed">
                  {project.caseStudy.overview}
                </p>
              </section>

              <section>
                <h2 className="font-display text-3xl font-bold text-white mb-6">The Challenge</h2>
                <p className="text-white/70 font-sans text-lg leading-relaxed">
                  {project.caseStudy.challenge}
                </p>
              </section>

              <section>
                <h2 className="font-display text-3xl font-bold text-white mb-6">The Solution</h2>
                <p className="text-white/70 font-sans text-lg leading-relaxed">
                  {project.caseStudy.solution}
                </p>
              </section>

              <section>
                <h2 className="font-display text-3xl font-bold text-white mb-6">Key Features</h2>
                <ul className="space-y-4">
                  {project.caseStudy.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-white/70 font-sans text-lg">
                      <CheckCircle2 className="text-brand-orange shrink-0 mt-1" size={20} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="font-display text-3xl font-bold text-white mb-6">Results & Impact</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.caseStudy.results.map((result, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                      <p className="text-brand-orange font-bold text-lg">{result}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>

          {/* Gallery */}
          {project.caseStudy.images && project.caseStudy.images.length > 0 && (
            <div className="space-y-8">
              <h2 className="font-display text-3xl font-bold text-white mb-8">Gallery</h2>
              {project.caseStudy.images.map((img, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="group rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-black"
                >
                  <img 
                    src={img} 
                    alt={`${project.title} screenshot ${i + 1}`} 
                    className="w-full h-auto transition-transform duration-700 group-hover:scale-105" 
                  />
                </motion.div>
              ))}
            </div>
          )}

          {/* Next Project / CTA */}
          <div className="mt-32 pt-16 border-t border-white/10 text-center">
            <h2 className="font-display text-4xl font-bold text-white mb-8">Ready to start your project?</h2>
            <a 
              href="mailto:tgff28970@gmail.com" 
              className="inline-flex items-center justify-center px-10 py-5 text-sm font-mono font-bold tracking-widest uppercase bg-brand-orange text-black hover:bg-white transition-colors rounded-full shadow-[0_0_30px_rgba(255,90,0,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]"
            >
              Let's Talk
            </a>
          </div>
        </div>
        </div>
        <Footer />
      </main>
    </PageTransition>
  );
}
