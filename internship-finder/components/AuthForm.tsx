"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AuthForm() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo:
          typeof window !== "undefined" ? window.location.origin : undefined,
      },
    });
    setStatus(error ? "error" : "sent");
  }

  if (status === "sent") {
    return (
      <p className="text-sm text-ink/70">
        Check <strong>{email}</strong> for a sign-in link.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <label className="text-sm text-ink/70" htmlFor="email">
        Email
      </label>
      <input
        id="email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@school.edu"
        className="rounded-sm border border-ink/15 bg-white px-3 py-2 text-sm outline-none focus:border-moss"
      />
      <button
        type="submit"
        className="rounded-sm bg-moss px-4 py-2 text-sm font-medium text-white hover:bg-moss-dark"
      >
        Send sign-in link
      </button>
      {status === "error" && (
        <p className="text-sm text-clay">
          Something went wrong — double check your Supabase env vars.
        </p>
      )}
    </form>
  );
}
