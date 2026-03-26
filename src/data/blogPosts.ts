import { Timestamp } from "firebase/firestore";

export interface LocalBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  createdAt: Timestamp;
  seoTitle: string;
  seoDescription: string;
  tags: string[];
  readingTime: number;
  published: boolean;
}

const createTimestamp = (dateString: string) => Timestamp.fromDate(new Date(dateString));

export const localBlogPosts: LocalBlogPost[] = [
  {
    id: "local-1",
    title: "How to Build a Bio Link App Clone from Scratch",
    slug: "how-to-build-bio-link-app",
    excerpt: "A comprehensive guide on building a high-performance, full-stack Linktree alternative using React, Node.js, and Firebase.",
    coverImage: "https://res.cloudinary.com/djo33javr/image/upload/v1773247852/Create_a_google_play_store_feature_graphic_1024x50_delpmaspu_ttvbcd.jpg",
    createdAt: createTimestamp("2026-03-20T10:00:00Z"),
    seoTitle: "How to Build a Bio Link App Clone (React & Firebase Tutorial)",
    seoDescription: "Learn how to build a free, high-performance Linktree clone from scratch using React, Node.js, and Firebase. Step-by-step full-stack tutorial.",
    tags: ["React", "Firebase", "Tutorial", "Full Stack"],
    readingTime: 8,
    published: true,
    content: `
## The Rise of Bio Link Applications

In the creator economy, having a single, unified landing page is essential. While platforms like Linktree dominate the market, building your own **Bio Link App** gives you complete control over your data, design, and monetization. 

In this comprehensive guide, I'll walk you through the architecture and implementation details of building a production-grade bio link application. You can see the final result in my [Bio Link Project Case Study](/project/bio-link).

### 1. Architectural Decisions

When designing a bio link app, performance and real-time updates are critical. Here is the tech stack I chose:

*   **Frontend:** React (Vite) for a snappy, component-driven UI.
*   **Backend/Database:** Firebase Firestore for real-time data synchronization.
*   **Styling:** Tailwind CSS for rapid, responsive design.
*   **Hosting:** Vercel or Firebase Hosting for edge caching.

### 2. Database Schema Design

Using a NoSQL database like Firestore allows for flexible schema design. Our primary collection is \`users\`, and each user document contains their profile information and an array of links.

\`\`\`typescript
interface UserProfile {
  uid: string;
  username: string; // Used for the custom URL (e.g., biolink.us.cc/username)
  displayName: string;
  bio: string;
  avatarUrl: string;
  theme: 'light' | 'dark' | 'custom';
  links: BioLink[];
}

interface BioLink {
  id: string;
  title: string;
  url: string;
  isActive: boolean;
  order: number;
}
\`\`\`

### 3. Implementing Real-Time Previews

One of the most engaging features of a bio link builder is the real-time preview. As the user edits their links on the left side of the screen, the mobile mockup on the right should update instantly.

By leveraging Firestore's \`onSnapshot\` listener, we can bind our React state directly to the database. When a user updates a link, the change is optimistically rendered and synced to the cloud, triggering an update on the preview component.

### 4. Drag and Drop Functionality

To allow users to reorder their links, we implement a drag-and-drop interface. Libraries like \`dnd-kit\` or \`react-beautiful-dnd\` are perfect for this. When a drag operation ends, we update the \`order\` property of the affected links and perform a batch write to Firestore.

### 5. Performance Optimization

Bio link pages must load instantly, especially on mobile networks. 
*   **Image Optimization:** Serve avatars via a CDN with automatic WebP conversion.
*   **Code Splitting:** Ensure the public-facing profile page is decoupled from the heavy admin dashboard bundle.
*   **Caching:** Use aggressive Cache-Control headers for static assets.

### Conclusion

Building a bio link app is a fantastic full-stack project that touches on real-time data, complex UI interactions, and performance optimization. If you're interested in more developer tools, check out my curated [Free API List for Developers](/blog/free-api-list-for-developers) or dive into the world of [Vibe Coding Tools](/blog/vibe-coding-tools) to speed up your workflow.
    `
  },
  {
    id: "local-2",
    title: "The Ultimate Free API List for Developers in 2026",
    slug: "free-api-list-for-developers",
    excerpt: "A curated list of the best free APIs for your next side project, covering weather, finance, machine learning, and more.",
    coverImage: "https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?q=80&w=2089&auto=format&fit=crop",
    createdAt: createTimestamp("2026-03-22T10:00:00Z"),
    seoTitle: "Best Free API List for Developers (2026 Update)",
    seoDescription: "Discover the ultimate curated list of free APIs for developers. Build your next React, Node.js, or Python project without spending a dime.",
    tags: ["API", "Resources", "Development"],
    readingTime: 6,
    published: true,
    content: `
## Why Use Free APIs?

When building side projects, hackathon prototypes, or portfolio pieces, you rarely want to pay for data. Fortunately, the internet is full of generous platforms offering robust free tiers. 

In this post, I've compiled the ultimate list of free APIs you can use to build your next big idea. I frequently use these APIs when experimenting in my [Creative Lab](/lab) or when building apps like my [Solo Dev Blog Platform](/project/solo-dev).

### 1. Data & Utility APIs

*   **JSONPlaceholder:** The holy grail for frontend developers. It provides fake REST API endpoints for posts, comments, and users. Perfect for testing UI components.
*   **OpenWeatherMap:** Offers a generous free tier for current weather data, forecasts, and historical data. Essential for any dashboard project.
*   **REST Countries:** Get information about countries via a RESTful API. Includes data on population, borders, and flags.

### 2. Machine Learning & AI

With the rise of AI, integrating intelligence into your apps has never been easier. If you are interested in how AI is changing development, read my thoughts on [Vibe Coding Tools](/blog/vibe-coding-tools).

*   **Hugging Face Inference API:** Access thousands of pre-trained models for text classification, image generation, and translation for free.
*   **Google Gemini API:** Google offers a highly capable free tier for their Gemini models, perfect for text generation and multimodal tasks.

### 3. Finance & Crypto

*   **CoinGecko API:** The most comprehensive free cryptocurrency API. Get live prices, historical charts, and market data without an API key.
*   **Alpha Vantage:** Provides free APIs for real-time and historical stock market data, forex, and cryptocurrencies.

### 4. Entertainment & Media

*   **The Movie Database (TMDB):** A fantastic, community-built movie and TV database. Their API is free and incredibly detailed.
*   **PokeAPI:** The RESTful Pokémon API. A classic choice for learning how to consume APIs and build Pokedex applications.

### How to Secure Your API Keys

Even when using free APIs, you must protect your keys. Never commit them to public repositories. Always use environment variables (\`.env\`) and proxy your requests through a backend server if the API doesn't support CORS or requires a secret key.

For an example of a secure backend implementation, check out the architecture of my [Atpukur Boys Messaging App](/project/atpukur-boys).
    `
  },
  {
    id: "local-3",
    title: "Vibe Coding: The Future of AI-Assisted Development",
    slug: "vibe-coding-tools",
    excerpt: "Exploring the paradigm shift of 'Vibe Coding'—how AI tools are changing the way we write, architect, and think about software.",
    coverImage: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2065&auto=format&fit=crop",
    createdAt: createTimestamp("2026-03-25T10:00:00Z"),
    seoTitle: "What is Vibe Coding? Best Tools & Workflows for Developers",
    seoDescription: "Learn about Vibe Coding, the new AI-assisted development paradigm. Discover the best tools, workflows, and how it accelerates full-stack engineering.",
    tags: ["AI", "Vibe Coding", "Productivity"],
    readingTime: 7,
    published: true,
    content: `
## What is Vibe Coding?

"Vibe Coding" is a term that has rapidly gained traction in the developer community. It describes a state of flow where a developer works in tandem with advanced AI models to architect, write, and debug code at unprecedented speeds. Instead of getting bogged down in syntax and boilerplate, you focus on the *vibe*—the architecture, the user experience, and the business logic.

I heavily utilized vibe coding principles when building my [Solo Dev Blog Platform](/project/solo-dev) and the [Bio Link App](/project/bio-link).

### The Core Philosophy

Vibe coding isn't about letting AI do all the work; it's about **AI as an exoskeleton**. 

1.  **High-Level Direction:** You provide the architectural vision and prompt the AI with context.
2.  **Rapid Iteration:** The AI generates the boilerplate, complex algorithms, or CSS layouts.
3.  **Human Curation:** You review, refine, and integrate the generated code, ensuring it meets security and performance standards.

### Essential Vibe Coding Tools

To achieve this state of flow, you need the right environment. Here are the tools defining the vibe coding era:

*   **Cursor / Windsurf:** These AI-first IDEs are game-changers. They understand your entire codebase, allowing you to ask questions like "Where is the authentication bug?" or "Refactor this component to use Tailwind."
*   **GitHub Copilot (Enterprise):** The standard for inline autocomplete. It predicts your next lines of code with eerie accuracy.
*   **Claude 3.5 Sonnet & Gemini 1.5 Pro:** These frontier models have massive context windows, allowing you to paste entire documentation pages or multiple files for deep architectural analysis.

### The Shift in Developer Skills

As vibe coding becomes the norm, the skills required to be a senior engineer are shifting. Memorizing syntax is less important than:

*   **Prompt Engineering:** Knowing how to ask the right questions and provide the right context.
*   **Code Review & Auditing:** The ability to quickly read and verify AI-generated code for security flaws.
*   **Systems Architecture:** Understanding how different pieces of a full-stack application fit together.

### Conclusion

Vibe coding is not a fad; it's the new baseline for developer productivity. By embracing these tools, you can build faster and focus on what truly matters: solving user problems. 

If you're looking for projects to practice your vibe coding skills, try integrating some endpoints from my [Free API List for Developers](/blog/free-api-list-for-developers).
    `
  }
];
