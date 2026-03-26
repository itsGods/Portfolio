import { useState, useEffect, useRef, use, Suspense, lazy } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import type { Timestamp } from "firebase/firestore";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import rehypeSlug from "rehype-slug";
import rehypeSanitize from "rehype-sanitize";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CustomCursor from "../components/CustomCursor";
import Grain from "../components/Grain";
import PageTransition from "../components/PageTransition";
import TableOfContents from "../components/TableOfContents";
import { ArrowLeft, Clock, Tag, Share2, Twitter, Linkedin, Link as LinkIcon, Copy, Check, ArrowUp, Mail, BadgeCheck } from "lucide-react";
import { useStructuredData } from "../hooks/useStructuredData";
import { useReadingProgress } from "../hooks/useReadingProgress";
import { stripAndTruncate } from "../lib/utils";
import { OptimizedImage } from "../components/OptimizedImage";
import PostReactions from "../components/PostReactions";
import { getCachedPromise } from "../utils/suspenseCache";
import { prefetchBlogPost } from "../utils/cache";
import { localBlogPosts } from "../data/blogPosts";

// Lazy load syntax highlighter to improve performance
const SyntaxHighlighter = lazy(() => import('react-syntax-highlighter').then(module => ({ default: module.Prism })));
const vscDarkPlusPromise = import('react-syntax-highlighter/dist/esm/styles/prism').then(module => module.vscDarkPlus);

const CodeBlock = ({ node, inline, className, children, ...props }: any) => {
  const [copied, setCopied] = useState(false);
  const [style, setStyle] = useState<any>(null);
  const match = /language-(\w+)/.exec(className || '');
  const codeString = String(children).replace(/\n$/, '');

  useEffect(() => {
    if (!inline && match) {
      vscDarkPlusPromise.then(setStyle);
    }
  }, [inline, match]);

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
        <Suspense fallback={<div className="p-4 bg-black/50 rounded-xl border border-white/10 text-white/40 font-mono text-sm">Loading code...</div>}>
          {style && (
            <SyntaxHighlighter
              {...props}
              children={codeString}
              style={style}
              language={match[1]}
              PreTag="div"
              className="rounded-xl border border-white/10 !bg-black/50 !m-0"
            />
          )}
        </Suspense>
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

const fetchPostData = async (slug: string, previewToken: string | null) => {
  const localPost = localBlogPosts.find(p => p.slug === slug);
  
  const { collection, query, where, getDocs, orderBy, limit } = await import("firebase/firestore");
  const { db } = await import("../firebase");

  let currentPost: Post | null = null;

  if (localPost) {
    currentPost = localPost as unknown as Post;
  } else {
    let q;
    if (previewToken) {
      q = query(collection(db, "posts"), where("slug", "==", slug), where("previewToken", "==", previewToken));
    } else {
      q = query(collection(db, "posts"), where("slug", "==", slug), where("published", "==", true));
    }
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      currentPost = { id: snapshot.docs[0].id, ...(snapshot.docs[0].data() as any) } as Post;
    }
  }

  if (!currentPost) {
    return { post: null, relatedPosts: [] };
  }

  // Increment view count (only if not preview mode and not viewed in this session)
  if (!previewToken && !localPost) {
    const viewedKey = `viewed_${currentPost.id}`;
    if (typeof window !== 'undefined' && !localStorage.getItem(viewedKey)) {
      try {
        await fetch(`/api/views/${currentPost.id}`, { method: 'POST' });
        localStorage.setItem(viewedKey, 'true');
      } catch (e) {
        console.error("Error updating views:", e);
      }
    }
  }

  // Fetch related posts
  const relatedQ = query(
    collection(db, "posts"), 
    where("published", "==", true),
    orderBy("createdAt", "desc"),
    limit(4)
  );
  const relatedSnapshot = await getDocs(relatedQ);
  const related = relatedSnapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() } as Post))
    .filter(p => p.id !== currentPost?.id)
    .slice(0, 3);

  // If no related posts from Firestore, use local posts
  if (related.length === 0) {
    const localRelated = localBlogPosts.filter(p => p.id !== currentPost?.id).slice(0, 3);
    related.push(...(localRelated as unknown as Post[]));
  }

  return { post: currentPost, relatedPosts: related };
};

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { pathname, search } = useLocation();
  const previewToken = new URLSearchParams(search).get("preview");

  const postDataPromise = getCachedPromise(`post-${slug}-${previewToken || 'published'}`, () => fetchPostData(slug || '', previewToken));
  const { post, relatedPosts } = use(postDataPromise);

  const [showScrollTop, setShowScrollTop] = useState(false);
  const scrollProgress = useReadingProgress();
  const [selectedText, setSelectedText] = useState("");
  const [selectionPosition, setSelectionPosition] = useState({ x: 0, y: 0 });
  const articleRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      setShowScrollTop(totalScroll > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed || !articleRef.current) {
        setSelectedText("");
        return;
      }

      // Check if selection is inside the article
      if (articleRef.current.contains(selection.anchorNode)) {
        const text = selection.toString().trim();
        if (text.length > 0) {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          setSelectedText(text);
          setSelectionPosition({
            x: rect.left + rect.width / 2,
            y: rect.top - 10
          });
        }
      } else {
        setSelectedText("");
      }
    };

    document.addEventListener("selectionchange", handleSelection);
    return () => document.removeEventListener("selectionchange", handleSelection);
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

  useStructuredData(post ? [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://tghabib.com/blog/${post.slug}`
      },
      "headline": post.seoTitle || post.title,
      "description": post.seoDescription || post.excerpt || stripAndTruncate(post.content),
      "datePublished": post.createdAt?.toDate?.().toISOString() ?? '',
      "dateModified": post.createdAt?.toDate?.().toISOString() ?? '',
      "author": { 
        "@type": "Person", 
        "name": "TG Habib",
        "url": "https://tghabib.com"
      },
      "publisher": {
        "@type": "Organization",
        "name": "TG Habib",
        "logo": {
          "@type": "ImageObject",
          "url": "https://raw.githubusercontent.com/itsGods/Personal/refs/heads/main/file_0000000038e47208a7c7e84e80a5026d.png"
        }
      },
      "image": post.coverImage ? [post.coverImage.startsWith('http') ? post.coverImage : `https://tghabib.com${post.coverImage}`] : [],
      "url": `https://tghabib.com/blog/${post.slug}`,
      "keywords": post.tags?.join(", ") || "",
      "wordCount": post.content ? post.content.split(/\s+/).length : 0,
      "inLanguage": "en-US",
      "isAccessibleForFree": "True"
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

  // Use explicit SEO fields if available, otherwise fallback
  const metaTitle = post.seoTitle || `${post.title} | Habib Dev Blog`;
  const metaDescription = post.seoDescription || post.excerpt || stripAndTruncate(post.content);
  
  // Ensure canonical URL always points to the primary domain to avoid duplicate content
  const canonicalUrl = `https://tghabib.com/blog/${post.slug}`;

  return (
    <PageTransition>
      <main className="relative min-h-screen bg-brand-black text-brand-light selection:bg-brand-orange selection:text-white md:cursor-none flex flex-col">
        <Helmet>
          <title>{metaTitle}</title>
          <meta name="description" content={metaDescription} />
          {post.tags && post.tags.length > 0 && (
            <meta name="keywords" content={post.tags.join(", ")} />
          )}
          <link rel="canonical" href={canonicalUrl} />
          {previewToken && <meta name="robots" content="noindex, nofollow" />}
          
          {/* Open Graph / Facebook */}
          <meta property="og:type" content="article" />
          <meta property="og:url" content={canonicalUrl} />
          <meta property="og:title" content={metaTitle} />
          <meta property="og:description" content={metaDescription} />
          <meta property="og:site_name" content="TG Habib" />
          <meta property="og:locale" content="en_US" />
          {post.coverImage && <meta property="og:image" content={post.coverImage.startsWith('http') ? post.coverImage : `https://tghabib.com${post.coverImage}`} />}
          <meta property="article:published_time" content={post.createdAt?.toDate?.().toISOString() || ''} />
          <meta property="article:author" content="https://tghabib.com" />
          {post.tags?.map(tag => (
            <meta property="article:tag" content={tag} key={tag} />
          ))}

          {/* Twitter */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@tghabib" />
          <meta name="twitter:url" content={canonicalUrl} />
          <meta name="twitter:title" content={metaTitle} />
          <meta name="twitter:description" content={metaDescription} />
          {post.coverImage && <meta name="twitter:image" content={post.coverImage.startsWith('http') ? post.coverImage : `https://tghabib.com${post.coverImage}`} />}
          <meta name="twitter:creator" content="@tghabib" />
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
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-8 font-mono text-xs uppercase tracking-widest text-white/40">
            <ol className="flex items-center gap-2 flex-wrap">
              <li>
                <Link to="/" className="hover:text-brand-orange transition-colors">Home</Link>
              </li>
              <li><span className="text-white/20">/</span></li>
              <li>
                <Link to={backUrl} className="hover:text-brand-orange transition-colors">Blog</Link>
              </li>
              <li><span className="text-white/20">/</span></li>
              <li className="text-brand-orange truncate max-w-[200px] sm:max-w-[300px]" aria-current="page">
                {post.title}
              </li>
            </ol>
          </nav>

          <Link to={backUrl} className="inline-flex items-center gap-2 text-brand-orange hover:text-white transition-colors mb-12 font-mono text-xs uppercase tracking-widest">
            <ArrowLeft size={16} />
            Back to Blog
          </Link>

          {/* Share Snippet Popup */}
          {selectedText && (
            <div 
              className="fixed z-50 -translate-x-1/2 -translate-y-full pb-2 pointer-events-auto"
              style={{ left: selectionPosition.x, top: selectionPosition.y }}
            >
              <a
                href={`https://twitter.com/intent/tweet?text="${encodeURIComponent(selectedText)}" — @tghabib&url=${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-brand-orange text-black px-4 py-2 rounded-full font-bold shadow-xl hover:bg-white transition-colors"
                onMouseDown={(e) => e.preventDefault()} // Prevent losing selection
              >
                <Twitter size={16} /> Share Snippet
              </a>
            </div>
          )}

          <article ref={articleRef}>
            <header className="mb-12">
              <div className="mb-8 flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-4 bg-black/40 backdrop-blur-md pr-6 pl-2 py-2 rounded-full border border-white/10 hover:border-brand-orange/50 hover:bg-white/5 transition-all duration-300 group">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-brand-orange/20 blur-md group-hover:bg-brand-orange/40 transition-colors duration-300" />
                    <img 
                      src="https://raw.githubusercontent.com/itsGods/Personal/refs/heads/main/android-chrome-512x512.png" 
                      alt="TG Habib" 
                      loading="lazy"
                      decoding="async"
                      className="relative w-12 h-12 rounded-full border border-white/20 object-cover shadow-xl"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <div className="flex items-center gap-1.5">
                      <span className="font-display font-bold text-white text-sm tracking-wide">TG Habib</span>
                      <BadgeCheck size={14} className="text-brand-orange" />
                    </div>
                    <div className="flex items-center gap-3 text-white/50 font-mono text-[10px] sm:text-xs uppercase tracking-[0.15em] mt-0.5">
                      <time dateTime={post.createdAt?.toDate()?.toISOString()}>
                        {post.createdAt?.toDate() ? post.createdAt.toDate().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Unknown date'}
                      </time>
                      {post.readingTime && (
                        <>
                          <span className="text-white/20">•</span>
                          <span className="flex items-center gap-1 text-brand-orange/80">
                            <Clock size={12} />
                            <span>{post.readingTime} min read</span>
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
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

            <div className="prose prose-invert prose-lg md:prose-xl max-w-none prose-headings:font-display prose-headings:font-bold prose-headings:tracking-tight prose-p:font-sans prose-p:text-white/80 prose-p:leading-loose prose-a:text-brand-orange hover:prose-a:text-brand-orange/80 prose-img:rounded-2xl prose-img:shadow-2xl prose-blockquote:border-l-brand-orange prose-blockquote:bg-brand-orange/5 prose-blockquote:py-4 prose-blockquote:px-8 prose-blockquote:rounded-r-2xl prose-blockquote:not-italic prose-blockquote:text-white/90 prose-li:marker:text-brand-orange prose-strong:text-white prose-code:text-brand-orange prose-code:bg-brand-orange/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none">
              <ReactMarkdown 
                remarkPlugins={[remarkBreaks]}
                rehypePlugins={[rehypeSlug, rehypeSanitize]}
                components={{
                  code: CodeBlock,
                  img: ({ node, ...props }) => (
                    <img 
                      {...props} 
                      loading="lazy" 
                      decoding="async" 
                      className="rounded-xl w-full object-cover my-8" 
                      alt={props.alt || "Blog post image"} 
                    />
                  ),
                  a: ({ node, ...props }) => (
                    <a {...props} target="_blank" rel="noopener noreferrer" />
                  ),
                  h1: ({ node, ...props }) => <h2 {...props} /> // Prevent multiple H1s
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>

            {/* Newsletter CTA */}
            <div className="mt-16 bg-brand-orange/10 border border-brand-orange/20 rounded-2xl p-8 md:p-12 text-center">
              <Mail className="w-12 h-12 text-brand-orange mx-auto mb-6" />
              <h3 className="font-display text-3xl font-bold text-white mb-4">Level up your frontend skills.</h3>
              <p className="text-white/70 font-sans mb-8 max-w-lg mx-auto">
                Join my newsletter for deep dives into React, Framer Motion, Firebase, and building premium web experiences. No spam, just high-value technical insights.
              </p>
              <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto" onSubmit={async (e) => { 
                e.preventDefault(); 
                const form = e.target as HTMLFormElement;
                const emailInput = form.elements.namedItem('email') as HTMLInputElement;
                const email = emailInput.value;
                const button = form.querySelector('button');
                if (!email) return;
                
                if (button) {
                  button.disabled = true;
                  button.textContent = 'Joining...';
                }
                
                try {
                  const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
                  const { db } = await import('../firebase');
                  await addDoc(collection(db, "subscribers"), {
                    email,
                    createdAt: serverTimestamp()
                  });
                  if (button) {
                    button.textContent = 'Subscribed!';
                    button.classList.add('bg-white', 'text-brand-orange');
                  }
                  emailInput.value = '';
                } catch (error) {
                  console.error("Error subscribing:", error);
                  if (button) {
                    button.disabled = false;
                    button.textContent = 'Error. Try again';
                  }
                }
              }}>
                <input 
                  type="email" 
                  name="email"
                  placeholder="Enter your email" 
                  required
                  className="flex-1 bg-black/50 border border-white/10 rounded-full px-6 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-brand-orange transition-colors"
                />
                <button 
                  type="submit"
                  className="bg-brand-orange text-black font-bold px-8 py-3 rounded-full hover:bg-white transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Subscribe
                </button>
              </form>
            </div>

            {/* Share & Author Section */}
            <div className="mt-16 pt-12 border-t border-white/10 flex flex-col gap-12">
              {/* Author Profile */}
              <div className="relative overflow-hidden rounded-3xl bg-black/40 backdrop-blur-xl border border-white/10 p-8 sm:p-10 group hover:border-brand-orange/30 transition-all duration-500">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 group-hover:bg-brand-orange/20 transition-colors duration-700 pointer-events-none" />
                
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 relative z-10">
                  <div className="relative shrink-0">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-brand-orange to-transparent opacity-20 blur-lg group-hover:opacity-40 transition-opacity duration-500" />
                    <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full p-1 bg-gradient-to-br from-white/20 to-white/5 relative z-10">
                      <img 
                        src="https://raw.githubusercontent.com/itsGods/Personal/refs/heads/main/android-chrome-512x512.png" 
                        alt="TG Habib" 
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full rounded-full object-cover border-4 border-black"
                      />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-brand-orange text-black p-2 rounded-full border-4 border-black z-20 shadow-xl">
                      <BadgeCheck size={20} className="fill-black text-brand-orange" />
                    </div>
                  </div>
                  
                  <div className="flex-1 text-center sm:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono uppercase tracking-[0.2em] text-white/60 mb-4">
                      <span>Written By</span>
                    </div>
                    <h3 className="font-display text-3xl sm:text-4xl font-bold text-white mb-2 tracking-tight">
                      TG Habib
                    </h3>
                    <p className="text-brand-orange font-mono text-xs uppercase tracking-widest mb-4">
                      Premium Digital Engineer
                    </p>
                    <p className="text-base sm:text-lg text-white/60 font-sans mb-8 leading-relaxed max-w-2xl">
                      I specialize in building high-performance, cinematic web applications that drive conversion and elevate brand perception. Turning complex problems into elegant digital experiences.
                    </p>
                    
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
                      <a 
                        href="https://twitter.com/tghabib" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="group/btn inline-flex items-center gap-2 text-sm font-bold text-black bg-brand-orange px-6 py-3 rounded-full hover:bg-white transition-all duration-300 shadow-[0_0_20px_rgba(242,125,38,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]"
                      >
                        <Twitter size={16} className="group-hover/btn:-rotate-12 transition-transform" /> 
                        Follow on X
                      </a>
                      <a 
                        href="https://github.com/itsGods" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center gap-2 text-sm font-bold text-white bg-white/5 px-6 py-3 rounded-full border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                      >
                        GitHub Profile
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Share & Reactions */}
              <div className="flex flex-col md:flex-row justify-between items-center gap-8 bg-white/5 p-6 rounded-2xl border border-white/5">
                <div className="flex items-center gap-4">
                  <span className="font-mono text-xs uppercase tracking-widest text-white/60 flex items-center gap-2">
                    <Share2 size={16} /> Share Article
                  </span>
                  <div className="flex items-center gap-2">
                    <a href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 hover:bg-[#1DA1F2] hover:text-white rounded-full transition-all text-white/60 hover:scale-110">
                      <Twitter size={18} />
                    </a>
                    <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${shareTitle}`} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 hover:bg-[#0A66C2] hover:text-white rounded-full transition-all text-white/60 hover:scale-110">
                      <Linkedin size={18} />
                    </a>
                    <button onClick={handleCopyLink} className="p-3 bg-white/5 hover:bg-brand-orange hover:text-white rounded-full transition-all text-white/60 hover:scale-110">
                      <LinkIcon size={18} />
                    </button>
                  </div>
                </div>
                <PostReactions postId={post.id} initialReactions={post.reactions} />
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
                      onMouseEnter={() => prefetchBlogPost(relatedPost.slug)}
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
