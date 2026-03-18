// @ts-ignore
import { NextResponse } from 'next/server';
// @ts-ignore
import type { NextRequest } from 'next/server';

export const config = {
  matcher: '/blog/:slug*',
};

export default async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  
  // Only intercept /blog/:slug
  if (!url.pathname.startsWith('/blog/') || url.pathname === '/blog' || url.pathname === '/blog/') {
    return NextResponse.next();
  }

  const slug = url.pathname.split('/').pop();
  if (!slug) return NextResponse.next();

  try {
    // Fetch the static HTML page from the origin
    const response = await fetch(request.url);
    if (!response.ok) return response;
    
    // Make sure it's HTML
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("text/html")) {
      return response;
    }

    const html = await response.text();

    // Fetch post from Firestore REST API
    const projectId = process.env.VITE_FIREBASE_PROJECT_ID || "gen-lang-client-0251371539";
    const databaseId = process.env.VITE_FIRESTORE_DATABASE_ID || "ai-studio-9b8a817a-c0b3-4eb6-a24e-ec5bd5bb6427";
    
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
          const coverImage = doc.coverImage?.stringValue || "";
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
          let modifiedHtml = html
            .replace(/<title>.*?<\/title>/i, `<title>${title}</title>`)
            .replace(/<link rel="canonical" href=".*?"\s*\/?>/i, '')
            .replace(/<meta name="title" content=".*?"\s*\/?>/i, `<meta name="title" content="${title}" />\n    <link rel="canonical" href="${canonicalUrl}" />`)
            .replace(/<meta name="description" content=".*?"\s*\/?>/i, `<meta name="description" content="${description}" />`)
            .replace(/<meta property="og:title" content=".*?"\s*\/?>/i, `<meta property="og:title" content="${title}" />`)
            .replace(/<meta property="og:description" content=".*?"\s*\/?>/i, `<meta property="og:description" content="${description}" />`)
            .replace(/<meta property="og:type" content=".*?"\s*\/?>/i, `<meta property="og:type" content="article" />`)
            .replace(/<meta property="og:url" content=".*?"\s*\/?>/i, `<meta property="og:url" content="${canonicalUrl}" />`)
            .replace(/<meta property="twitter:title" content=".*?"\s*\/?>/i, `<meta property="twitter:title" content="${title}" />`)
            .replace(/<meta property="twitter:description" content=".*?"\s*\/?>/i, `<meta property="twitter:description" content="${description}" />`)
            .replace(/<meta property="twitter:url" content=".*?"\s*\/?>/i, `<meta property="twitter:url" content="${canonicalUrl}" />`);

          if (coverImage) {
            modifiedHtml = modifiedHtml
              .replace(/<meta property="og:image" content=".*?"\s*\/?>/i, `<meta property="og:image" content="${coverImage}" />`)
              .replace(/<meta property="twitter:image" content=".*?"\s*\/?>/i, `<meta property="twitter:image" content="${coverImage}" />`);
          }

          // Inject JSON-LD
          modifiedHtml = modifiedHtml.replace('</head>', `  <script type="application/ld+json">\n${JSON.stringify(jsonLd, null, 2)}\n</script>\n</head>`);

          return new NextResponse(modifiedHtml, {
            headers: {
              "content-type": "text/html;charset=UTF-8",
            },
          });
        }
      }
    }
    
    return new NextResponse(html, {
      headers: {
        "content-type": "text/html;charset=UTF-8",
      },
    });
  } catch (error) {
    console.error("Error in Edge Middleware:", error);
    return NextResponse.next();
  }
}
