import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Home from "./pages/Home";
import BlogList from "./pages/BlogList";
import BlogPost from "./pages/BlogPost";
import Admin from "./pages/Admin";

export default function App() {
  const isBlogSubdomain = window.location.hostname.startsWith('blog.');

  return (
    <HelmetProvider>
      <Router>
        <Routes>
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
      </Router>
    </HelmetProvider>
  );
}
