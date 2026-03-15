import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import rehypeSlug from "rehype-slug";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CustomCursor from "../components/CustomCursor";
import Grain from "../components/Grain";
import TableOfContents from "../components/TableOfContents";
import { ArrowLeft } from "lucide-react";

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage: string;
  createdAt: any;
  seoTitle?: string;
  seoDescription?: string;
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      try {
        const q = query(collection(db, "posts"), where("slug", "==", slug), where("published", "==", true));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          setPost({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Post);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

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

  return (
    <main className="relative min-h-screen bg-brand-black text-brand-light selection:bg-brand-orange selection:text-white md:cursor-none flex flex-col">
      <Helmet>
        <title>{post.seoTitle || post.title} | HABIB.</title>
        <meta name="description" content={post.seoDescription || post.excerpt} />
        <link rel="canonical" href={`https://tghabib.com/blog/${post.slug}`} />
        <meta property="og:title" content={post.seoTitle || post.title} />
        <meta property="og:description" content={post.seoDescription || post.excerpt} />
        <meta property="og:url" content={`https://tghabib.com/blog/${post.slug}`} />
        <meta property="og:type" content="article" />
        {post.coverImage && <meta property="og:image" content={post.coverImage} />}
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      
      <CustomCursor />
      <Grain />
      <Navbar />
      <TableOfContents content={post.content} />

      <div className="flex-1 pt-32 pb-24 px-6 md:px-12 max-w-4xl mx-auto w-full">
        <Link to={backUrl} className="inline-flex items-center gap-2 text-brand-orange hover:text-white transition-colors mb-12 font-mono text-xs uppercase tracking-widest">
          <ArrowLeft size={16} />
          Back to Blog
        </Link>

        <article>
          <header className="mb-12">
            <div className="mb-6 flex items-center gap-4">
              <div className="h-[1px] w-12 bg-brand-orange" />
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand-orange">
                {post.createdAt?.toDate ? format(post.createdAt.toDate(), "MMMM dd, yyyy") : ""}
              </p>
            </div>
            <h1 className="font-display text-4xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl mb-6">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="text-xl text-white/60 font-sans leading-relaxed">
                {post.excerpt}
              </p>
            )}
          </header>

          {post.coverImage && (
            <div className="relative aspect-[2/1] w-full overflow-hidden rounded-2xl bg-brand-dark mb-16">
              <img
                src={post.coverImage}
                alt={post.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <div className="prose prose-invert prose-lg max-w-none prose-headings:font-display prose-headings:font-bold prose-p:font-sans prose-p:text-white/80 prose-a:text-brand-orange hover:prose-a:text-brand-orange/80 prose-img:rounded-xl">
            <ReactMarkdown rehypePlugins={[rehypeSlug]}>{post.content}</ReactMarkdown>
          </div>
        </article>
      </div>

      <Footer />
    </main>
  );
}
