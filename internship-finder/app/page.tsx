import { createClient } from "@/lib/supabase/server";
import type { Listing } from "@/lib/types";
import ListingCard from "@/components/ListingCard";
import FilterBar from "@/components/FilterBar";

export const revalidate = 0;

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: { q?: string; remote?: string; category?: string };
}) {
  const supabase = createClient();

  let query = supabase
    .from("listings")
    .select("*")
    .order("posted_at", { ascending: false })
    .limit(60);

  if (searchParams.q) {
    query = query.or(
      `title.ilike.%${searchParams.q}%,company.ilike.%${searchParams.q}%`
    );
  }
  if (searchParams.remote) {
    query = query.eq("remote", searchParams.remote === "true");
  }
  if (searchParams.category) {
    query = query.eq("category", searchParams.category);
  }

  const { data, error } = await query;
  const listings = (data ?? []) as Listing[];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-ink">
          Real internships, no noise.
        </h1>
        <p className="mt-1 text-ink/60">
          Pulled daily from Adzuna and company career pages. Internships only
          — no full-time roles mixed in.
        </p>
      </div>

      <FilterBar />

      {error && (
        <p className="text-sm text-clay">
          Couldn&rsquo;t load listings — check your Supabase connection in
          .env.local.
        </p>
      )}

      {!error && listings.length === 0 && (
        <div className="card-pin p-8 text-center text-ink/60">
          <p className="font-display text-lg">Nothing here yet.</p>
          <p className="mt-1 text-sm">
            Run <code className="font-mono">npm run fetch:listings</code> to
            pull in real internships, or adjust your filters.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </div>
  );
}
