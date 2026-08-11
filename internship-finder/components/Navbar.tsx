"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function Navbar() {
  const [email, setEmail] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, [supabase]);

  return (
    <header className="border-b border-ink/10 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-display text-2xl font-semibold text-moss-dark">
            Sprout
          </span>
          <span className="hidden font-mono text-xs uppercase tracking-widest text-ink/50 sm:inline">
            internship finder
          </span>
        </Link>
        <nav className="flex items-center gap-5 font-body text-sm">
          <Link href="/" className="hover:text-moss-dark">
            Browse
          </Link>
          <Link href="/board" className="hover:text-moss-dark">
            My board
          </Link>
          {email ? (
            <button
              onClick={() => supabase.auth.signOut()}
              className="rounded-sm border border-ink/15 px-3 py-1.5 hover:border-ink/30"
            >
              Sign out
            </button>
          ) : (
            <Link
              href="/login"
              className="rounded-sm bg-moss px-3 py-1.5 text-white hover:bg-moss-dark"
            >
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
