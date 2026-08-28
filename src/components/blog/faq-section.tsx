export interface FAQItem {
  question: string;
  answer: string;
}

export function FAQSection({ items }: { items: FAQItem[] }) {
  return (
    <section className="mt-10 rounded-2xl bg-card border border-border p-6 shadow-sm">
      <h2 className="text-2xl font-bold mb-5 text-foreground">Frequently asked questions</h2>
      <dl className="space-y-5">
        {items.map((item, idx) => (
          <div key={idx}>
            <dt className="font-semibold text-foreground mb-1">{item.question}</dt>
            <dd className="text-foreground/80 leading-relaxed">{item.answer}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
