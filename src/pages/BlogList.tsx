import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { format } from "date-fns";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CustomCursor from "../components/CustomCursor";
import Grain from "../components/Grain";
import PageTransition from "../components/PageTransition";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  createdAt: any;
  seoTitle?: string;
  seoDescription?: string;
}

export default function BlogList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "posts"),
      where("published", "==", true),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Post[];
      setPosts(postsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching posts:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const isBlogSubdomain = window.location.hostname.startsWith('blog.');

  return (
    <PageTransition>
      <main className="relative min-h-screen bg-brand-black text-brand-light selection:bg-brand-orange selection:text-white md:cursor-none flex flex-col">
        <Helmet>
          <title>Blog | HABIB.</title>
          <meta name="description" content="Professional blog covering design, development, and technology." />
        </Helmet>
        
        <CustomCursor />
        <Grain />
        <Navbar />

        <div className="flex-1 pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto w-full">
          <div className="mb-16">
            <h1 className="font-display text-5xl font-bold tracking-tighter text-white md:text-7xl">
              Thoughts & <span className="text-brand-orange">Insights</span>
            </h1>
            <p className="mt-6 max-w-2xl font-sans text-lg text-white/60">
              A collection of my thoughts on design, development, and the future of digital experiences.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-orange border-t-transparent" />
            </div>
          ) : posts.length === 0 ? (
            <div className="py-20 text-center">
              <p className="font-mono text-sm uppercase tracking-widest text-white/40">No posts found.</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  to={isBlogSubdomain ? `/${post.slug}` : `/blog/${post.slug}`}
                  className="group relative flex flex-col gap-6 rounded-2xl bg-brand-dark p-6 transition-colors hover:bg-brand-gray"
                >
                  {post.coverImage && (
                    <div className="relative aspect-[2/1] w-full overflow-hidden rounded-xl bg-black">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="h-full w-full object-cover opacity-70 transition-transform duration-700 group-hover:scale-110 group-hover:opacity-100"
                      />
                    </div>
                  )}
                  <div className="flex flex-col flex-1">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="h-[1px] w-6 bg-brand-orange transition-all duration-500 group-hover:w-12" />
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-brand-orange">
                        {post.createdAt?.toDate ? format(post.createdAt.toDate(), "MMM dd, yyyy") : ""}
                      </p>
                    </div>
                    <h2 className="font-display text-2xl font-bold text-white mb-3 group-hover:text-brand-orange transition-colors">
                      {post.title}
                    </h2>
                    <p className="font-sans text-sm text-white/60 line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <Footer />
      </main>
    </PageTransition>
  );
}
