import { Link } from "@tanstack/react-router";

type RelatedArticle = {
  to: string;
  title: string;
};

export function ArticleBreadcrumb({ title }: { title: string }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link to="/" className="hover:text-foreground hover:underline">
            Home
          </Link>
        </li>
        <li aria-hidden="true">›</li>
        <li>
          <Link to="/blog" className="hover:text-foreground hover:underline">
            Blog
          </Link>
        </li>
        <li aria-hidden="true">›</li>
        <li aria-current="page" className="text-foreground">
          {title}
        </li>
      </ol>
    </nav>
  );
}

export function RelatedArticles({ articles }: { articles: RelatedArticle[] }) {
  return (
    <section className="mt-10 border-t border-border pt-8">
      <h2 className="text-2xl font-bold mb-4 text-foreground">Related articles</h2>
      <ul className="space-y-3">
        {articles.map((article) => (
          <li key={article.to}>
            <Link to={article.to} className="text-primary hover:underline font-medium">
              {article.title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function createBreadcrumbSchema(title: string, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://snap-insight-go.lovable.app/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: "https://snap-insight-go.lovable.app/blog",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: title,
        item: url,
      },
    ],
  };
}