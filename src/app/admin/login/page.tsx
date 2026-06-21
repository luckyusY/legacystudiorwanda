"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.get("email"),
          password: form.get("password"),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed.");
      router.replace("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="font-serif text-3xl text-gradient-gold">Legacy Studio</span>
          <p className="text-xs uppercase tracking-[0.3em] text-muted mt-2">Admin Panel</p>
        </div>

        <form onSubmit={handleSubmit} className="card rounded-2xl p-7 grid gap-4">
          <label className="block">
            <span className="text-xs uppercase tracking-widest text-muted">Email</span>
            <input
              name="email"
              type="email"
              required
              className="w-full bg-charcoal-2 border border-border rounded-lg px-4 py-3 text-sm mt-2 focus:outline-none focus:border-gold"
              placeholder="admin@mylegacystudio.com"
            />
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-widest text-muted">Password</span>
            <input
              name="password"
              type="password"
              required
              className="w-full bg-charcoal-2 border border-border rounded-lg px-4 py-3 text-sm mt-2 focus:outline-none focus:border-gold"
              placeholder="••••••••"
            />
          </label>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="btn-gold rounded-lg px-6 py-3 mt-2 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
