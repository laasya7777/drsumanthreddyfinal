import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { AppointmentDialog } from "@/components/AppointmentDialog";
import BlogUpload from "@/components/BlogUpload";
import { supabase } from "@/integrations/supabase/client";
import { importDefaultBlogPosts } from "@/lib/seedBlogPosts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LogOut, Download, CheckCircle, AlertCircle, Loader2, Trash2, RefreshCcw } from "lucide-react";

const Admin = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [signInLoading, setSignInLoading] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [importMessage, setImportMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const storageBucket = "blog-files";

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          setUser(null);
        } else {
          setUser(user);
        }
      } catch (error) {
        console.error("Auth error:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setPosts([]);
    setActionMessage(null);
    setImportMessage(null);
  };

  const handleSignIn = async () => {
    setAuthError(null);
    setSignInLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (!data.user) {
        throw new Error("Login failed. Please check your credentials.");
      }

      setUser(data.user);
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Sign-in error:", error);
      setAuthError(
        error instanceof Error ? error.message : "Failed to sign in."
      );
    } finally {
      setSignInLoading(false);
    }
  };

  const getStoragePathFromPublicUrl = (publicUrl: string) => {
    try {
      const url = new URL(publicUrl);
      const pathPrefix = `/storage/v1/object/public/${storageBucket}/`;
      if (url.pathname.includes(pathPrefix)) {
        return url.pathname.split(pathPrefix)[1];
      }
    } catch (error) {
      console.warn("Invalid image URL for path extraction:", error);
    }
    return null;
  };

  const fetchPosts = async () => {
    setPostsLoading(true);
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("date", { ascending: false });

      if (error) {
        throw error;
      }

      setPosts(data || []);
    } catch (error) {
      console.error("Fetch blog posts error:", error);
      setActionMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to load posts.",
      });
    } finally {
      setPostsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchPosts();
    }
  }, [user]);

  const handleDeletePost = async (
    slug: string,
    filePath?: string,
    imageUrl?: string
  ) => {
    if (!window.confirm("Delete this blog post permanently?")) {
      return;
    }

    setActionLoading(true);
    setActionMessage(null);

    try {
      const { error: deleteError } = await supabase
        .from("blog_posts")
        .delete()
        .eq("slug", slug);

      if (deleteError) {
        throw deleteError;
      }

      if (filePath) {
        const { error: storageError } = await supabase
          .storage
          .from(storageBucket)
          .remove([filePath]);
        if (storageError) {
          console.warn("Failed to delete blog file from storage:", storageError);
        }
      }

      if (imageUrl) {
        const imagePath = getStoragePathFromPublicUrl(imageUrl);
        if (imagePath) {
          const { error: imageDeleteError } = await supabase
            .storage
            .from(storageBucket)
            .remove([imagePath]);
          if (imageDeleteError) {
            console.warn("Failed to delete featured image from storage:", imageDeleteError);
          }
        }
      }

      setActionMessage({
        type: "success",
        text: `Blog post ${slug} deleted successfully.`,
      });

      await fetchPosts();
    } catch (error) {
      console.error("Delete blog post error:", error);
      setActionMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to delete post.",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleImportDefaultPosts = async () => {
    setImportLoading(true);
    setImportMessage(null);
    try {
      const result = await importDefaultBlogPosts();
      setImportMessage({
        type: "success",
        text: result.message,
      });
    } catch (error) {
      console.error("Import error:", error);
      const errorText =
        error instanceof Error
          ? error.message
          : typeof error === "object"
          ? JSON.stringify(error, Object.getOwnPropertyNames(error), 2)
          : String(error);
      setImportMessage({
        type: "error",
        text: `Import failed: ${errorText}`,
      });
    } finally {
      setImportLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center px-5">
        <Card className="w-full max-w-md p-8">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Admin Login</h1>
              <p className="text-sm text-muted-foreground mt-2">
                Sign in with your admin email and password to manage blog content.
              </p>
            </div>

            {authError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{authError}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2" htmlFor="email">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2" htmlFor="password">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button
              onClick={handleSignIn}
              disabled={signInLoading || !email || !password}
              className="w-full"
            >
              {signInLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </div>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Header onBookClick={() => setOpen(true)} />

      {/* Hero */}
      <section className="pt-32 pb-12 px-5 sm:px-10 bg-gradient-to-br from-navy via-blue to-sky text-white">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-4xl sm:text-5xl font-bold mb-2">
                Admin Dashboard
              </h1>
              <p className="text-white/80">Manage blog posts and content</p>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-14 px-5 sm:px-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid gap-8">
            {/* Import Default Posts */}
            <Card className="p-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Import Default Posts</h2>
                  <p className="text-sm text-muted-foreground">
                    Add all pre-existing blog posts to the database at once
                  </p>
                </div>
              </div>

              {importMessage && (
                <Alert
                  variant={importMessage.type === "success" ? "default" : "destructive"}
                  className="mb-4"
                >
                  {importMessage.type === "success" ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  <AlertDescription>{importMessage.text}</AlertDescription>
                </Alert>
              )}

              <div className="bg-muted p-4 rounded-lg mb-4">
                <p className="text-sm text-muted-foreground mb-3">
                  This will import 11 existing blog posts about common eye conditions:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Conjunctivitis (Pink Eye)</li>
                  <li>• Diabetic Retinopathy</li>
                  <li>• Digital Eye Strain</li>
                  <li>• Dry Eye Syndrome</li>
                  <li>• Glaucoma</li>
                  <li>• Cataract</li>
                  <li>• Refractive Errors</li>
                  <li>• Retinal Detachment</li>
                  <li>• Age-Related Macular Degeneration</li>
                  <li>• Color Blindness</li>
                  <li>• Common Eye Problems Overview</li>
                </ul>
              </div>

              <Button
                onClick={handleImportDefaultPosts}
                disabled={importLoading}
                size="lg"
                className="w-full sm:w-auto"
              >
                {importLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Import All Default Posts
                  </>
                )}
              </Button>
            </Card>

            {/* Manage Existing Blog Posts */}
            <Card className="p-8">
              <div className="flex items-start justify-between mb-4 gap-4">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Manage Blog Posts</h2>
                  <p className="text-sm text-muted-foreground">
                    View, refresh, and delete posts stored in Supabase.
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={fetchPosts}
                  disabled={postsLoading || actionLoading}
                >
                  <RefreshCcw className="mr-2 h-4 w-4" /> Refresh
                </Button>
              </div>

              {actionMessage && (
                <Alert
                  variant={actionMessage.type === "success" ? "default" : "destructive"}
                  className="mb-4"
                >
                  {actionMessage.type === "success" ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  <AlertDescription>{actionMessage.text}</AlertDescription>
                </Alert>
              )}

              {postsLoading ? (
                <div className="text-sm text-muted-foreground">Loading blog posts…</div>
              ) : posts.length === 0 ? (
                <div className="text-sm text-muted-foreground">No blog posts found yet.</div>
              ) : (
                <div className="space-y-4">
                  {posts.map((post) => (
                    <div
                      key={post.slug}
                      className="rounded-2xl border border-border bg-background p-4 sm:flex sm:items-center sm:justify-between gap-4"
                    >
                      <div>
                        <h3 className="text-lg font-semibold">{post.title || post.slug}</h3>
                        <p className="text-sm text-muted-foreground">
                          {post.category || "Documents"} · {post.date || "Unknown date"}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-4 sm:mt-0">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => navigate(`/blog/${post.slug}`)}
                        >
                          View
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeletePost(post.slug, post.file_path, post.image)}
                          disabled={actionLoading}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Upload New Blog Post */}
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-2">Upload Blog Post</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Upload a PDF, DOC, or DOCX document and optional featured image.
              </p>
              <BlogUpload />
            </Card>
          </div>
        </div>
      </section>

      <footer className="bg-navy-deep px-5 sm:px-10 py-8 text-center text-white/50 text-sm">
        © 2024 Dr J Sumanth Reddy – Eye Specialist & Surgeon
      </footer>

      <AppointmentDialog open={open} onOpenChange={setOpen} />
    </main>
  );
};

export default Admin;
