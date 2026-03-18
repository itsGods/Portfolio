import { useState, useEffect, useMemo } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import type { Timestamp, QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import { Clock, Tag, Search, X } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CustomCursor from "../components/CustomCursor";
import Grain from "../components/Grain";
import PageTransition from "../components/PageTransition";
import { OptimizedImage } from "../components/OptimizedImage";

import { useStructuredData } from "../hooks/useStructuredData";
import { blogCache, CACHE_TTL, prefetchBlogPost } from "../utils/cache";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  createdAt: Timestamp | null;
  seoTitle?: string;
  seoDescription?: string;
  tags?: string[];
  readingTime?: number;
}

export default function BlogList() {
  const [posts, setPosts] = useState<Post[]>(blogCache.posts);
  const [allTags, setAllTags] = useState<string[]>(blogCache.allTags);
  const [loading, setLoading] = useState(blogCache.posts.length === 0);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(blogCache.lastVisible);
  const [hasMore, setHasMore] = useState(blogCache.hasMore);
  const [loadingMore, setLoadingMore] = useState(false);
  const { pathname } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const searchQuery = searchParams.get("q") || "";
  const selectedTag = searchParams.get("tag") || "";

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value) {
      searchParams.set("q", value);
    } else {
      searchParams.delete("q");
    }
    setSearchParams(searchParams);
  };

  const handleTagClick = (tag: string) => {
    if (selectedTag === tag) {
      searchParams.delete("tag");
    } else {
      searchParams.set("tag", tag);
    }
    setSearchParams(searchParams);
  };

  const clearFilters = () => {
    searchParams.delete("q");
    searchParams.delete("tag");
    setSearchParams(searchParams);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      const now = Date.now();
      if (blogCache.posts.length > 0 && now - blogCache.lastFetched < CACHE_TTL) {
        setLoading(false);
        return;
      }

      try {
        const { collection, query, where, orderBy, limit, getDocs } = await import("firebase/firestore");
        const { db } = await import("../firebase");

        const q = query(
          collection(db, "posts"),
          where("published", "==", true),
          orderBy("createdAt", "desc"),
          limit(9)
        );

        const snapshot = await getDocs(q);
        const postsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Post[];
        
        // Extract unique tags
        const tags = new Set<string>();
        postsData.forEach(post => {
          if (post.tags) {
            post.tags.forEach(tag => tags.add(tag));
          }
        });
        
        const sortedTags = Array.from(tags).sort();
        const lastDoc = snapshot.docs[snapshot.docs.length - 1] || null;
        const more = snapshot.docs.length === 9;

        setAllTags(sortedTags);
        setPosts(postsData);
        setLastVisible(lastDoc);
        setHasMore(more);
        setLoading(false);

        // Update Cache
        blogCache.posts = postsData;
        blogCache.allTags = sortedTags;
        blogCache.lastVisible = lastDoc;
        blogCache.hasMore = more;
        blogCache.lastFetched = now;
      } catch (error) {
        console.error("Error fetching posts:", error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const loadMore = async () => {
    if (!lastVisible) return;
    setLoadingMore(true);
    try {
      const { collection, query, where, orderBy, limit, startAfter, getDocs } = await import("firebase/firestore");
      const { db } = await import("../firebase");

      const q = query(
        collection(db, "posts"),
        where("published", "==", true),
        orderBy("createdAt", "desc"),
        startAfter(lastVisible),
        limit(9)
      );

      const snapshot = await getDocs(q);
      const newPosts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Post[];

      // Update tags with new posts
      const newTags = new Set(allTags);
      newPosts.forEach(post => {
        if (post.tags) {
          post.tags.forEach(tag => newTags.add(tag));
        }
      });
      
      const sortedTags = Array.from(newTags).sort();
      const lastDoc = snapshot.docs[snapshot.docs.length - 1] || null;
      const more = snapshot.docs.length === 9;

      setAllTags(sortedTags);
      setPosts((prev) => {
        const updatedPosts = [...prev, ...newPosts];
        blogCache.posts = updatedPosts;
        return updatedPosts;
      });
      setLastVisible(lastDoc);
      setHasMore(more);

      // Update Cache
      blogCache.allTags = sortedTags;
      blogCache.lastVisible = lastDoc;
      blogCache.hasMore = more;
    } catch (error) {
      console.error("Error fetching more posts:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch = searchQuery === "" || 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
      
      const matchesTag = selectedTag === "" || 
        (post.tags && post.tags.includes(selectedTag));

      return matchesSearch && matchesTag;
    });
  }, [posts, searchQuery, selectedTag]);

  const isBlogSubdomain = window.location.hostname.startsWith('blog.');
  const canonicalUrl = "https://tghabib.com/blog";

  useStructuredData({
    "@context": "https://schema.org",
    "@type": "Blog",
    "url": canonicalUrl,
    "name": "Habib Dev Blog",
    "description": "Technical articles on React, Firebase, Vite, TypeScript, and solo development.",
    "blogPost": posts.map(post => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt,
      "url": `https://tghabib.com/blog/${post.slug}`
    }))
  });

  return (
    <PageTransition>
      <main className="relative min-h-screen bg-brand-black text-brand-light selection:bg-brand-orange selection:text-white md:cursor-none flex flex-col">
        <Helmet>
          <title>Dev Blog | Habib — Full-Stack Developer & Vibecoder</title>
          <meta name="description" content="Technical articles on React, Firebase, Vite, TypeScript, and solo development by Habib — a Full-Stack Developer and Vibecoder." />
          <meta name="keywords" content="Blog, React, Firebase, TypeScript, Web Development, Vibecoder, Frontend, Full-Stack" />
          <link rel="canonical" href={canonicalUrl} />
          
          {/* Open Graph / Facebook */}
          <meta property="og:type" content="website" />
          <meta property="og:url" content={canonicalUrl} />
          <meta property="og:title" content="Dev Blog | Habib — Full-Stack Developer & Vibecoder" />
          <meta property="og:description" content="Technical articles on React, Firebase, Vite, TypeScript, and solo development by Habib." />
          <meta property="og:image" content="https://raw.githubusercontent.com/itsGods/Personal/refs/heads/main/file_0000000038e47208a7c7e84e80a5026d.png" />

          {/* Twitter */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:url" content={canonicalUrl} />
          <meta name="twitter:title" content="Dev Blog | Habib — Full-Stack Developer & Vibecoder" />
          <meta name="twitter:description" content="Technical articles on React, Firebase, Vite, TypeScript, and solo development by Habib." />
          <meta name="twitter:image" content="https://raw.githubusercontent.com/itsGods/Personal/refs/heads/main/file_0000000038e47208a7c7e84e80a5026d.png" />
          <meta name="twitter:creator" content="@tghabib" />
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

          {/* Search and Filter Bar */}
          <div className="mb-12 space-y-6">
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-12 text-white placeholder:text-white/40 focus:outline-none focus:border-brand-orange transition-colors"
              />
              {searchQuery && (
                <button 
                  onClick={() => {
                    searchParams.delete("q");
                    setSearchParams(searchParams);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {allTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => handleTagClick(tag)}
                    className={`px-4 py-2 rounded-full font-mono text-xs transition-colors ${
                      selectedTag === tag 
                        ? 'bg-brand-orange text-white border border-brand-orange' 
                        : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}

            {(searchQuery || selectedTag) && (
              <div className="flex items-center gap-4 text-sm font-mono text-white/40">
                <span>Found {filteredPosts.length} result{filteredPosts.length !== 1 ? 's' : ''}</span>
                <button onClick={clearFilters} className="text-brand-orange hover:underline">Clear filters</button>
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-orange border-t-transparent" />
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="py-20 text-center">
              <p className="font-mono text-sm uppercase tracking-widest text-white/40">No posts found matching your criteria.</p>
              {(searchQuery || selectedTag) && (
                <button onClick={clearFilters} className="mt-4 text-brand-orange hover:underline font-mono text-sm">
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.map((post) => (
                <Link
                  key={post.id}
                  to={isBlogSubdomain ? `/${post.slug}` : `/blog/${post.slug}`}
                  onMouseEnter={() => prefetchBlogPost(post.slug)}
                  className="group relative flex flex-col gap-6 rounded-2xl bg-brand-dark p-6 transition-colors hover:bg-brand-gray"
                >
                  {post.coverImage && (
                    <div className="relative overflow-hidden aspect-video w-full rounded-xl bg-black">
                      <OptimizedImage
                        src={post.coverImage.replace('/images/', '/images/optimized/').replace(/\.(png|jpe?g)$/i, '.webp')}
                        webpSrc={post.coverImage.replace('/images/', '/images/optimized/').replace(/\.(png|jpe?g)$/i, '.webp')}
                        alt={post.title}
                        width={800}
                        height={450}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="w-full h-full object-cover opacity-70 transition-transform duration-700 group-hover:scale-110 group-hover:opacity-100"
                      />
                    </div>
                  )}
                  <div className="flex flex-col flex-1">
                    <div className="mb-4 flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-3">
                        <div className="h-[1px] w-6 bg-brand-orange transition-all duration-500 group-hover:w-12" />
                        <time dateTime={post.createdAt?.toDate()?.toISOString()} className="font-mono text-[10px] uppercase tracking-[0.2em] text-brand-orange">
                          {post.createdAt?.toDate() ? post.createdAt.toDate().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Unknown date'}
                        </time>
                      </div>
                      {post.readingTime && (
                        <div className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
                          <Clock size={10} />
                          <span>{post.readingTime} min read</span>
                        </div>
                      )}
                    </div>
                    <h2 className="font-display text-2xl font-bold text-white mb-3 group-hover:text-brand-orange transition-colors">
                      {post.title}
                    </h2>
                    <p className="font-sans text-sm text-white/60 line-clamp-3 mb-4 flex-1">
                      {post.excerpt}
                    </p>
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-white/5">
                        {post.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="flex items-center gap-1 px-2 py-1 bg-white/5 rounded-md text-[10px] font-mono text-white/40 group-hover:text-white/60 transition-colors">
                            <Tag size={10} /> {tag}
                          </span>
                        ))}
                        {post.tags.length > 3 && (
                          <span className="flex items-center gap-1 px-2 py-1 bg-white/5 rounded-md text-[10px] font-mono text-white/40">
                            +{post.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}

          {hasMore && !searchQuery && !selectedTag && (
            <div className="mt-16 flex justify-center">
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border border-white/20 bg-transparent px-8 py-4 font-mono text-sm uppercase tracking-widest text-white transition-all hover:border-brand-orange disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="relative z-10 transition-colors group-hover:text-black">
                  {loadingMore ? "Loading..." : "Load More Articles"}
                </span>
                <div className="absolute inset-0 -z-0 h-full w-full translate-y-full bg-brand-orange transition-transform duration-500 ease-[0.16,1,0.3,1] group-hover:translate-y-0" />
              </button>
            </div>
          )}
        </div>

        <Footer />
      </main>
    </PageTransition>
  );
}
