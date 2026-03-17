import { Handler } from "@netlify/functions";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const handler: Handler = async () => {
  try {
    const q = query(collection(db, "posts"), where("published", "==", true));
    const snapshot = await getDocs(q);
    
    let dynamicUrls = "";
    snapshot.forEach((doc) => {
      const data = doc.data();
      const lastMod = data.updatedAt?.toDate().toISOString() || new Date().toISOString();
      dynamicUrls += `
  <url>
    <loc>https://tghabib.com/blog/${data.slug}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`;
    });

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
  </url>${dynamicUrls}
</urlset>`;

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600"
      },
      body: sitemap.trim(),
    };
  } catch (error) {
    return { statusCode: 500, body: "Error generating sitemap" };
  }
};
