import { useState, useEffect } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { AppointmentDialog } from "@/components/AppointmentDialog";
import { getPostBySlug, blogPosts as defaultBlogPosts } from "@/data/blogPosts";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Clock, Calendar, AlertCircle, Download } from "lucide-react";

const BlogPost = () => {
  const { slug } = useParams();
  const [open, setOpen] = useState(false);
  const [post, setPost] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [extracting, setExtracting] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const extractPdfText = async (blob: Blob) => {
      try {
        const pdfjsLib: any = await import('pdfjs-dist/legacy/build/pdf');
        try {
          pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
        } catch (err) {
          // ignore worker assignment failure
        }

        const loadingTask = pdfjsLib.getDocument({ data: await blob.arrayBuffer() });
        const pdf = await loadingTask.promise;
        let fullText = '';

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const strings = content.items.map((item: any) => item.str || '');
          fullText += strings.join(' ') + '\n\n';
        }

        return fullText;
      } catch (error) {
        console.warn('Client-side PDF extraction failed:', error);
        return '';
      }
    };

    const extractDocxText = async (blob: Blob) => {
      try {
        const mammoth = await import('mammoth');
        const arrayBuffer = await blob.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        return result.value || '';
      } catch (error) {
        console.warn('Client-side DOCX extraction failed:', error);
        return '';
      }
    };

    const paragraphsFromText = (text: string) =>
      text
        .split(/\n{2,}/)
        .map((p) => p.trim())
        .filter(Boolean)
        .map((p) => ({ paragraphs: [p] }));

    const extractMissingText = async (filePath: string, fileType: string, fileName: string) => {
      try {
        const { data } = supabase.storage.from('blog-files').getPublicUrl(filePath);
        if (!data?.publicUrl) {
          return [];
        }

        const response = await fetch(data.publicUrl);
        if (!response.ok) {
          return [];
        }

        const blob = await response.blob();
        const mimeType = fileType === 'pdf'
          ? 'application/pdf'
          : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        const extractedFile = new File([blob], fileName || `document.${fileType}`, { type: mimeType });
        const form = new FormData();
        form.append('file', extractedFile);

        // Try the local extraction service first.
        try {
          const extractResp = await fetch('http://localhost:4000/extract', {
            method: 'POST',
            body: form,
          });

          if (extractResp.ok) {
            const json = await extractResp.json();
            const paragraphs = (json.paragraphs || [])
              .map((p: string) => p.trim())
              .filter(Boolean);

            if (paragraphs.length) {
              return paragraphs.map((p: string) => ({ paragraphs: [p] }));
            }
          }
        } catch (error) {
          console.warn('Server extractor unavailable, trying client-side extraction:', error);
        }

        // Fallback to client-side extraction when the service is unavailable.
        const extractedText =
          fileType === 'pdf'
            ? await extractPdfText(blob)
            : fileType === 'docx'
            ? await extractDocxText(blob)
            : '';

        if (extractedText) {
          return paragraphsFromText(extractedText);
        }

        return [];
      } catch (error) {
        console.warn('Text extraction fallback failed:', error);
        return [];
      }
    };

    const fetchPost = async () => {
      try {
        // Try to fetch from Supabase first
        const { data: dbPost, error } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("slug", slug)
          .single();

        if (dbPost) {
          const transformedPost = {
            slug: dbPost.slug,
            title: dbPost.title,
            excerpt: dbPost.excerpt,
            category: dbPost.category,
            readTime: dbPost.read_time,
            date: dbPost.date,
            icon: dbPost.icon,
            gradient: dbPost.gradient,
            image: dbPost.image || undefined,
            sections: dbPost.sections,
            filePath: dbPost.file_path,
            fileType: dbPost.file_type,
            fileName: dbPost.file_name,
          };
          setPost(transformedPost);

          if (
            (!transformedPost.sections || transformedPost.sections.length === 0) &&
            transformedPost.filePath &&
            ["pdf", "docx"].includes(transformedPost.fileType)
          ) {
            setExtracting(true);
            const extractedSections = await extractMissingText(
              transformedPost.filePath,
              transformedPost.fileType,
              transformedPost.fileName
            );
            if (extractedSections.length > 0) {
              setPost((prev: any) =>
                prev
                  ? {
                      ...prev,
                      sections: extractedSections,
                    }
                  : prev
              );
            }
            setExtracting(false);
          }

          // Fetch related posts
          const { data: relatedPosts } = await supabase
            .from("blog_posts")
            .select("*")
            .neq("slug", slug)
            .order("date", { ascending: false })
            .limit(3);

          if (relatedPosts) {
            const transformed = relatedPosts.map((p: any) => ({
              slug: p.slug,
              title: p.title,
              excerpt: p.excerpt,
              category: p.category,
              readTime: p.read_time,
              date: p.date,
              icon: p.icon,
              gradient: p.gradient,
              sections: p.sections,
            }));
            setRelated(transformed);
          }
        } else {
          // Fall back to default posts
          const defaultPost = getPostBySlug(slug || "");
          if (defaultPost) {
            setPost(defaultPost);
            setRelated(defaultBlogPosts.filter((p) => p.slug !== slug).slice(0, 3));
          } else {
            setNotFound(true);
          }
        }
      } catch (error) {
        console.error("Error fetching blog post:", error);
        // Fall back to default posts
        const defaultPost = getPostBySlug(slug || "");
        if (defaultPost) {
          setPost(defaultPost);
          setRelated(defaultBlogPosts.filter((p) => p.slug !== slug).slice(0, 3));
        } else {
          setNotFound(true);
        }
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  if (notFound) return <Navigate to="/blog" replace />;
  
  // Show loading state while fetching
  if (loading || !post) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading article...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Header onBookClick={() => setOpen(true)} />

      {/* Hero */}
      <section
        className={`pt-32 pb-16 px-5 sm:px-10 bg-gradient-to-br ${post.gradient} text-white relative overflow-hidden`}
      >
        <div className="max-w-3xl mx-auto relative">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-white/80 hover:text-white mb-5"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Blog
          </Link>
          <span className="inline-block text-[10px] tracking-[3px] uppercase bg-white/20 backdrop-blur px-3 py-1 rounded-full font-semibold mb-4">
            {post.category}
          </span>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4">
            {post.title}
          </h1>
          <p className="text-white/85 text-base sm:text-lg leading-relaxed mb-5">
            {post.excerpt}
          </p>
          <div className="flex items-center gap-5 text-sm text-white/75">
            <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" />{post.date}</span>
            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{post.readTime}</span>
          </div>
        </div>
        <div className="absolute -bottom-8 -right-8 text-[180px] opacity-20 select-none">
          {post.icon}
        </div>
      </section>

      {/* Featured Image */}
      {post.image && (
        <section className="py-8 px-5 sm:px-10 bg-soft-blue/20">
          <div className="max-w-3xl mx-auto">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-auto rounded-lg shadow-lg object-cover max-h-96"
            />
          </div>
        </section>
      )}

      {/* Body */}
      <article className="py-14 px-5 sm:px-10">
        <div className="max-w-3xl mx-auto space-y-9">
          {post.sections && post.sections.length > 0 ? (
            // Show extracted sections (prefer this for PDFs)
            <>
              {post.sections.map((section: any, i: number) => {
                if (section.callout) {
                  return (
                    <div
                      key={i}
                      className="rounded-2xl border-l-4 border-accent bg-soft-blue/50 p-6 shadow-soft"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <AlertCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                        <h3 className="font-display text-lg font-bold text-navy">
                          {section.callout.title}
                        </h3>
                      </div>
                      <ul className="space-y-2 ml-8">
                        {section.callout.items.map((item: any, j: number) => (
                          <li key={j} className="text-sm text-foreground/80 list-disc">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                }
                return (
                  <div key={i}>
                    {section.heading && (
                      <h2 className="font-display text-2xl sm:text-3xl font-bold text-navy mb-4">
                        {section.heading}
                      </h2>
                    )}
                    {section.paragraphs?.map((p: any, j: number) => (
                      <p key={j} className="text-foreground/80 leading-relaxed mb-3 text-[15px]">
                        {p}
                      </p>
                    ))}
                    {section.list && (
                      <ul className="space-y-2 mt-2">
                        {section.list.map((item: any, j: number) => (
                          <li key={j} className="flex gap-3 text-foreground/80 text-[15px]">
                            <span className="text-accent mt-1.5 shrink-0">●</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </>
          ) : extracting ? (
            <div className="rounded-2xl bg-gradient-to-br from-sky to-blue text-white p-8 sm:p-12 text-center">
              <div className="mb-6">
                <h2 className="font-display text-3xl font-bold mb-3">Extracting Blog Text</h2>
                <p className="text-white/90 mb-6">
                  The blog text is being extracted and will appear below the image shortly.
                </p>
              </div>
            </div>
          ) : post.filePath ? (
            <div className="rounded-2xl bg-gradient-to-br from-sky to-blue text-white p-8 sm:p-12">
              <div className="mb-6">
                <h2 className="font-display text-3xl font-bold mb-3">Document text unavailable</h2>
                <p className="text-white/90 mb-6">
                  We could not extract the content automatically. You can still read the summary below or download the file directly.
                </p>
              </div>
              <div className="space-y-4 text-left text-white/90">
                <p><strong>Excerpt:</strong> {post.excerpt}</p>
                {post.fileType && (
                  <p>
                    <strong>File type:</strong> {post.fileType.toUpperCase()}
                  </p>
                )}
                {post.filePath && (
                  <a
                    href={supabase.storage.from('blog-files').getPublicUrl(post.filePath).data.publicUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-full bg-white/10 px-5 py-3 text-sm font-semibold text-white hover:bg-white/20 transition"
                  >
                    Download original document
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground">No content available.</div>
          )}

          {/* CTA */}
          <div className="rounded-2xl bg-gradient-to-br from-navy to-blue text-white p-7 sm:p-9 text-center mt-12">
            <h3 className="font-display text-2xl font-bold mb-2">Concerned about your eyes?</h3>
            <p className="text-white/80 mb-5 text-sm">
              Book a consultation with Dr J Sumanth Reddy for an expert evaluation.
            </p>
            <button
              onClick={() => setOpen(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-sky to-accent text-white px-6 py-3 rounded-full text-sm font-semibold hover:opacity-90 transition shadow-glow"
            >
              Book Appointment
            </button>
          </div>
        </div>
      </article>

      {/* Related */}
      <section className="py-14 px-5 sm:px-10 bg-soft-blue/40 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <h3 className="font-display text-2xl font-bold text-navy mb-6">
            Related Articles
          </h3>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <Link
                key={p.slug}
                to={`/blog/${p.slug}`}
                className="group rounded-xl overflow-hidden bg-card border border-border shadow-soft hover:shadow-card transition"
              >
                <div className={`h-28 bg-gradient-to-br ${p.gradient} flex items-center justify-center text-5xl`}>
                  {p.icon}
                </div>
                <div className="p-5">
                  <h4 className="font-display font-bold text-foreground group-hover:text-primary transition leading-snug">
                    {p.title}
                  </h4>
                </div>
              </Link>
            ))}
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

export default BlogPost;