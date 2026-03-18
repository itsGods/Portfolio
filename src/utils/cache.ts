export const blogCache = {
  posts: [] as any[],
  lastVisible: null as any,
  hasMore: true,
  allTags: [] as string[],
  postDetails: {} as Record<string, any>,
  lastFetched: 0,
};

export const CACHE_TTL = 1000 * 60 * 5; // 5 minutes

export function clearCache() {
  blogCache.posts = [];
  blogCache.lastVisible = null;
  blogCache.hasMore = true;
  blogCache.allTags = [];
  blogCache.postDetails = {};
  blogCache.lastFetched = 0;
}

export async function prefetchBlogPost(slug: string) {
  if (blogCache.postDetails[slug]) {
    return;
  }

  try {
    const { collection, query, where, getDocs } = await import("firebase/firestore");
    const { db } = await import("../firebase");

    const q = query(collection(db, "posts"), where("slug", "==", slug), where("published", "==", true));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      const currentPost = { id: snapshot.docs[0].id, ...(snapshot.docs[0].data() as any) };
      blogCache.postDetails[slug] = currentPost;
    }
  } catch (error) {
    console.error(`Error prefetching post ${slug}:`, error);
  }
}

export async function prefetchBlogPosts() {
  const now = Date.now();
  if (blogCache.posts.length > 0 && now - blogCache.lastFetched < CACHE_TTL) {
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
    }));
    
    // Extract unique tags
    const tags = new Set<string>();
    postsData.forEach((post: any) => {
      if (post.tags) {
        post.tags.forEach((tag: string) => tags.add(tag));
      }
    });
    
    const sortedTags = Array.from(tags).sort();
    const lastDoc = snapshot.docs[snapshot.docs.length - 1] || null;
    const more = snapshot.docs.length === 9;

    // Update Cache
    blogCache.posts = postsData;
    blogCache.allTags = sortedTags;
    blogCache.lastVisible = lastDoc;
    blogCache.hasMore = more;
    blogCache.lastFetched = now;
  } catch (error) {
    console.error("Error prefetching posts:", error);
  }
}
