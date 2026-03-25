import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { collection, query, orderBy, onSnapshot, doc, setDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth, loginWithGoogle, logout } from "../firebase";
import { format } from "date-fns";
import { Plus, Edit2, Trash2, LogOut, Sparkles, Image as ImageIcon, Wand2, Users, FileText, Eye, Code, Upload, X, Mail, CheckSquare, Square } from "lucide-react";
import { GoogleGenAI, Type } from "@google/genai";
import ReactMarkdown from "react-markdown";
import { calculateReadingTime } from "../lib/utils";
import MDEditor from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import remarkBreaks from 'remark-breaks';
import { handleFirestoreError, OperationType } from "../lib/firebase-errors";

const resizeAndCompressImage = (base64Str: string, maxWidth = 1200, maxHeight = 675): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
      if (height > maxHeight) {
        width = Math.round((width * maxHeight) / height);
        height = maxHeight;
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve(base64Str);
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', 0.8));
    };
    img.onerror = reject;
    img.src = base64Str;
  });
};

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage: string;
  published: boolean;
  createdAt: any;
  updatedAt: any;
  seoTitle?: string;
  seoDescription?: string;
  tags?: string[];
  readingTime?: number;
  previewToken?: string;
  views?: number;
}

export default function Admin() {
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isGeneratingSEO, setIsGeneratingSEO] = useState(false);
  const [isFormatting, setIsFormatting] = useState(false);
  const [selectedPosts, setSelectedPosts] = useState<Set<string>>(new Set());
  const [isSendingNewsletter, setIsSendingNewsletter] = useState(false);
  const [newsletterStatus, setNewsletterStatus] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [activeTab, setActiveTab] = useState<"posts" | "subscribers">("posts");
  const [subscribers, setSubscribers] = useState<any[]>([]);
  
  // Editor State
  const [editorContent, setEditorContent] = useState("");
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-save to local storage
  useEffect(() => {
    if (isCreating || editingPost) {
      const savedDraft = localStorage.getItem("blog_draft");
      if (savedDraft && !editingPost) {
        try {
          const parsed = JSON.parse(savedDraft);
          if (parsed.content) setEditorContent(parsed.content);
          if (parsed.tags) setTags(parsed.tags);
        } catch (e) {
          console.error("Failed to parse draft", e);
        }
      }
    }
  }, [isCreating, editingPost]);

  useEffect(() => {
    if (isCreating && !editingPost) {
      const draft = { content: editorContent, tags };
      localStorage.setItem("blog_draft", JSON.stringify(draft));
    }
  }, [editorContent, tags, isCreating, editingPost]);

  const handleEditClick = (post: Post) => {
    setEditingPost(post);
    setEditorContent(post.content);
    setTags(post.tags || []);
    setIsCreating(true);
  };

  const handleCreateNew = () => {
    setEditingPost(null);
    setEditorContent("");
    setTags([]);
    setIsCreating(true);
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const slugInput = document.querySelector('input[name="slug"]') as HTMLInputElement;
    const slug = slugInput?.value || `untitled-${Date.now()}`;

    try {
      const { uploadCoverImage } = await import("../lib/storage");
      const url = await uploadCoverImage(file, slug);
      const form = document.querySelector('form');
      if (form) {
        (form.querySelector('input[name="coverImage"]') as HTMLInputElement).value = url;
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setErrorMessage("Failed to process and upload image.");
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsubscribePosts = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Post[];
      setPosts(postsData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "posts");
    });

    const qSubscribers = query(collection(db, "subscribers"), orderBy("createdAt", "desc"));
    const unsubscribeSubscribers = onSnapshot(qSubscribers, (snapshot) => {
      const subsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSubscribers(subsData);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "subscribers");
    });

    return () => {
      unsubscribePosts();
      unsubscribeSubscribers();
    };
  }, [user]);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const content = formData.get("content") as string;
    const postData = {
      title: formData.get("title") as string,
      slug: formData.get("slug") as string,
      content: content,
      excerpt: formData.get("excerpt") as string,
      coverImage: formData.get("coverImage") as string,
      published: formData.get("published") === "on",
      seoTitle: formData.get("seoTitle") as string,
      seoDescription: formData.get("seoDescription") as string,
      tags: tags,
      readingTime: calculateReadingTime(content),
      updatedAt: serverTimestamp(),
    };

    try {
      if (editingPost) {
        await setDoc(doc(db, "posts", editingPost.id), postData, { merge: true });
      } else {
        const newRef = doc(collection(db, "posts"));
        await setDoc(newRef, {
          ...postData,
          previewToken: crypto.randomUUID(),
          createdAt: serverTimestamp(),
        });
        localStorage.removeItem("blog_draft");
      }
      setEditingPost(null);
      setIsCreating(false);
      setEditorContent("");
      setTags([]);
    } catch (error) {
      setErrorMessage("Error saving post. Check console.");
      handleFirestoreError(error, editingPost ? OperationType.UPDATE : OperationType.CREATE, "posts");
    }
  };

  const confirmDelete = async () => {
    if (!postToDelete) return;
    try {
      await deleteDoc(doc(db, "posts", postToDelete));
      setPostToDelete(null);
    } catch (error) {
      setErrorMessage("Error deleting post.");
      handleFirestoreError(error, OperationType.DELETE, `posts/${postToDelete}`);
    }
  };

  const handleSelectAll = () => {
    if (selectedPosts.size === posts.length) {
      setSelectedPosts(new Set());
    } else {
      setSelectedPosts(new Set(posts.map(p => p.id)));
    }
  };

  const handleSelectPost = (id: string) => {
    const newSelected = new Set(selectedPosts);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedPosts(newSelected);
  };

  const handleBulkAction = async (action: 'publish' | 'unpublish' | 'delete') => {
    if (selectedPosts.size === 0) return;
    
    if (action === 'delete' && !window.confirm(`Are you sure you want to delete ${selectedPosts.size} posts?`)) {
      return;
    }

    try {
      const { writeBatch, doc } = await import("firebase/firestore");
      const batch = writeBatch(db);

      selectedPosts.forEach(id => {
        const ref = doc(db, "posts", id);
        if (action === 'delete') {
          batch.delete(ref);
        } else {
          batch.update(ref, { published: action === 'publish' });
        }
      });

      await batch.commit();
      setSelectedPosts(new Set());
    } catch (error) {
      alert(`Failed to perform bulk action: ${error}`);
      handleFirestoreError(error, action === 'delete' ? OperationType.DELETE : OperationType.UPDATE, "posts");
    }
  };

  const handleSendNewsletter = async (post: Post) => {
    if (!post.published) {
      alert("Post must be published before sending a newsletter.");
      return;
    }

    if (!window.confirm(`Send newsletter for "${post.title}" to all subscribers?`)) {
      return;
    }

    setIsSendingNewsletter(true);
    setNewsletterStatus(null);

    try {
      const token = await auth.currentUser?.getIdToken();
      const response = await fetch('/api/send-newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ postId: post.id }),
      });

      const data = await response.json();

      if (response.ok) {
        setNewsletterStatus({ message: `Success! Sent to ${data.sentCount} subscribers.`, type: 'success' });
      } else {
        throw new Error(data.error || 'Failed to send newsletter');
      }
    } catch (error: any) {
      console.error('Error sending newsletter:', error);
      setNewsletterStatus({ message: error.message || 'An error occurred while sending.', type: 'error' });
    } finally {
      setIsSendingNewsletter(false);
      setTimeout(() => setNewsletterStatus(null), 5000);
    }
  };

  const handleGenerateSEO = async () => {
    const content = editorContent;
    
    if (!content) {
      setErrorMessage("Please enter your article content first to generate SEO metadata and titles.");
      return;
    }

    setIsGeneratingSEO(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: `You are an elite SEO expert and copywriter. Analyze the following blog post content and generate the ultimate SEO-optimized metadata to rank #1 on Google. The target domain is blog.TGhabib.com.
        Content: ${content}
        
        Return a JSON object with:
        - title: A highly engaging, click-worthy main article title (H1).
        - seoTitle: An optimized SEO meta title including primary keywords (max 60 chars).
        - seoDescription: A compelling meta description optimized for high CTR (max 160 chars).
        - excerpt: A captivating short summary for the blog list (max 300 chars).
        - slug: A short, keyword-rich, SEO-friendly URL slug (lowercase, hyphens only, no stop words).`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              seoTitle: { type: Type.STRING },
              seoDescription: { type: Type.STRING },
              excerpt: { type: Type.STRING },
              slug: { type: Type.STRING }
            },
            required: ["title", "seoTitle", "seoDescription", "excerpt", "slug"]
          }
        }
      });

      const data = JSON.parse(response.text);
      
      const form = document.querySelector('form');
      if (form) {
        (form.querySelector('input[name="title"]') as HTMLInputElement).value = data.title;
        (form.querySelector('input[name="seoTitle"]') as HTMLInputElement).value = data.seoTitle;
        (form.querySelector('input[name="seoDescription"]') as HTMLInputElement).value = data.seoDescription;
        (form.querySelector('textarea[name="excerpt"]') as HTMLTextAreaElement).value = data.excerpt;
        (form.querySelector('input[name="slug"]') as HTMLInputElement).value = data.slug;
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to generate SEO metadata.");
    } finally {
      setIsGeneratingSEO(false);
    }
  };

  const handleGenerateThumbnail = async () => {
    const title = (document.querySelector('input[name="title"]') as HTMLInputElement)?.value;
    const content = editorContent;
    
    if (!title && !content) {
      setErrorMessage("Please enter a title or content first to generate a thumbnail.");
      return;
    }

    setIsGeneratingImage(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const promptResponse = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Write a short, highly descriptive image generation prompt for a blog post cover image. 
        The blog post is titled: "${title || 'Untitled'}" and the content is about: "${content ? content.substring(0, 500) + '...' : 'General topic'}". 
        The visual style should be directly inspired by the specific subject matter of the blog post. Make it highly detailed, professional, and visually captivating.
        Do not include text in the image. Just describe the visual.`
      });
      
      const imagePrompt = promptResponse.text;

      const imageResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: imagePrompt,
        config: {
          imageConfig: {
            aspectRatio: "16:9"
          }
        }
      });

      let base64Image = "";
      for (const part of imageResponse.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          base64Image = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          break;
        }
      }

      if (base64Image) {
        const compressedImage = await resizeAndCompressImage(base64Image);
        const form = document.querySelector('form');
        if (form) {
          (form.querySelector('input[name="coverImage"]') as HTMLInputElement).value = compressedImage;
        }
      } else {
        throw new Error("No image generated");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to generate thumbnail.");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleFormatContent = async () => {
    if (!editorContent) {
      setErrorMessage("Please enter some content to format.");
      return;
    }

    setIsFormatting(true);
    setErrorMessage(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: `You are an expert markdown editor and formatter. Take the following markdown content and fix its formatting, alignment, and structure. Ensure it uses clean, standard Markdown. Fix any broken paragraphs, lists, or headings. Do not change the core meaning or tone of the text, just make it perfectly formatted, aligned, and readable. Return ONLY the formatted markdown text, without any conversational filler or markdown code block backticks around the whole response if possible.

Content:
${editorContent}`,
      });

      let formattedContent = response.text || "";
      if (formattedContent.startsWith("\`\`\`markdown")) {
        formattedContent = formattedContent.replace(/^\`\`\`markdown\n/, "").replace(/\n\`\`\`$/, "");
      } else if (formattedContent.startsWith("\`\`\`")) {
        formattedContent = formattedContent.replace(/^\`\`\`\n/, "").replace(/\n\`\`\`$/, "");
      }

      setEditorContent(formattedContent);
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to format content. Please try again.");
    } finally {
      setIsFormatting(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-brand-black flex items-center justify-center text-white">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-brand-black flex flex-col items-center justify-center text-white p-6">
        <Helmet><title>Admin Login</title></Helmet>
        <h1 className="text-4xl font-display font-bold mb-8">Admin Access</h1>
        <button
          onClick={loginWithGoogle}
          className="px-6 py-3 bg-brand-orange text-white rounded-full font-mono text-sm uppercase tracking-widest hover:bg-white hover:text-brand-orange transition-colors"
        >
          Sign in with Google
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-black text-white p-6 md:p-12 font-sans">
      <Helmet><title>Blog Admin</title></Helmet>
      
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-display font-bold">Blog Admin</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-white/60">{user.email}</span>
            <button
              onClick={logout}
              className="p-2 bg-white/10 rounded-full hover:bg-brand-orange transition-colors"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        {!isCreating && !editingPost && (
          <div className="flex gap-4 mb-8 border-b border-white/10 pb-4">
            <button 
              onClick={() => setActiveTab("posts")}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-mono text-sm uppercase tracking-widest transition-colors ${activeTab === "posts" ? "bg-brand-orange text-white" : "text-white/50 hover:text-white"}`}
            >
              <FileText size={16} /> Posts
            </button>
            <button 
              onClick={() => setActiveTab("subscribers")}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-mono text-sm uppercase tracking-widest transition-colors ${activeTab === "subscribers" ? "bg-brand-orange text-white" : "text-white/50 hover:text-white"}`}
            >
              <Users size={16} /> Subscribers ({subscribers.length})
            </button>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 flex justify-between items-center">
            <p>{errorMessage}</p>
            <button onClick={() => setErrorMessage(null)} className="text-red-200 hover:text-white">✕</button>
          </div>
        )}

        {postToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
            <div className="bg-brand-dark p-6 rounded-2xl border border-white/10 max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">Confirm Deletion</h3>
              <p className="text-white/60 mb-6">Are you sure you want to delete this post? This action cannot be undone.</p>
              <div className="flex justify-end gap-4">
                <button onClick={() => setPostToDelete(null)} className="px-4 py-2 rounded-full border border-white/20 hover:bg-white/10 transition-colors">Cancel</button>
                <button onClick={confirmDelete} className="px-4 py-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors">Delete</button>
              </div>
            </div>
          </div>
        )}

        {isCreating || editingPost ? (
          <div className="bg-brand-dark p-6 rounded-2xl border border-white/10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{editingPost ? "Edit Post" : "Create New Post"}</h2>
              <div className="flex items-center gap-4">
                {editingPost && (
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/blog/${editingPost.slug}?preview=${editingPost.previewToken}`);
                      const btn = document.getElementById('copy-preview-btn');
                      if (btn) {
                        const originalText = btn.innerHTML;
                        btn.innerHTML = 'Copied!';
                        setTimeout(() => btn.innerHTML = originalText, 2000);
                      }
                    }}
                    id="copy-preview-btn"
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors text-sm font-mono uppercase tracking-widest"
                  >
                    Copy Preview Link
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleGenerateSEO}
                  disabled={isGeneratingSEO}
                  className="flex items-center gap-2 px-4 py-2 bg-brand-orange/20 text-brand-orange rounded-full hover:bg-brand-orange hover:text-white transition-colors text-sm font-mono uppercase tracking-widest disabled:opacity-50"
                >
                  {isGeneratingSEO ? <span className="animate-spin">⏳</span> : <Wand2 size={16} />}
                  Auto SEO & Meta
                </button>
              </div>
            </div>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-mono text-white/60 mb-2">Title *</label>
                  <input
                    required
                    name="title"
                    defaultValue={editingPost?.title}
                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-brand-orange outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-mono text-white/60 mb-2">Slug *</label>
                  <input
                    required
                    name="slug"
                    defaultValue={editingPost?.slug}
                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-brand-orange outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-mono text-white/60 mb-2">Excerpt</label>
                <textarea
                  name="excerpt"
                  defaultValue={editingPost?.excerpt}
                  rows={2}
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-brand-orange outline-none"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-mono text-white/60">Content (Markdown) *</label>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-white/40 font-mono">
                      {editorContent.trim().split(/\s+/).filter(w => w.length > 0).length} words | {editorContent.length} chars | ~{calculateReadingTime(editorContent)} min read
                    </span>
                    <button
                      type="button"
                      onClick={handleFormatContent}
                      disabled={isFormatting}
                      className="flex items-center gap-2 text-xs font-mono text-brand-orange hover:text-white transition-colors disabled:opacity-50"
                    >
                      {isFormatting ? <span className="animate-spin">⏳</span> : <Sparkles size={14} />}
                      Format with AI
                    </button>
                  </div>
                </div>
                <div data-color-mode="dark">
                  <MDEditor
                    value={editorContent}
                    onChange={(val) => setEditorContent(val || "")}
                    height={500}
                    previewOptions={{
                      remarkPlugins: [remarkBreaks]
                    }}
                    className="w-full bg-black/50 border border-white/10 rounded-lg overflow-hidden"
                  />
                  <input type="hidden" name="content" value={editorContent} required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-mono text-white/60 mb-2">Tags</label>
                <div className="w-full bg-black/50 border border-white/10 rounded-lg p-3 flex flex-wrap gap-2 focus-within:border-brand-orange transition-colors">
                  {tags.map(tag => (
                    <span key={tag} className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-md text-sm font-mono text-white">
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)} className="hover:text-brand-orange"><X size={14} /></button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    placeholder="Type and press Enter..."
                    className="bg-transparent outline-none text-white font-mono text-sm flex-1 min-w-[150px]"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-mono text-white/60">Cover Image URL</label>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 text-xs font-mono text-brand-orange hover:text-white transition-colors"
                    >
                      <Upload size={14} /> Upload File
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileUpload} 
                      accept="image/*" 
                      className="hidden" 
                    />
                    <button
                      type="button"
                      onClick={handleGenerateThumbnail}
                      disabled={isGeneratingImage}
                      className="flex items-center gap-2 text-xs font-mono text-brand-orange hover:text-white transition-colors disabled:opacity-50"
                    >
                      {isGeneratingImage ? <span className="animate-spin">⏳</span> : <ImageIcon size={14} />}
                      Generate with AI
                    </button>
                  </div>
                </div>
                <input
                  name="coverImage"
                  defaultValue={editingPost?.coverImage}
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-brand-orange outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-mono text-white/60 mb-2">SEO Title</label>
                  <input
                    name="seoTitle"
                    defaultValue={editingPost?.seoTitle}
                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-brand-orange outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-mono text-white/60 mb-2">SEO Description</label>
                  <input
                    name="seoDescription"
                    defaultValue={editingPost?.seoDescription}
                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-brand-orange outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="published"
                  name="published"
                  defaultChecked={editingPost?.published}
                  className="w-5 h-5 accent-brand-orange"
                />
                <label htmlFor="published" className="text-sm font-mono text-white/80">Published</label>
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingPost(null);
                    setEditorContent("");
                    setTags([]);
                  }}
                  className="px-6 py-2 rounded-full border border-white/20 hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-brand-orange text-white hover:bg-white hover:text-brand-orange transition-colors"
                >
                  Save Post
                </button>
              </div>
            </form>
          </div>
        ) : activeTab === "posts" ? (
          <>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-mono text-white/60">All Posts</h2>
              <button
                onClick={handleCreateNew}
                className="flex items-center gap-2 px-4 py-2 bg-brand-orange text-white rounded-full hover:bg-white hover:text-brand-orange transition-colors text-sm font-mono uppercase tracking-widest"
              >
                <Plus size={16} /> New Post
              </button>
            </div>

            <div className="bg-brand-dark rounded-2xl border border-white/10 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-black/20">
                    <th className="p-4 w-12">
                      <button onClick={handleSelectAll} className="hover:text-white transition-colors">
                        {selectedPosts.size === posts.length && posts.length > 0 ? <CheckSquare size={16} /> : <Square size={16} />}
                      </button>
                    </th>
                    <th className="p-4 font-mono text-xs uppercase tracking-widest text-white/40">Title</th>
                    <th className="p-4 font-mono text-xs uppercase tracking-widest text-white/40">Status</th>
                    <th className="p-4 font-mono text-xs uppercase tracking-widest text-white/40">Views</th>
                    <th className="p-4 font-mono text-xs uppercase tracking-widest text-white/40">Date</th>
                    <th className="p-4 font-mono text-xs uppercase tracking-widest text-white/40 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr key={post.id} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${selectedPosts.has(post.id) ? 'bg-white/5' : ''}`}>
                      <td className="p-4">
                        <button onClick={() => handleSelectPost(post.id)} className="text-white/40 hover:text-white transition-colors">
                          {selectedPosts.has(post.id) ? <CheckSquare size={16} className="text-brand-orange" /> : <Square size={16} />}
                        </button>
                      </td>
                      <td className="p-4 font-medium">{post.title}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-mono ${post.published ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                          {post.published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-sm text-white/60">
                        {post.views || 0}
                      </td>
                      <td className="p-4 text-sm text-white/60">
                        {post.createdAt?.toDate ? format(post.createdAt.toDate(), "MMM dd, yyyy") : "N/A"}
                      </td>
                      <td className="p-4 flex justify-end gap-2">
                        {post.published && (
                          <button
                            onClick={() => handleSendNewsletter(post)}
                            disabled={isSendingNewsletter}
                            className="p-2 bg-white/10 rounded-lg hover:bg-blue-500 transition-colors disabled:opacity-50"
                            title="Send Newsletter"
                          >
                            <Mail size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => handleEditClick(post)}
                          className="p-2 bg-white/10 rounded-lg hover:bg-brand-orange transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => setPostToDelete(post.id)}
                          className="p-2 bg-white/10 rounded-lg hover:bg-red-500 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {posts.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-white/40 font-mono text-sm">
                        No posts found. Create your first post!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="bg-brand-dark rounded-2xl border border-white/10 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-black/20">
                  <th className="p-4 font-mono text-xs uppercase tracking-widest text-white/40">Email</th>
                  <th className="p-4 font-mono text-xs uppercase tracking-widest text-white/40">Subscribed Date</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((sub) => (
                  <tr key={sub.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4 font-medium">{sub.email}</td>
                    <td className="p-4 text-sm text-white/60">
                      {sub.createdAt?.toDate ? format(sub.createdAt.toDate(), "MMM dd, yyyy HH:mm") : "N/A"}
                    </td>
                  </tr>
                ))}
                {subscribers.length === 0 && (
                  <tr>
                    <td colSpan={2} className="p-8 text-center text-white/40 font-mono text-sm">
                      No subscribers yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
