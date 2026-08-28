import { Sparkles } from "lucide-react";

export function TrySnapInfoButton() {
  return (
    <a
      href="https://snap-insight-go.lovable.app/"
      className="inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5 font-semibold text-primary-foreground hover:opacity-95 transition-opacity"
      style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
    >
      <Sparkles className="w-4 h-4" />
      Try SnapInfo AI
    </a>
  );
}
