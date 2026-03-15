import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AnimatePresence } from "motion/react";
import Home from "./pages/Home";
import BlogList from "./pages/BlogList";
import BlogPost from "./pages/BlogPost";
import Admin from "./pages/Admin";

function AnimatedRoutes() {
  const location = useLocation();
  const isBlogSubdomain = window.location.hostname.startsWith('blog.');

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {isBlogSubdomain ? (
          <>
            <Route path="/" element={<BlogList />} />
            <Route path="/:slug" element={<BlogPost />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
          </>
        )}
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <Router>
        <AnimatedRoutes />
      </Router>
    </HelmetProvider>
  );
}
