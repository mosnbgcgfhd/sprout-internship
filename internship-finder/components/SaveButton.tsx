"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function SaveButton({ listingId }: { listingId: string }) {
  const supabase = createClient();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      setSignedIn(true);
      const { data: existing } = await supabase
        .from("saved_applications")
        .select("id")
        .eq("listing_id", listingId)
        .maybeSingle();
      setSaved(!!existing);
    });
  }, [listingId, supabase]);

  async function toggle() {
    if (!signedIn) {
      window.location.href = "/login";
      return;
    }
    setLoading(true);
    if (saved) {
      await fetch(`/api/saved/${listingId}`, { method: "DELETE" });
      setSaved(false);
    } else {
      await fetch("/api/saved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listing_id: listingId }),
      });
      setSaved(true);
    }
    setLoading(false);
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      aria-pressed={saved}
      title={saved ? "Remove from board" : "Save to board"}
      className={`shrink-0 rounded-sm border px-2 py-1 text-xs font-mono transition-colors ${
        saved
          ? "border-gold bg-gold/20 text-ink"
          : "border-ink/15 text-ink/50 hover:border-ink/30"
      }`}
    >
      {saved ? "★ saved" : "☆ save"}
    </button>
  );
}
