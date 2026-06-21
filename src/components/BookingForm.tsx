"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { BOOKING_SERVICES } from "@/lib/content";

const FIELD =
  "w-full bg-charcoal-2 border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted/70 focus:outline-none focus:border-gold transition-colors";

export default function BookingForm() {
  const params = useSearchParams();
  const presetPackage = params.get("package") || "";

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit booking.");
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
        <h3 className="font-serif text-2xl mt-5">Request received!</h3>
        <p className="text-muted mt-3 max-w-md mx-auto">
          Thank you for choosing Legacy Studio. Our team will reach out shortly to confirm the
          details of your session.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card rounded-2xl p-7 sm:p-9 grid gap-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Full name *">
          <input name="name" required className={FIELD} placeholder="Your name" />
        </Field>
        <Field label="Phone *">
          <input name="phone" required className={FIELD} placeholder="(250) ..." />
        </Field>
      </div>

      <Field label="Email *">
        <input name="email" type="email" required className={FIELD} placeholder="you@email.com" />
      </Field>

      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Service *">
          <select name="service" required defaultValue="" className={FIELD}>
            <option value="" disabled>
              Choose a service
            </option>
            {BOOKING_SERVICES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Package (optional)">
          <input
            name="packageName"
            defaultValue={presetPackage}
            className={FIELD}
            placeholder="e.g. Gold, Premium Wedding"
          />
        </Field>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Preferred date">
          <input name="eventDate" type="date" className={FIELD} />
        </Field>
        <Field label="Location">
          <input name="location" className={FIELD} placeholder="Venue or area" />
        </Field>
      </div>

      <Field label="Tell us about your vision">
        <textarea name="message" rows={4} className={FIELD} placeholder="Share any details, ideas or questions..." />
      </Field>

      {status === "error" && <p className="text-red-400 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={status === "loading"}
        className="btn-gold rounded-full px-8 py-3.5 disabled:opacity-60"
      >
        {status === "loading" ? "Sending..." : "Request Booking"}
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-widest text-muted">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}
