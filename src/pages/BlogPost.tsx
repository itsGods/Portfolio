import { useState, useEffect, useRef } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import type { Timestamp } from "firebase/firestore";
import ReactMarkdown from "react-markdown";
import rehypeSlug from "rehype-slug";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CustomCursor from "../components/CustomCursor";
import Grain from "../components/Grain";
import PageTransition from "../components/PageTransition";
import TableOfContents from "../components/TableOfContents";
import { ArrowLeft, Clock, Tag, Share2, Twitter, Linkedin, Link as LinkIcon, Copy, Check, ArrowUp } from "lucide-react";
import { useStructuredData } from "../hooks/useStructuredData";
import { useReadingProgress } from "../hooks/useReadingProgress";
import { stripAndTruncate } from "../lib/utils";
import { OptimizedImage } from "../components/OptimizedImage";
import PostReactions from "../components/PostReactions";

const CodeBlock = ({ node, inline, className, children, ...props }: any) => {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const codeString = String(children).replace(/\n$/, '');

  const handleCopy = () => {
    navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!inline && match) {
    return (
      <div className="relative group my-8">
        <div className="absolute right-4 top-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleCopy}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white/60 hover:text-white transition-colors backdrop-blur-sm border border-white/10"
            title="Copy code"
          >
            {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
          </button>
        </div>
        <SyntaxHighlighter
          {...props}
          children={codeString}
          style={vscDarkPlus}
          language={match[1]}
          PreTag="div"
          className="rounded-xl border border-white/10 !bg-black/50 !m-0"
        />
      </div>
    );
  }

  return (
    <code {...props} className={`${className} bg-white/10 px-1.5 py-0.5 rounded-md text-brand-orange font-mono text-sm`}>
      {children}
    </code>
  );
};

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage: string;
  createdAt: Timestamp | null;
  seoTitle?: string;
  seoDescription?: string;
  tags?: string[];
  readingTime?: number;
  reactions?: {
    fire: number;
    brain: number;
    heart: number;
  };
  views?: number;
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const scrollProgress = useReadingProgress();
  const { pathname, search } = useLocation();
  const previewToken = new URLSearchParams(search).get("preview");

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      setShowScrollTop(totalScroll > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // GA4 Reading Milestone Tracking
  const reportedMilestones = useRef(new Set<number>());
  useEffect(() => {
    const milestones = [25, 50, 75, 100];
    for (const milestone of milestones) {
      if (scrollProgress >= milestone && !reportedMilestones.current.has(milestone)) {
        reportedMilestones.current.add(milestone);
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'reading_milestone', {
            event_category: 'engagement',
            event_label: post?.title || slug,
            value: milestone,
            post_slug: slug
          });
        }
      }
    }
  }, [scrollProgress, post, slug]);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      try {
        const { collection, query, where, getDocs, orderBy, limit } = await import("firebase/firestore");
        const { db } = await import("../firebase");

        let q;
        if (previewToken) {
          q = query(collection(db, "posts"), where("slug", "==", slug), where("previewToken", "==", previewToken));
        } else {
          q = query(collection(db, "posts"), where("slug", "==", slug), where("published", "==", true));
        }
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const docRef = snapshot.docs[0].ref;
          const currentPost = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Post;
          setPost(currentPost);

          // Increment view count (only if not preview mode)
          if (!previewToken) {
            const { updateDoc, increment } = await import("firebase/firestore");
            try {
              await updateDoc(docRef, {
                views: increment(1)
              });
            } catch (e) {
              console.error("Error updating views:", e);
            }
          }

          // Fetch related posts (just getting latest 3 for now, excluding current)
          const relatedQ = query(
            collection(db, "posts"), 
            where("published", "==", true),
            orderBy("createdAt", "desc"),
            limit(4)
          );
          const relatedSnapshot = await getDocs(relatedQ);
          const related = relatedSnapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() } as Post))
            .filter(p => p.id !== currentPost.id)
            .slice(0, 3);
          setRelatedPosts(related);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  useStructuredData(post ? [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt ?? stripAndTruncate(post.content),
      "datePublished": post.createdAt?.toDate?.().toISOString() ?? '',
      "author": { 
        "@type": "Person", 
        "name": "Habib" 
      },
      "image": post.coverImage ?? '',
      "url": `https://tghabib.com/blog/${post.slug}`
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://tghabib.com/" },
        { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://tghabib.com/blog" },
        { "@type": "ListItem", "position": 3, "name": post.title, "item": `https://tghabib.com/blog/${post.slug}` }
      ]
    }
  ] : []);

  if (loading) {
    return (
      <main className="relative min-h-screen bg-brand-black flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-orange border-t-transparent" />
      </main>
    );
  }

  if (!post) {
    return (
      <main className="relative min-h-screen bg-brand-black flex flex-col items-center justify-center text-white">
        <h1 className="text-4xl font-bold mb-4">Post not found</h1>
        <Link to={window.location.hostname.startsWith('blog.') ? "/" : "/blog"} className="text-brand-orange hover:underline">Return to Blog</Link>
      </main>
    );
  }

  const isBlogSubdomain = window.location.hostname.startsWith('blog.');
  const backUrl = isBlogSubdomain ? "/" : "/blog";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard!");
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const shareUrl = encodeURIComponent(window.location.href);
  const shareTitle = encodeURIComponent(post.title);

  return (
    <PageTransition>
      <main className="relative min-h-screen bg-brand-black text-brand-light selection:bg-brand-orange selection:text-white md:cursor-none flex flex-col">
        <Helmet>
          <title>{post.title} | Habib Dev Blog</title>
          <meta name="description" content={post.excerpt ?? stripAndTruncate(post.content)} />
          <link rel="canonical" href={`https://tghabib.com${pathname}`} />
          {previewToken && <meta name="robots" content="noindex, nofollow" />}
          <meta property="og:title" content={post.title} />
          <meta property="og:description" content={post.excerpt ?? stripAndTruncate(post.content)} />
          <meta property="og:url" content={`https://tghabib.com${pathname}`} />
          <meta property="og:type" content="article" />
          {post.coverImage && <meta property="og:image" content={post.coverImage} />}
          <meta name="twitter:card" content="summary_large_image" />
        </Helmet>
        
        <CustomCursor />
        <Grain />
        <div 
          className="fixed top-0 left-0 h-1 bg-brand-orange z-50 transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
        <Navbar />
        {previewToken && (
          <div className="fixed top-0 left-0 right-0 bg-brand-orange text-black font-mono text-xs uppercase tracking-widest text-center py-2 z-[60] font-bold">
            Draft Preview Mode
          </div>
        )}
        <TableOfContents content={post.content} />

        {/* Scroll to Top Button */}
        <button
          onClick={scrollToTop}
          className={`fixed bottom-6 left-6 z-40 p-3 rounded-full bg-brand-dark/80 backdrop-blur-xl border border-white/10 text-white transition-all duration-300 hover:bg-brand-orange hover:border-brand-orange shadow-lg ${
            showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
          }`}
          aria-label="Scroll to top"
        >
          <ArrowUp size={20} />
        </button>

        <div className="flex-1 pt-32 pb-24 px-6 md:px-12 max-w-4xl mx-auto w-full">
          <Link to={backUrl} className="inline-flex items-center gap-2 text-brand-orange hover:text-white transition-colors mb-12 font-mono text-xs uppercase tracking-widest">
            <ArrowLeft size={16} />
            Back to Blog
          </Link>

          <article>
            <header className="mb-12">
              <div className="mb-6 flex flex-wrap items-center gap-4 text-brand-orange font-mono text-xs uppercase tracking-[0.2em]">
                <div className="flex items-center gap-4">
                  <div className="h-[1px] w-12 bg-brand-orange" />
                  <p>
                    {post.createdAt?.toDate() ? post.createdAt.toDate().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Unknown date'}
                  </p>
                </div>
                {post.readingTime && (
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{post.readingTime} min read</span>
                  </div>
                )}
              </div>
              <h1 className="font-display text-4xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl mb-6">
                {post.title}
              </h1>
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.tags.map(tag => (
                    <span key={tag} className="flex items-center gap-1 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-mono text-white/60">
                      <Tag size={12} /> {tag}
                    </span>
                  ))}
                </div>
              )}
              {post.excerpt && (
                <p className="text-xl text-white/60 font-sans leading-relaxed">
                  {post.excerpt}
                </p>
              )}
            </header>

            {post.coverImage && (
              <div className="relative aspect-[2/1] w-full overflow-hidden rounded-2xl bg-brand-dark mb-16">
                <OptimizedImage
                  src={post.coverImage.replace('/images/', '/images/optimized/').replace(/\.(png|jpe?g)$/i, '.webp')}
                  webpSrc={post.coverImage.replace('/images/', '/images/optimized/').replace(/\.(png|jpe?g)$/i, '.webp')}
                  alt={post.title}
                  width={1200}
                  height={600}
                  priority={true}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1200px"
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            <div className="prose prose-invert prose-lg max-w-none prose-headings:font-display prose-headings:font-bold prose-p:font-sans prose-p:text-white/80 prose-a:text-brand-orange hover:prose-a:text-brand-orange/80 prose-img:rounded-xl">
              <ReactMarkdown 
                rehypePlugins={[rehypeSlug]}
                components={{
                  code: CodeBlock
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>

            {/* Share & Author Section */}
            <div className="mt-16 pt-8 border-t border-white/10">
              <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-xs uppercase tracking-widest text-white/60 flex items-center gap-2">
                      <Share2 size={16} /> Share
                    </span>
                    <a href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 hover:bg-brand-orange hover:text-white rounded-full transition-colors text-white/60">
                      <Twitter size={18} />
                    </a>
                    <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${shareTitle}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 hover:bg-brand-orange hover:text-white rounded-full transition-colors text-white/60">
                      <Linkedin size={18} />
                    </a>
                    <button onClick={handleCopyLink} className="p-2 bg-white/5 hover:bg-brand-orange hover:text-white rounded-full transition-colors text-white/60">
                      <LinkIcon size={18} />
                    </button>
                  </div>
                  <PostReactions postId={post.id} initialReactions={post.reactions} />
                </div>

                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 max-w-sm">
                  <div className="w-12 h-12 rounded-full bg-brand-orange flex items-center justify-center text-xl font-bold text-white">
                    H
                  </div>
                  <div>
                    <h3 className="font-bold text-white">Habib</h3>
                    <p className="text-sm text-white/60">Software Engineer & Designer</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div className="mt-24 pt-12 border-t border-white/10">
                <h3 className="font-display text-2xl font-bold text-white mb-8">Read Next</h3>
                <div className="grid gap-6 md:grid-cols-3">
                  {relatedPosts.map((relatedPost) => (
                    <Link
                      key={relatedPost.id}
                      to={isBlogSubdomain ? `/${relatedPost.slug}` : `/blog/${relatedPost.slug}`}
                      className="group flex flex-col gap-4 rounded-2xl bg-white/5 p-4 transition-colors hover:bg-white/10 border border-white/5 hover:border-white/10"
                    >
                      {relatedPost.coverImage && (
                        <div className="relative overflow-hidden aspect-video w-full rounded-xl bg-black">
                          <OptimizedImage
                            src={relatedPost.coverImage.replace('/images/', '/images/optimized/').replace(/\.(png|jpe?g)$/i, '.webp')}
                            webpSrc={relatedPost.coverImage.replace('/images/', '/images/optimized/').replace(/\.(png|jpe?g)$/i, '.webp')}
                            alt={relatedPost.title}
                            width={400}
                            height={225}
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="w-full h-full object-cover opacity-70 transition-transform duration-700 group-hover:scale-110 group-hover:opacity-100"
                          />
                        </div>
                      )}
                      <div>
                        <h4 className="font-display text-lg font-bold text-white mb-2 group-hover:text-brand-orange transition-colors line-clamp-2">
                          {relatedPost.title}
                        </h4>
                        <p className="font-sans text-xs text-white/60 line-clamp-2">
                          {relatedPost.excerpt}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </article>
        </div>

        <Footer />
      </main>
    </PageTransition>
  );
}
