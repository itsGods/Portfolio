import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AnimatePresence } from "motion/react";
import useAnalytics from "./hooks/useAnalytics";
import RouteAnnouncer from "./components/RouteAnnouncer";
import { ScrollProvider } from "./components/ScrollProvider";

// Lazy load pages for route-level code splitting
const Home = React.lazy(() => import("./pages/Home"));
const BlogList = React.lazy(() => import("./pages/BlogList"));
const BlogPost = React.lazy(() => import("./pages/BlogPost"));
const Admin = React.lazy(() => import("./pages/Admin"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const Lab = React.lazy(() => import("./pages/Lab"));

function AnimatedRoutes() {
  const location = useLocation();
  const isBlogSubdomain = window.location.hostname.startsWith('blog.');
  const isLabSubdomain = window.location.hostname.startsWith('lab.');

  useAnalytics();

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={
        <div className="min-h-screen bg-brand-black flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-orange border-t-transparent" />
        </div>
      }>
        <RouteAnnouncer />
        <Routes location={location} key={location.pathname}>
          {isLabSubdomain ? (
            <>
              <Route path="/" element={<Lab />} />
            </>
          ) : isBlogSubdomain ? (
            <>
              <Route path="/" element={<BlogList />} />
              <Route path="/:slug" element={<BlogPost />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/blog" element={<BlogList />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/lab" element={<Lab />} />
            </>
          )}
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <ScrollProvider>
        <Router>
          <AnimatedRoutes />
        </Router>
      </ScrollProvider>
    </HelmetProvider>
  );
}
