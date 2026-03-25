import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import path from "path";

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

  // Intercept requests to /blog/:slug to inject SEO meta tags
  app.get("/blog/:slug", async (req, res, next) => {
    const slug = req.params.slug;
    
    try {
      // Fetch post from Firestore REST API
      const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${databaseId}/documents:runQuery`;
      
      const queryPayload = {
        structuredQuery: {
          from: [{ collectionId: "posts" }],
          where: {
            fieldFilter: {
              field: { fieldPath: "slug" },
              op: "EQUAL",
              value: { stringValue: slug }
            }
          },
          limit: 1
        }
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(queryPayload)
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0 && data[0].document) {
          const doc = data[0].document.fields;
          
          // Only show published posts unless preview token is provided
          const isPublished = doc.published?.booleanValue === true;
          const previewToken = req.query.preview;
          const docPreviewToken = doc.previewToken?.stringValue;
          
          if (isPublished || (previewToken && previewToken === docPreviewToken)) {
            const title = doc.seoTitle?.stringValue || doc.title?.stringValue || "Blog Post | TG Habib";
            const description = doc.seoDescription?.stringValue || doc.excerpt?.stringValue || "Read this amazing blog post by TG Habib.";
            const coverImage = doc.coverImage?.stringValue || "";
            const createdAt = doc.createdAt?.timestampValue || new Date().toISOString();
            const updatedAt = doc.updatedAt?.timestampValue || createdAt;
            const canonicalUrl = `https://tghabib.com/blog/${slug}`;
            
            // Read index.html
            let template = "";
            if (process.env.NODE_ENV !== "production") {
              template = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf-8');
            } else {
              template = fs.readFileSync(path.resolve(process.cwd(), 'dist/index.html'), 'utf-8');
            }

            // Generate JSON-LD Structured Data
            const jsonLd = {
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": canonicalUrl
              },
              "headline": title,
              "description": description,
              "image": coverImage ? [coverImage] : [],
              "author": {
                "@type": "Person",
                "name": "TG Habib",
                "url": "https://tghabib.com/"
              },
              "publisher": {
                "@type": "Organization",
                "name": "TG Habib",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://raw.githubusercontent.com/itsGods/Personal/refs/heads/main/file_0000000038e47208a7c7e84e80a5026d.png"
                }
              },
              "datePublished": createdAt,
              "dateModified": updatedAt
            };

            // Inject meta tags by replacing existing ones
            let html = template
              .replace(/<title>.*?<\/title>/i, `<title>${title}</title>`)
              .replace(/<link rel="canonical" href=".*?"\s*\/?>/i, '') // Remove existing canonical if any
              .replace(/<meta name="title" content=".*?"\s*\/?>/i, `<meta name="title" content="${title}" />\n    <link rel="canonical" href="${canonicalUrl}" />`)
              .replace(/<meta name="description" content=".*?"\s*\/?>/i, `<meta name="description" content="${description}" />`)
              .replace(/<meta property="og:title" content=".*?"\s*\/?>/i, `<meta property="og:title" content="${title}" />`)
              .replace(/<meta property="og:description" content=".*?"\s*\/?>/i, `<meta property="og:description" content="${description}" />`)
              .replace(/<meta property="og:type" content=".*?"\s*\/?>/i, `<meta property="og:type" content="article" />\n    <meta property="article:published_time" content="${createdAt}" />\n    <meta property="article:modified_time" content="${updatedAt}" />\n    <meta property="article:author" content="TG Habib" />`)
              .replace(/<meta property="og:url" content=".*?"\s*\/?>/i, `<meta property="og:url" content="${canonicalUrl}" />`)
              .replace(/<meta name="twitter:card" content=".*?"\s*\/?>/i, '') // Remove if exists
              .replace(/<meta property="twitter:title" content=".*?"\s*\/?>/i, `<meta name="twitter:card" content="summary_large_image" />\n    <meta property="twitter:title" content="${title}" />`)
              .replace(/<meta property="twitter:description" content=".*?"\s*\/?>/i, `<meta property="twitter:description" content="${description}" />`)
              .replace(/<meta property="twitter:url" content=".*?"\s*\/?>/i, `<meta property="twitter:url" content="${canonicalUrl}" />`);

            if (coverImage) {
              html = html
                .replace(/<meta property="og:image" content=".*?"\s*\/?>/i, `<meta property="og:image" content="${coverImage}" />`)
                .replace(/<meta property="twitter:image" content=".*?"\s*\/?>/i, `<meta property="twitter:image" content="${coverImage}" />`);
            }

            // Inject JSON-LD
            html = html.replace('</head>', `  <script type="application/ld+json">\n${JSON.stringify(jsonLd, null, 2)}\n</script>\n</head>`);

            // If in development, let Vite transform the HTML
            if (process.env.NODE_ENV !== "production") {
              html = await vite.transformIndexHtml(req.originalUrl, html);
            }
            
            res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
            return;
          }
        }
      }
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
