export function ArticleTopCTA() {
  return (
    <section className="my-8 rounded-2xl bg-card border border-border p-6 shadow-sm text-center">
      <p className="text-foreground/80 leading-relaxed mb-4">
        Want to analyze a photo yourself? Try SnapInfo's free AI Image Analyzer. Upload an image and
        get an AI-powered analysis in seconds.
      </p>
      <a
        href="https://snap-insight-go.lovable.app/"
        className="inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5 font-semibold text-primary-foreground hover:opacity-95 transition-opacity"
        style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
      >
        📸 Try SnapInfo AI Image Analyzer
      </a>
    </section>
  );
}

export function ArticleBottomCTA() {
  return (
    <section className="my-8 rounded-2xl bg-card border border-border p-6 shadow-sm text-center">
      <p className="text-foreground/80 leading-relaxed mb-4">
        Ready to try it yourself? Upload a photo to SnapInfo and see what AI can identify.
      </p>
      <a
        href="https://snap-insight-go.lovable.app/"
        className="inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5 font-semibold text-primary-foreground hover:opacity-95 transition-opacity"
        style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
      >
        🚀 Try SnapInfo Free
      </a>
    </section>
  );
}
