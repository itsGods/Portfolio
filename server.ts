import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import path from "path";
import { localBlogPosts } from "./src/data/blogPosts";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Load Firebase config
  let firebaseConfig: any = {};
  try {
    const configPath = path.resolve(process.cwd(), 'firebase-applet-config.json');
    if (fs.existsSync(configPath)) {
      firebaseConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    }
  } catch (e) {
    console.error("Could not load firebase-applet-config.json", e);
  }

  const projectId = process.env.VITE_FIREBASE_PROJECT_ID || firebaseConfig.projectId;
  const databaseId = process.env.VITE_FIRESTORE_DATABASE_ID || firebaseConfig.firestoreDatabaseId || "(default)";

  // Initialize Vite once
  let vite: any;
  if (process.env.NODE_ENV !== "production") {
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
  }

  // Security & Caching Headers
  app.use((req, res, next) => {
    // Basic Security Headers
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

    // Aggressive Caching for Static Assets in Production
    if (process.env.NODE_ENV === "production" && req.url.match(/\.(css|js|png|jpg|jpeg|gif|webp|svg|woff|woff2|ttf|eot|ico)$/)) {
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    }
    next();
  });

  // robots.txt
  app.get("/robots.txt", (req, res) => {
    res.type("text/plain");
    res.send(`User-agent: *
Allow: /
Sitemap: https://tghabib.com/sitemap.xml`);
  });

  // Dynamic Sitemap Generation
  app.get("/sitemap.xml", async (req, res) => {
    try {
      const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${databaseId}/documents:runQuery`;
      
      const queryPayload = {
        structuredQuery: {
          from: [{ collectionId: "posts" }],
          where: {
            fieldFilter: {
              field: { fieldPath: "published" },
              op: "EQUAL",
              value: { booleanValue: true }
            }
          }
        }
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(queryPayload)
      });

      let dynamicUrls = "";
      
      // Add local posts
      localBlogPosts.forEach(post => {
        if (post.published) {
          const updatedAt = post.createdAt.toDate().toISOString();
          dynamicUrls += `
  <url>
    <loc>https://tghabib.com/blog/${post.slug}</loc>
    <lastmod>${updatedAt}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`;
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          data.forEach((item: any) => {
            if (item.document && item.document.fields) {
              const doc = item.document.fields;
              const slug = doc.slug?.stringValue;
              const updatedAt = doc.updatedAt?.timestampValue || new Date().toISOString();
              if (slug) {
                dynamicUrls += `
  <url>
    <loc>https://tghabib.com/blog/${slug}</loc>
    <lastmod>${updatedAt}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`;
              }
            }
          });
        }
      }

      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://tghabib.com/</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://tghabib.com/blog</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://lab.tghabib.com/</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>${dynamicUrls}
</urlset>`;

      res.header('Content-Type', 'application/xml');
      res.send(sitemap.trim());
    } catch (error) {
      console.error("Error generating sitemap:", error);
      res.status(500).send("Error generating sitemap");
    }
  });

  // RSS Feed
  app.get("/rss.xml", async (req, res) => {
    try {
      const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${databaseId}/documents:runQuery`;
      
      const queryPayload = {
        structuredQuery: {
          from: [{ collectionId: "posts" }],
          where: {
            fieldFilter: {
              field: { fieldPath: "published" },
              op: "EQUAL",
              value: { booleanValue: true }
            }
          },
          orderBy: [{ field: { fieldPath: "createdAt" }, direction: "DESCENDING" }],
          limit: 20
        }
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(queryPayload)
      });

      let rssItems = "";
      
      // Add local posts
      localBlogPosts.forEach(post => {
        if (post.published) {
          rssItems += `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>https://tghabib.com/blog/${post.slug}</link>
      <guid>https://tghabib.com/blog/${post.slug}</guid>
      <pubDate>${post.createdAt.toDate().toUTCString()}</pubDate>
      <description><![CDATA[${post.excerpt}]]></description>
    </item>`;
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          data.forEach((item: any) => {
            if (item.document && item.document.fields) {
              const doc = item.document.fields;
              const title = doc.title?.stringValue || "Untitled";
              const slug = doc.slug?.stringValue;
              const excerpt = doc.excerpt?.stringValue || "";
              const createdAt = doc.createdAt?.timestampValue || new Date().toISOString();
              
              if (slug) {
                rssItems += `
    <item>
      <title><![CDATA[${title}]]></title>
      <link>https://tghabib.com/blog/${slug}</link>
      <guid>https://tghabib.com/blog/${slug}</guid>
      <pubDate>${new Date(createdAt).toUTCString()}</pubDate>
      <description><![CDATA[${excerpt}]]></description>
    </item>`;
              }
            }
          });
        }
      }

      const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>TG Habib Blog</title>
    <link>https://tghabib.com/blog</link>
    <description>Latest articles from TG Habib</description>
    <language>en-us</language>
    <atom:link href="https://tghabib.com/rss.xml" rel="self" type="application/rss+xml" />${rssItems}
  </channel>
</rss>`;

      res.header('Content-Type', 'application/rss+xml');
      res.send(rss.trim());
    } catch (error) {
      console.error("Error generating RSS feed:", error);
      res.status(500).send("Error generating RSS feed");
    }
  });

  app.get("/api/debug", (req, res) => {
    res.json({ projectId, databaseId });
  });

  // Increment View Counter
  app.post("/api/views/:postId", async (req, res) => {
    const postId = req.params.postId;
    try {
      const commitUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${databaseId}/documents:commit`;
      
      const payload = {
        writes: [
          {
            transform: {
              document: `projects/${projectId}/databases/${databaseId}/documents/posts/${postId}`,
              fieldTransforms: [
                {
                  fieldPath: "views",
                  increment: { integerValue: "1" }
                }
              ]
            }
          }
        ]
      };

      const response = await fetch(commitUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        res.status(200).json({ success: true });
      } else {
        const errData = await response.text();
        console.error("Firestore commit error:", errData);
        res.status(500).json({ error: "Failed to update views", details: errData });
      }
    } catch (error) {
      console.error("Error updating views:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Send Newsletter
  app.post("/api/send-newsletter", express.json(), async (req, res) => {
    const { postId } = req.body;
    const authHeader = req.headers.authorization;
    
    if (!postId) {
      return res.status(400).json({ error: "Post ID is required" });
    }
    
    if (!authHeader) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const subscribersUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${databaseId}/documents/subscribers`;
      const subResponse = await fetch(subscribersUrl, {
        headers: {
          'Authorization': authHeader
        }
      });
      
      if (subResponse.ok) {
        const data = await subResponse.json();
        const subscribers = data.documents || [];
        
        // Mock sending email
        console.log(`[Newsletter] Sending email to ${subscribers.length} subscribers about post ${postId}`);
        
        res.status(200).json({ success: true, message: `Newsletter sent to ${subscribers.length} subscribers` });
      } else {
        const errData = await subResponse.text();
        console.error("Failed to fetch subscribers:", errData);
        res.status(500).json({ error: "Failed to fetch subscribers" });
      }
    } catch (error) {
      console.error("Error sending newsletter:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Intercept requests to inject SEO meta tags for ALL routes
  app.get("*", async (req, res, next) => {
    // Skip API routes and static assets
    if (req.path.startsWith("/api/") || req.path.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
      return next();
    }

    try {
      let title = "TG Habib | Vibecoder & Creative Developer";
      let description = "I am a Vibecoder & Creative Developer, blending code with cinematic aesthetics to build immersive digital experiences.";
      let coverImage = "https://raw.githubusercontent.com/itsGods/Personal/refs/heads/main/file_0000000038e47208a7c7e84e80a5026d.png";
      let canonicalUrl = `https://tghabib.com${req.path === '/' ? '' : req.path}`;
      let type = "website";
      let jsonLd: any = null;

      // 1. Handle Blog Post Route
      if (req.path.startsWith("/blog/") && req.path !== "/blog") {
        const slug = req.path.split("/")[2];
        const localPost = localBlogPosts.find(p => p.slug === slug);

        if (localPost) {
          title = localPost.seoTitle || localPost.title || "Blog Post | TG Habib";
          description = localPost.seoDescription || localPost.excerpt || "Read this amazing blog post by TG Habib.";
          coverImage = localPost.coverImage || coverImage;
          type = "article";
          
          const createdAt = localPost.createdAt?.toDate().toISOString() || new Date().toISOString();
          
          jsonLd = {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "mainEntityOfPage": { "@type": "WebPage", "@id": canonicalUrl },
            "headline": title,
            "description": description,
            "image": [coverImage],
            "author": { "@type": "Person", "name": "TG Habib", "url": "https://tghabib.com/" },
            "publisher": {
              "@type": "Organization",
              "name": "TG Habib",
              "logo": { "@type": "ImageObject", "url": "https://raw.githubusercontent.com/itsGods/Personal/refs/heads/main/file_0000000038e47208a7c7e84e80a5026d.png" }
            },
            "datePublished": createdAt,
            "dateModified": createdAt
          };
        } else {
          const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${databaseId}/documents:runQuery`;
          const queryPayload = {
            structuredQuery: {
              from: [{ collectionId: "posts" }],
              where: {
                fieldFilter: { field: { fieldPath: "slug" }, op: "EQUAL", value: { stringValue: slug } }
              },
              limit: 1
            }
          };

          const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(queryPayload)
          });

          if (response.ok) {
            const data = await response.json();
            if (data && data.length > 0 && data[0].document) {
              const doc = data[0].document.fields;
              const isPublished = doc.published?.booleanValue === true;
              const previewToken = req.query.preview;
              const docPreviewToken = doc.previewToken?.stringValue;
              
              if (isPublished || (previewToken && previewToken === docPreviewToken)) {
                title = doc.seoTitle?.stringValue || doc.title?.stringValue || "Blog Post | TG Habib";
                description = doc.seoDescription?.stringValue || doc.excerpt?.stringValue || "Read this amazing blog post by TG Habib.";
                coverImage = doc.coverImage?.stringValue || coverImage;
                type = "article";
                
                const createdAt = doc.createdAt?.timestampValue || new Date().toISOString();
                const updatedAt = doc.updatedAt?.timestampValue || createdAt;
                
                jsonLd = {
                  "@context": "https://schema.org",
                  "@type": "BlogPosting",
                  "mainEntityOfPage": { "@type": "WebPage", "@id": canonicalUrl },
                  "headline": title,
                  "description": description,
                  "image": [coverImage],
                  "author": { "@type": "Person", "name": "TG Habib", "url": "https://tghabib.com/" },
                  "publisher": {
                    "@type": "Organization",
                    "name": "TG Habib",
                    "logo": { "@type": "ImageObject", "url": "https://raw.githubusercontent.com/itsGods/Personal/refs/heads/main/file_0000000038e47208a7c7e84e80a5026d.png" }
                  },
                  "datePublished": createdAt,
                  "dateModified": updatedAt
                };
              }
            }
          }
        }
      } 
      // 2. Handle Project Case Study Route
      else if (req.path.startsWith("/project/")) {
        const slug = req.path.split("/")[2];
        // Hardcoded project data for SEO injection (matches src/data/projects.ts)
        const projectsData: Record<string, any> = {
          "solo-dev": {
            title: "Solo Dev - React & Supabase Case Study",
            description: "A full-stack personal blog site made with Vibe coding. It features a complete backend powered by Supabase for managing posts and content.",
            image: "https://res.cloudinary.com/djo33javr/image/upload/v1773247850/Google_play_store_feature_graphic_1024x500_for_a_d_delpmaspu_3_t8i8em.jpg"
          },
          "bio-link": {
            title: "Bio Link - Open Source Linktree Clone Case Study",
            description: "A completely free and easy-to-use full-stack Linktree clone. Built entirely with Vibe coding, allowing users to create and manage their personalized bio links.",
            image: "https://res.cloudinary.com/djo33javr/image/upload/v1773247852/Create_a_google_play_store_feature_graphic_1024x50_delpmaspu_ttvbcd.jpg"
          },
          "atpukur-boys": {
            title: "Atpukur Boys - Secure Messaging App Case Study",
            description: "A full-stack messaging app with powerful admin controls. It features end-to-end encryption and group messaging, built exclusively for the Atpukur gang.",
            image: "https://raw.githubusercontent.com/itsGods/Blog-asset/refs/heads/main/file_0000000040ac720b9327bdd5ddd9ae92.png"
          }
        };

        if (projectsData[slug]) {
          title = projectsData[slug].title;
          description = projectsData[slug].description;
          coverImage = projectsData[slug].image;
          type = "article";

          jsonLd = {
            "@context": "https://schema.org",
            "@type": "Article",
            "mainEntityOfPage": { "@type": "WebPage", "@id": canonicalUrl },
            "headline": title,
            "description": description,
            "image": [coverImage],
            "author": { "@type": "Person", "name": "TG Habib" }
          };
        }
      }
      // 3. Handle Blog List Route
      else if (req.path === "/blog") {
        title = "Blog | TG Habib - Engineering & Vibe Coding";
        description = "Read my latest articles on full-stack engineering, React, Next.js, and the art of vibe coding.";
      }
      // 4. Handle Lab Route
      else if (req.path === "/lab") {
        title = "Lab | TG Habib - Creative Experiments";
        description = "A collection of my creative coding experiments, WebGL sketches, and UI/UX interactions.";
      }

      // Read index.html
      let template = "";
      if (process.env.NODE_ENV !== "production") {
        template = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf-8');
      } else {
        template = fs.readFileSync(path.resolve(process.cwd(), 'dist/index.html'), 'utf-8');
      }

      // Inject meta tags by replacing existing ones
      let html = template
        .replace(/<title data-rh="true">.*?<\/title>/i, `<title data-rh="true">${title}</title>`)
        .replace(/<link data-rh="true" rel="canonical" href=".*?"\s*\/?>/i, `<link data-rh="true" rel="canonical" href="${canonicalUrl}" />`)
        .replace(/<meta data-rh="true" name="title" content=".*?"\s*\/?>/i, `<meta data-rh="true" name="title" content="${title}" />`)
        .replace(/<meta data-rh="true" name="description" content=".*?"\s*\/?>/i, `<meta data-rh="true" name="description" content="${description}" />`)
        .replace(/<meta data-rh="true" property="og:title" content=".*?"\s*\/?>/i, `<meta data-rh="true" property="og:title" content="${title}" />`)
        .replace(/<meta data-rh="true" property="og:description" content=".*?"\s*\/?>/i, `<meta data-rh="true" property="og:description" content="${description}" />`)
        .replace(/<meta data-rh="true" property="og:type" content=".*?"\s*\/?>/i, `<meta data-rh="true" property="og:type" content="${type}" />`)
        .replace(/<meta data-rh="true" property="og:url" content=".*?"\s*\/?>/i, `<meta data-rh="true" property="og:url" content="${canonicalUrl}" />`)
        .replace(/<meta data-rh="true" name="twitter:title" content=".*?"\s*\/?>/i, `<meta data-rh="true" name="twitter:title" content="${title}" />`)
        .replace(/<meta data-rh="true" name="twitter:description" content=".*?"\s*\/?>/i, `<meta data-rh="true" name="twitter:description" content="${description}" />`)
        .replace(/<meta data-rh="true" name="twitter:url" content=".*?"\s*\/?>/i, `<meta data-rh="true" name="twitter:url" content="${canonicalUrl}" />`);

      if (coverImage) {
        html = html
          .replace(/<meta data-rh="true" property="og:image" content=".*?"\s*\/?>/i, `<meta data-rh="true" property="og:image" content="${coverImage}" />`)
          .replace(/<meta data-rh="true" name="twitter:image" content=".*?"\s*\/?>/i, `<meta data-rh="true" name="twitter:image" content="${coverImage}" />`);
      }

      // Inject JSON-LD if available
      if (jsonLd) {
        html = html.replace('</head>', `  <script type="application/ld+json">\n${JSON.stringify(jsonLd, null, 2)}\n</script>\n</head>`);
      }

      // If in development, let Vite transform the HTML
      if (process.env.NODE_ENV !== "production") {
        html = await vite.transformIndexHtml(req.originalUrl, html);
      }
      
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
      return;
    } catch (error) {
      console.error("Error fetching SEO data:", error);
    }
    
    // Fallback to normal routing
    next();
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    
    // Serve static files with Cache-Control headers
    app.use(express.static(distPath, {
      setHeaders: (res, path) => {
        if (path.endsWith('.html')) {
          res.setHeader('Cache-Control', 'no-cache');
        } else if (path.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
          // Cache static assets for 1 year
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        }
      }
    }));
    
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Firebase Project ID: ${projectId}`);
    console.log(`Firebase Database ID: ${databaseId}`);
  });
}

startServer();
