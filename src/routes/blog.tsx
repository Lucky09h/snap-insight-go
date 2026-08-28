import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/blog")({
  component: BlogLayout,
});

function BlogLayout() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--gradient-soft)" }}>
      <header className="w-full border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-5 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-primary-foreground"
              style={{ background: "var(--gradient-primary)" }}
            >
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-bold text-foreground">SnapInfo</span>
          </Link>
          <Link
            to="/blog"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Blog
          </Link>
        </div>
      </header>

      <main className="flex-1 w-full">
        <Outlet />
      </main>

      <footer className="py-6 text-center text-xs text-muted-foreground border-t border-border">
        &copy; {new Date().getFullYear()} SnapInfo AI · Powered by AI
      </footer>
    </div>
  );
}
