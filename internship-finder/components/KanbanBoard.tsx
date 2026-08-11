"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  APPLICATION_STAGES,
  type ApplicationStatus,
  type SavedApplication,
} from "@/lib/types";

export default function KanbanBoard() {
  const supabase = createClient();
  const [items, setItems] = useState<SavedApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [dragId, setDragId] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/saved");
    if (res.ok) {
      const data = await res.json();
      setItems(data.items ?? []);
    }
    setLoading(false);
  }

  async function moveTo(id: string, status: ApplicationStatus) {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, status } : it))
    );
    await fetch(`/api/saved/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  }

  if (loading) {
    return <p className="text-ink/50">Loading your board…</p>;
  }

  if (items.length === 0) {
    return (
      <div className="card-pin p-8 text-center text-ink/60">
        <p className="font-display text-lg">Your board is empty.</p>
        <p className="mt-1 text-sm">
          Save an internship from the browse page and it&rsquo;ll show up
          here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {APPLICATION_STAGES.map((stage) => {
        const stageItems = items.filter((it) => it.status === stage.id);
        return (
          <div
            key={stage.id}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => dragId && moveTo(dragId, stage.id)}
            className="flex min-h-[200px] flex-col gap-3 rounded-sm border border-dashed border-ink/15 bg-white/40 p-3"
          >
            <h2 className="font-mono text-xs uppercase tracking-widest text-ink/50">
              {stage.label} · {stageItems.length}
            </h2>
            {stageItems.map((item) => (
              <div
                key={item.id}
                draggable
                onDragStart={() => setDragId(item.id)}
                className="card-pin cursor-grab p-3 active:cursor-grabbing"
              >
                <p className="font-display text-sm font-semibold leading-snug">
                  {item.listing.title}
                </p>
                <p className="text-xs text-ink/60">{item.listing.company}</p>
                <select
                  value={item.status}
                  onChange={(e) =>
                    moveTo(item.id, e.target.value as ApplicationStatus)
                  }
                  className="mt-2 w-full rounded-sm border border-ink/15 bg-white px-2 py-1 text-xs sm:hidden"
                >
                  {APPLICATION_STAGES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
