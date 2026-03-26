import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import express from 'express';

const PORT = 3001;
const distPath = path.resolve(process.cwd(), 'dist');

const routes = [
  '/',
  '/blog',
  '/lab',
  '/project/solo-dev',
  '/project/bio-link',
  '/project/atpukur-boys'
];

async function serveApp() {
  const app = express();
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
  return new Promise((resolve) => {
    const server = app.listen(PORT, () => resolve(server));
  });
}

async function prerender() {
  console.log('Starting pre-rendering process...');
  const server = await serveApp();
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();

  for (const route of routes) {
    console.log(`Pre-rendering ${route}...`);
    await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: 'networkidle0' });
    
    // Wait for any animations or data fetching to settle
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const html = await page.content();
    
    const routeDir = path.join(distPath, route === '/' ? '' : route);
    if (!fs.existsSync(routeDir)) {
      fs.mkdirSync(routeDir, { recursive: true });
    }
    
    const filePath = path.join(routeDir, 'index.html');
    fs.writeFileSync(filePath, html);
    console.log(`Saved ${filePath}`);
  }

  await browser.close();
  server.close();
  console.log('Pre-rendering complete!');
}

prerender().catch(console.error);
