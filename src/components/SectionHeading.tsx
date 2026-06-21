export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  center,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <div className={`max-w-2xl ${center ? "mx-auto text-center" : ""}`}>
      {eyebrow && (
        <span className="text-xs uppercase tracking-[0.3em] text-gold">{eyebrow}</span>
      )}
      <h2 className="font-serif text-3xl sm:text-4xl mt-3 leading-tight">{title}</h2>
      {subtitle && <p className="text-muted mt-4 leading-relaxed">{subtitle}</p>}
      <div className={`h-px w-16 bg-gold mt-6 ${center ? "mx-auto" : ""}`} />
    </div>
  );
}
