"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function FilterBar() {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");

  function apply(next: Record<string, string | null>) {
    const sp = new URLSearchParams(params.toString());
    for (const [key, value] of Object.entries(next)) {
      if (value) sp.set(key, value);
      else sp.delete(key);
    }
    router.push(`/?${sp.toString()}`);
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        apply({ q });
      }}
      className="card-pin flex flex-wrap items-center gap-3 p-4"
    >
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search title or company…"
        className="min-w-[200px] flex-1 rounded-sm border border-ink/15 bg-white px-3 py-2 text-sm outline-none focus:border-moss"
      />
      <select
        defaultValue={params.get("remote") ?? ""}
        onChange={(e) => apply({ remote: e.target.value || null })}
        className="rounded-sm border border-ink/15 bg-white px-3 py-2 text-sm"
      >
        <option value="">Remote &amp; on-site</option>
        <option value="true">Remote only</option>
        <option value="false">On-site only</option>
      </select>
      <select
        defaultValue={params.get("category") ?? ""}
        onChange={(e) => apply({ category: e.target.value || null })}
        className="rounded-sm border border-ink/15 bg-white px-3 py-2 text-sm"
      >
        <option value="">All categories</option>
        <option value="engineering">Engineering</option>
        <option value="design">Design</option>
        <option value="marketing">Marketing</option>
        <option value="data">Data</option>
        <option value="business">Business</option>
      </select>
      <button
        type="submit"
        className="rounded-sm bg-moss px-4 py-2 text-sm font-medium text-white hover:bg-moss-dark"
      >
        Search
      </button>
    </form>
  );
}
