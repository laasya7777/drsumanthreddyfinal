import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Upload, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export type BlogSection = {
  heading?: string;
  paragraphs?: string[];
  list?: string[];
  callout?: { title: string; items: string[] };
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  icon: string;
  gradient: string;
  image?: string;
  sections: BlogSection[];
};

const BlogUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const storageBucket = "blog-files";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setMessage(null);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setImageFile(e.target.files[0]);
      setMessage(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage({
        type: "error",
        text: "Please select a document",
      });
      return;
    }

    const name = file.name.toLowerCase();
    const allowed = [".pdf", ".doc", ".docx"];

    if (!allowed.some((ext) => name.endsWith(ext))) {
      setMessage({
        type: "error",
        text: "Only PDF, DOC, DOCX files are allowed",
      });
      return;
    }

    setLoading(true);

    try {
      // Check session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      console.log("Session:", session);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      console.log("Current User:", user);

      if (!user) {
        throw new Error(
          "You must be logged in before uploading files."
        );
      }

      const fileExt = name.slice(name.lastIndexOf("."));
      const baseName = file.name.replace(/\.[^/.]+$/, "");

      const slug = baseName
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

      // =========================
      // Upload Document
      // =========================
      const filePath = `${slug}/${Date.now()}${fileExt}`;

      const { error: fileError } = await supabase.storage
        .from(storageBucket)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (fileError) {
        console.error("Document Upload Error:", fileError);
        throw fileError;
      }

      // If PDF or DOCX, try extracting text to store inline in the post
      let extractedSections: BlogSection[] = [];
      if (fileExt === ".pdf" || fileExt === ".docx") {
        // Try server-side extraction first for speed and reliability
        try {
          const form = new FormData();
          form.append('file', file);
          const resp = await fetch('http://localhost:4000/extract', {
            method: 'POST',
            body: form,
          });
          if (resp.ok) {
            const json = await resp.json();
            const paragraphs = (json.paragraphs || []).map((p: string) => p.trim()).filter(Boolean);
            if (paragraphs.length) {
              extractedSections = paragraphs.map((p: string) => ({ paragraphs: [p] }));
            }
          } else {
            console.warn('Server extraction failed, falling back to client extraction if available');
            throw new Error('Server extraction failed');
          }
        } catch (e) {
          if (fileExt === ".pdf") {
            try {
              const extractPdfText = async (f: File) => {
                const arrayBuffer = await f.arrayBuffer();
                const pdfjsLib: any = await import('pdfjs-dist/legacy/build/pdf');
                try {
                  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
                } catch (err) {}
                const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
                const pdf = await loadingTask.promise;
                let fullText = '';
                for (let i = 1; i <= pdf.numPages; i++) {
                  const page = await pdf.getPage(i);
                  const content = await page.getTextContent();
                  const strings = content.items.map((s: any) => s.str || '');
                  fullText += strings.join(' ') + '\n\n';
                }
                return fullText;
              };

              const extracted = await extractPdfText(file);
              const paragraphs = extracted.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
              if (paragraphs.length) {
                extractedSections = paragraphs.map((p) => ({ paragraphs: [p] }));
              }
            } catch (err) {
              console.error('PDF extraction failed:', err);
            }
          } else {
            console.warn('DOCX extraction is only available via the local extractor service.');
          }
        }
      }

      // =========================
      // Upload Featured Image
      // =========================
      let imageUrl = "";

      if (imageFile) {
        const imageExt = imageFile.name.split(".").pop();

        const imagePath = `${slug}/featured-${Date.now()}.${imageExt}`;

        console.log("Uploading image:", imagePath);

        const { error: imageError } = await supabase.storage
          .from(storageBucket)
          .upload(imagePath, imageFile, {
            cacheControl: "3600",
            upsert: true,
          });

        if (imageError) {
          console.error("Image Upload Error:", imageError);
          throw imageError;
        }

        const {
          data: { publicUrl },
        } = supabase.storage
          .from(storageBucket)
          .getPublicUrl(imagePath);

        imageUrl = publicUrl;

        console.log("Image URL:", imageUrl);
      }

      // =========================
      // Save Blog Post
      // =========================
      const post = {
        slug,
        title: baseName
          .replace(/[-_]/g, " ")
          .replace(/\b\w/g, (c: string) => c.toUpperCase()),

        excerpt: `Download the full blog in ${fileExt
          .slice(1)
          .toUpperCase()} format.`,

        category: "Documents",
        read_time: "PDF/Word",
        date: new Date().toDateString(),
        icon: fileExt === ".pdf" ? "📄" : "📝",
        gradient: "from-slate-500 via-slate-600 to-zinc-700",
        image: imageUrl,
        sections: extractedSections.length ? extractedSections : [],
        file_path: filePath,
        file_type: fileExt.slice(1),
        file_name: file.name,
      };

      const { error: dbError } = await supabase
        .from("blog_posts")
        .upsert([post], {
          onConflict: "slug",
        });

      if (dbError) {
        console.error("Database Error:", dbError);
        throw dbError;
      }

      setMessage({
        type: "success",
        text: "Blog uploaded successfully!",
      });

      setFile(null);
      setImageFile(null);
    } catch (error: any) {
      console.error("Upload Failed:", error);

      setMessage({
        type: "error",
        text: error?.message || "Upload failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto p-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">
          Upload Blog
        </h2>

        {/* Image Upload */}
        <div className="border-2 border-dashed p-4 rounded-lg text-center">
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="image-input"
          />

          <label
            htmlFor="image-input"
            className="cursor-pointer"
          >
            <Upload className="mx-auto mb-2" />
            <p>
              {imageFile
                ? imageFile.name
                : "Upload Featured Image"}
            </p>
          </label>
        </div>

        {/* Document Upload */}
        <div className="border-2 border-dashed p-4 rounded-lg text-center">
          <Input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="hidden"
            id="file-input"
          />

          <label
            htmlFor="file-input"
            className="cursor-pointer"
          >
            <Upload className="mx-auto mb-2" />
            <p>
              {file
                ? file.name
                : "Upload PDF / DOC / DOCX"}
            </p>
          </label>
        </div>

        {message && (
          <Alert
            variant={
              message.type === "success"
                ? "default"
                : "destructive"
            }
          >
            {message.type === "success" ? (
              <CheckCircle />
            ) : (
              <AlertCircle />
            )}

            <AlertDescription>
              {message.text}
            </AlertDescription>
          </Alert>
        )}

        <Button
          onClick={handleUpload}
          disabled={loading || !file}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            "Upload Blog"
          )}
        </Button>
      </div>
    </Card>
  );
};

export default BlogUpload;