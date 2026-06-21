export default function PageHero({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="relative py-24 border-b border-border overflow-hidden">
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(circle at 70% 30%, rgba(201,162,75,0.12), transparent 45%), #0b0b0d",
        }}
      />
      <div className="container-x">
        <span className="text-xs uppercase tracking-[0.4em] text-gold">{eyebrow}</span>
        <h1 className="font-serif text-4xl sm:text-5xl mt-5 max-w-3xl leading-tight">{title}</h1>
        {subtitle && <p className="text-muted mt-5 max-w-2xl leading-relaxed">{subtitle}</p>}
      </div>
    </section>
  );
}
