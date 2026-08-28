import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/blog/")({
  component: BlogIndex,
  head: () => ({
    meta: [
      { title: "SnapInfo AI Blog – AI Image Analysis Tips & Guides" },
      {
        name: "description",
        content:
          "Read practical guides about AI image analysis. Learn what AI can tell you about a photo, how to analyze images, and how SnapInfo AI works.",
      },
      {
        property: "og:title",
        content: "SnapInfo AI Blog – AI Image Analysis Tips & Guides",
      },
      {
        property: "og:description",
        content:
          "Practical guides about AI image analysis, from object recognition to everyday use cases.",
      },
      { property: "og:url", content: "https://snap-insight-go.lovable.app/blog/" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "SnapInfo AI Blog – AI Image Analysis Tips & Guides" },
      {
        name: "twitter:description",
        content:
          "Practical guides about AI image analysis, from object recognition to everyday use cases.",
      },
    ],
    links: [{ rel: "canonical", href: "https://snap-insight-go.lovable.app/blog" }],
  }),
});

const posts = [
  {
    slug: "/blog/what-can-ai-image-analysis-tell-you-about-a-photo",
    title: "What Can AI Image Analysis Tell You About a Photo?",
    summary:
      "Discover the kinds of information AI can extract from a single image, from objects and scenes to text, colors, and context.",
  },
  {
    slug: "/blog/how-to-analyze-an-image-with-ai",
    title: "How to Analyze an Image With AI",
    summary:
      "A simple step-by-step guide to uploading or snapping a photo and getting useful AI-powered insights in seconds.",
  },
  {
    slug: "/blog/what-is-an-ai-image-analyzer",
    title: "What Is an AI Image Analyzer?",
    summary:
      "Learn what an AI image analyzer is, how it works, and how it can help with everyday tasks like shopping, travel, and learning.",
  },
];

function BlogIndex() {
  return (
    <div className="max-w-3xl mx-auto px-5 py-10">
      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">SnapInfo AI Blog</h1>
      <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
        Practical tips and guides about AI image analysis. Learn how to get more from every photo.
      </p>

      <div className="grid gap-6">
        {posts.map((post) => (
          <Link
            key={post.slug}
            to={post.slug}
            className="group block rounded-2xl bg-card border border-border p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <h2 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
              {post.title}
            </h2>
            <p className="text-foreground/80 leading-relaxed">{post.summary}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
