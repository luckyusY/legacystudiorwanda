"use client";

import { useState } from "react";

const FIELD =
  "w-full bg-charcoal-2 border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted/70 focus:outline-none focus:border-gold transition-colors";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send message.");
      setStatus("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="card rounded-2xl p-10 text-center">
        <div className="mx-auto w-14 h-14 rounded-full border-2 border-gold flex items-center justify-center text-gold text-2xl">
          ✓
        </div>
        <h3 className="font-serif text-2xl mt-5">Message sent!</h3>
        <p className="text-muted mt-3">We&apos;ll get back to you as soon as possible.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card rounded-2xl p-7 sm:p-9 grid gap-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <label className="block">
          <span className="text-xs uppercase tracking-widest text-muted">Name *</span>
          <input name="name" required className={`${FIELD} mt-2`} placeholder="Your name" />
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-widest text-muted">Email *</span>
          <input name="email" type="email" required className={`${FIELD} mt-2`} placeholder="you@email.com" />
        </label>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <label className="block">
          <span className="text-xs uppercase tracking-widest text-muted">Phone</span>
          <input name="phone" className={`${FIELD} mt-2`} placeholder="(250) ..." />
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-widest text-muted">Subject</span>
          <input name="subject" className={`${FIELD} mt-2`} placeholder="How can we help?" />
        </label>
      </div>

      <label className="block">
        <span className="text-xs uppercase tracking-widest text-muted">Message *</span>
        <textarea name="message" rows={5} required className={`${FIELD} mt-2`} placeholder="Write your message..." />
      </label>

      {status === "error" && <p className="text-red-400 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={status === "loading"}
        className="btn-gold rounded-full px-8 py-3.5 disabled:opacity-60"
      >
        {status === "loading" ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
