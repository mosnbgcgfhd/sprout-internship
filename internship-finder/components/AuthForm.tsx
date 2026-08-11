"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function AuthForm() {
  const supabase = createClient();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setStatus("error");
      setErrorMsg(error.message);
      return;
    }

    // تم تسجيل الدخول بنجاح - روح للصفحة الرئيسية
    router.push("/board");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div>
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
          className="mt-1 w-full rounded-sm border border-ink/15 bg-white px-3 py-2 text-sm outline-none focus:border-moss"
        />
      </div>

      <div>
        <label className="text-sm text-ink/70" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="mt-1 w-full rounded-sm border border-ink/15 bg-white px-3 py-2 text-sm outline-none focus:border-moss"
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-sm bg-moss px-4 py-2 text-sm font-medium text-white hover:bg-moss-dark disabled:opacity-50"
      >
        {status === "loading" ? "Signing in..." : "Sign in"}
      </button>

      {status === "error" && (
        <p className="text-sm text-clay">
          {errorMsg || "Something went wrong — check your email and password."}
        </p>
      )}
    </form>
  );
}