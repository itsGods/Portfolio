export interface Project {
  id: string;
  slug: string;
  title: string;
  category: string;
  year: string;
  role: string;
  image: string;
  landscapeImage?: string;
  description: string;
  techStack: string[];
  link: string;
  github?: string;
  caseStudy: {
    overview: string;
    challenge: string;
    solution: string;
    results: string[];
    features: string[];
    images: string[];
  };
}

export const projects: Project[] = [
  {
    id: "solo-dev",
    slug: "solo-dev",
    title: "Solo Dev",
    category: "Full Stack Blog",
    year: "2026",
    role: "Vibecoder",
    image: "https://res.cloudinary.com/djo33javr/image/upload/v1773247850/Google_play_store_feature_graphic_1024x500_for_a_d_delpmaspu_3_t8i8em.jpg",
    landscapeImage: "https://res.cloudinary.com/djo33javr/image/upload/v1773247850/Google_play_store_feature_graphic_1024x500_for_a_d_delpmaspu_2_hri9am.jpg",
    description: "A full-stack personal blog site made with Vibe coding. It features a complete backend powered by Supabase for managing posts and content.",
    techStack: ["React", "Supabase", "Tailwind CSS", "Framer Motion"],
    link: "https://habibul.online",
    caseStudy: {
      overview: "Solo Dev is a premium, high-performance personal blog designed for developers. It serves as a digital garden where technical insights, tutorials, and personal experiences are shared through a cinematic, distraction-free reading experience.",
      challenge: "The main challenge was building a custom CMS that felt as seamless as modern platforms like Medium or Substack, while maintaining complete ownership of the data and achieving perfect Lighthouse scores. The design needed to be dark, immersive, and highly animated without sacrificing performance.",
      solution: "I architected the platform using React for the frontend and Supabase for the backend. By leveraging Supabase's real-time capabilities and PostgreSQL, I created a robust content management system. The UI was crafted with Tailwind CSS and Framer Motion to deliver buttery-smooth page transitions and micro-interactions.",
      results: [
        "100/100 Lighthouse Performance Score",
        "Sub-second page load times globally",
        "Seamless markdown editing experience",
        "Fully responsive cinematic design"
      ],
      features: [
        "Custom Markdown Editor with live preview",
        "Real-time view counters and reactions",
        "Automated SEO metadata generation",
        "Dark mode optimized typography"
      ],
      images: [
        "https://res.cloudinary.com/djo33javr/image/upload/v1773247850/Google_play_store_feature_graphic_1024x500_for_a_d_delpmaspu_2_hri9am.jpg",
        "https://res.cloudinary.com/djo33javr/image/upload/v1773247850/Google_play_store_feature_graphic_1024x500_for_a_d_delpmaspu_3_t8i8em.jpg"
      ]
    }
  },
  {
    id: "bio-link",
    slug: "bio-link",
    title: "Bio Link",
    category: "Linktree Clone",
    year: "2026",
    role: "Vibecoder",
    image: "https://res.cloudinary.com/djo33javr/image/upload/v1773247852/Create_a_google_play_store_feature_graphic_1024x50_delpmaspu_ttvbcd.jpg",
    landscapeImage: "https://res.cloudinary.com/djo33javr/image/upload/v1773247850/Create_a_google_play_store_feature_graphic_1024x50_delpmaspu_1_sg99pr.jpg",
    description: "A completely free and easy-to-use full-stack Linktree clone. Built entirely with Vibe coding, allowing users to create and manage their personalized bio links seamlessly.",
    techStack: ["React", "Node.js", "Tailwind CSS", "Firebase"],
    link: "https://biolink.us.cc",
    caseStudy: {
      overview: "Bio Link is an open-source, highly customizable alternative to Linktree. It empowers creators to build their own personalized landing pages to aggregate their social presence, portfolios, and important links in one beautiful, responsive interface.",
      challenge: "Existing link-in-bio tools often lock essential customization features behind paywalls. The goal was to build a completely free platform that offered premium features like custom themes, analytics, and drag-and-drop reordering without any cost to the user.",
      solution: "I developed a full-stack solution using React and Firebase. The platform features a real-time dashboard where users can instantly see changes to their bio page. I implemented a robust drag-and-drop interface for link management and created a dynamic theming engine that allows infinite color combinations.",
      results: [
        "Zero-cost infrastructure using Firebase free tier",
        "Instant real-time updates across all devices",
        "Highly accessible and WCAG compliant design",
        "Extremely lightweight client bundle"
      ],
      features: [
        "Drag and drop link reordering",
        "Real-time preview dashboard",
        "Custom theme generator",
        "Detailed click analytics"
      ],
      images: [
        "https://res.cloudinary.com/djo33javr/image/upload/v1773247850/Create_a_google_play_store_feature_graphic_1024x50_delpmaspu_1_sg99pr.jpg",
        "https://res.cloudinary.com/djo33javr/image/upload/v1773247852/Create_a_google_play_store_feature_graphic_1024x50_delpmaspu_ttvbcd.jpg"
      ]
    }
  },
  {
    id: "atpukur-boys",
    slug: "atpukur-boys",
    title: "Atpukur Boys",
    category: "Messaging App",
    year: "2026",
    role: "Full Stack",
    image: "https://raw.githubusercontent.com/itsGods/Blog-asset/refs/heads/main/file_0000000040ac720b9327bdd5ddd9ae92.png",
    landscapeImage: "https://res.cloudinary.com/djo33javr/image/upload/v1773247849/Create_an_image_play_store_feature_graphic_1024x50_delpmaspu_uogfy8.jpg",
    description: "A full-stack messaging app with powerful admin controls. It features end-to-end encryption and group messaging, built exclusively for the Atpukur gang.",
    techStack: ["React", "Node.js", "WebSockets", "MongoDB"],
    link: "https://atpukurboys.qzz.io/",
    caseStudy: {
      overview: "Atpukur Boys is a private, highly secure messaging application built specifically for a close-knit community. It combines the speed of modern chat apps with advanced administrative controls and a unique, dark-themed aesthetic.",
      challenge: "The primary technical challenge was implementing real-time, low-latency messaging while ensuring absolute data privacy. The app needed to handle concurrent connections efficiently and provide administrators with granular control over user roles and message moderation.",
      solution: "I built a custom WebSocket server using Node.js to handle real-time bidirectional communication. The frontend, built in React, uses an optimistic UI approach to make messaging feel instantaneous. MongoDB was chosen for its flexibility in storing complex message threads and user relationships.",
      results: [
        "<50ms message delivery latency",
        "Secure end-to-end encrypted channels",
        "Scalable architecture supporting thousands of concurrent users",
        "Comprehensive admin dashboard for community management"
      ],
      features: [
        "Real-time typing indicators and read receipts",
        "Role-based access control (RBAC)",
        "End-to-end encryption for private channels",
        "Media sharing with automatic compression"
      ],
      images: [
        "https://res.cloudinary.com/djo33javr/image/upload/v1773247849/Create_an_image_play_store_feature_graphic_1024x50_delpmaspu_uogfy8.jpg",
        "https://raw.githubusercontent.com/itsGods/Blog-asset/refs/heads/main/file_0000000040ac720b9327bdd5ddd9ae92.png"
      ]
    }
  }
];
