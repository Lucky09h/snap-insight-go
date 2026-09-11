# Focused organic SEO improvements

## Homepage
- Replace the current homepage heading with the requested single H1: “AI Image Analyzer – Identify Anything From a Photo”.
- Add the requested introduction directly beneath it while preserving the analyzer controls and visual styling.
- Add a visible “AI Image Analyzer Examples” section with four concise, genuine use examples for plants, animals, food, and objects. Use lightweight existing iconography rather than adding heavy image assets or fabricated analysis results.
- Add a short use-case section covering objects, plants, animals, food, products, and everyday photos without accuracy claims.
- Update only the homepage title and description to the exact requested wording.
- Add factual `SoftwareApplication` structured data without ratings, reviews, prices, or usage claims.
- Keep the existing visible FAQ but align its five questions and answers with the requested topics.

## Blog discovery and article SEO
- Add a reusable visible breadcrumb to every article: Home > Blog > Article.
- Add matching `BreadcrumbList` structured data to each article.
- Preserve every article URL and existing body content.
- Keep each article’s existing unique title, description, self-canonical, Article structured data, and single H1.
- Add a small related-articles section where missing, using descriptive links to existing published articles.
- Preserve each article’s natural link and CTA back to the SnapInfo analyzer.
- Keep the Blog page as the complete visible listing of all published articles, and retain the homepage’s visible Blog link.

## Verification
- Confirm every content page returns successfully, remains indexable, has one canonical, and appears in the existing sitemap.
- Confirm robots.txt remains unchanged and continues to expose the sitemap.
- Test desktop and mobile rendering for heading fit, examples, breadcrumbs, and links.
- Exercise Take Photo and Upload Image controls, then test AI analysis and the resulting Copy and Share controls with a safe local image.
- Confirm Monetag, Google Analytics, Google Search Console verification, ad code, sitemap structure, URLs, and integrations remain unchanged.
- Publish the verified SEO-only update to the existing production URL.

## Technical details
- Reuse TanStack route `head()` metadata and JSON-LD scripts; do not introduce another metadata system.
- Use the existing Tailwind tokens, Lucide icons, and current card/link styling; add no dependencies or heavy media.
- Do not add FAQ structured data to the homepage.
