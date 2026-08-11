import type { Listing } from "@/lib/types";
import SaveButton from "./SaveButton";

function timeAgo(dateStr: string | null) {
  if (!dateStr) return null;
  const days = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / 86_400_000
  );
  if (days <= 0) return "today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

export default function ListingCard({ listing }: { listing: Listing }) {
  return (
    <article className="card-pin flex flex-col gap-3 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-semibold leading-snug">
            {listing.title}
          </h3>
          <p className="text-sm text-ink/70">{listing.company}</p>
        </div>
        <SaveButton listingId={listing.id} />
      </div>

      <div className="flex flex-wrap gap-2">
        {listing.remote && (
          <span className="stamp border-moss/40 text-moss-dark">Remote</span>
        )}
        {listing.location && (
          <span className="stamp border-ink/15 text-ink/60">
            {listing.location}
          </span>
        )}
        {listing.category && (
          <span className="stamp border-clay/40 text-clay">
            {listing.category}
          </span>
        )}
        {listing.stipend && (
          <span className="stamp border-gold/60 text-ink/70">
            {listing.stipend}
          </span>
        )}
      </div>

      {listing.description && (
        <p className="line-clamp-3 text-sm text-ink/70">
          {listing.description}
        </p>
      )}

      <div className="mt-1 flex items-center justify-between">
        <span className="font-mono text-xs text-ink/40">
          {timeAgo(listing.posted_at) ?? "recently posted"}
        </span>
        <a
          href={listing.apply_url}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-sm bg-ink px-3 py-1.5 text-xs font-medium text-paper hover:bg-moss-dark"
        >
          View & apply
        </a>
      </div>
    </article>
  );
}
