import { blogPosts } from "@/data/blogPosts";
import { supabase } from "@/integrations/supabase/client";

export const importDefaultBlogPosts = async () => {
  try {
    const postsToInsert = blogPosts.map((post) => ({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      category: post.category,
      read_time: post.readTime,
      date: post.date,
      icon: post.icon,
      gradient: post.gradient,
      sections: post.sections,
    }));

    const { error, data } = await supabase
      .from("blog_posts")
      .upsert(postsToInsert, { onConflict: "slug" });

    if (error) {
      throw error;
    }

    return {
      success: true,
      message: `Successfully imported ${postsToInsert.length} blog posts!`,
      count: postsToInsert.length,
    };
  } catch (error) {
    console.error("Error importing blog posts:", error);
    throw error;
  }
};
