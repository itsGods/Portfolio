import { Context } from "@netlify/edge-functions";

export default async (request: Request, context: Context) => {
  const url = new URL(request.url);
  
  // Only intercept /blog/:slug
  if (!url.pathname.startsWith('/blog/') || url.pathname === '/blog' || url.pathname === '/blog/') {
    return;
  }

  const slug = url.pathname.split('/').pop();
  if (!slug) return;

  try {
    // Get the static HTML page
    const response = await context.next();
    if (!response.ok) return response;
    
    // Make sure it's HTML
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("text/html")) {
      return response;
    }

    const html = await response.text();

    // Generate a random nonce for CSP
    const nonce = crypto.randomUUID().replace(/-/g, '').slice(0, 16);
    
    // Inject nonce into script tags
    let modifiedHtml = html.replace(/<script /g, `<script nonce="${nonce}" `);

    // Add CSP header
    const cspHeader = `default-src 'self'; script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://firestore.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com; frame-src 'self' https://www.google.com/recaptcha/ https://recaptcha.net/;`;

    // Fetch post from Firestore REST API
    // We need the project ID and database ID from environment variables
    // @ts-ignore
    const projectId = Deno.env.get("VITE_FIREBASE_PROJECT_ID") || "gen-lang-client-0251371539";
    // @ts-ignore
    const databaseId = Deno.env.get("VITE_FIRESTORE_DATABASE_ID") || "ai-studio-9b8a817a-c0b3-4eb6-a24e-ec5bd5bb6427";
    
    const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${databaseId}/documents:runQuery`;
    
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

    const dbResponse = await fetch(firestoreUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(queryPayload)
    });

    if (dbResponse.ok) {
      const data = await dbResponse.json();
      if (data && data.length > 0 && data[0].document) {
        const doc = data[0].document.fields;
        
        const isPublished = doc.published?.booleanValue === true;
        const previewToken = url.searchParams.get("preview");
        const docPreviewToken = doc.previewToken?.stringValue;
        
        if (isPublished || (previewToken && previewToken === docPreviewToken)) {
          const title = doc.seoTitle?.stringValue || doc.title?.stringValue || "Blog Post | TG Habib";
          const description = doc.seoDescription?.stringValue || doc.excerpt?.stringValue || "Read this amazing blog post by TG Habib.";
          let coverImage = doc.coverImage?.stringValue || "";
          if (coverImage && coverImage.startsWith('/')) {
            coverImage = `https://tghabib.com${coverImage}`;
          }
          const createdAt = doc.createdAt?.timestampValue || new Date().toISOString();
          const updatedAt = doc.updatedAt?.timestampValue || createdAt;
          const canonicalUrl = `https://tghabib.com/blog/${slug}`;
          
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
          modifiedHtml = modifiedHtml
            .replace(/<title>.*?<\/title>/i, `<title>${title}</title>`)
            .replace(/<link rel="canonical" href=".*?"\s*\/?>/i, '')
            .replace(/<meta name="title" content=".*?"\s*\/?>/i, `<meta name="title" content="${title}" />\n    <link rel="canonical" href="${canonicalUrl}" />`)
            .replace(/<meta name="description" content=".*?"\s*\/?>/i, `<meta name="description" content="${description}" />`)
            .replace(/<meta property="og:title" content=".*?"\s*\/?>/i, `<meta property="og:title" content="${title}" />`)
            .replace(/<meta property="og:description" content=".*?"\s*\/?>/i, `<meta property="og:description" content="${description}" />`)
            .replace(/<meta property="og:type" content=".*?"\s*\/?>/i, `<meta property="og:type" content="article" />`)
            .replace(/<meta property="og:url" content=".*?"\s*\/?>/i, `<meta property="og:url" content="${canonicalUrl}" />`)
            .replace(/<meta name="twitter:title" content=".*?"\s*\/?>/i, `<meta name="twitter:title" content="${title}" />`)
            .replace(/<meta name="twitter:description" content=".*?"\s*\/?>/i, `<meta name="twitter:description" content="${description}" />`)
            .replace(/<meta name="twitter:url" content=".*?"\s*\/?>/i, `<meta name="twitter:url" content="${canonicalUrl}" />`);

          if (coverImage) {
            modifiedHtml = modifiedHtml
              .replace(/<meta property="og:image" content=".*?"\s*\/?>/i, `<meta property="og:image" content="${coverImage}" />`)
              .replace(/<meta name="twitter:image" content=".*?"\s*\/?>/i, `<meta name="twitter:image" content="${coverImage}" />`);
          }

          // Inject JSON-LD
          modifiedHtml = modifiedHtml.replace('</head>', `  <script type="application/ld+json">\n${JSON.stringify(jsonLd, null, 2)}\n</script>\n</head>`);

          return new Response(modifiedHtml, {
            headers: {
              "content-type": "text/html;charset=UTF-8",
              "Content-Security-Policy": cspHeader
            },
          });
        }
      }
    }
    
    return new Response(modifiedHtml, {
      headers: {
        "content-type": "text/html;charset=UTF-8",
        "Content-Security-Policy": cspHeader
      },
    });
  } catch (error) {
    console.error("Error in Edge Function:", error);
    return;
  }
};
