import { isInternship, categorize } from "../classify.mjs";
import companies from "./companies.json" with { type: "json" };

// Docs: https://github.com/lever/postings-api
// Public, unauthenticated postings API — no key needed. Find a company's
// slug from its careers page URL: jobs.lever.co/<slug>
export async function fetchLever() {
  const results = [];

  for (const slug of companies.lever) {
    const url = `https://api.lever.co/v0/postings/${slug}?mode=json`;
    try {
      const res = await fetch(url);
      if (!res.ok) {
        console.warn(`[lever] ${slug}: HTTP ${res.status}`);
        continue;
      }
      const jobs = await res.json();

      for (const job of jobs ?? []) {
        if (!isInternship(job.text)) continue;
        results.push({
          source: "lever",
          source_id: String(job.id),
          title: job.text,
          company: slug,
          location: job.categories?.location ?? null,
          remote: /remote/i.test(job.categories?.location ?? ""),
          description: job.descriptionPlain ?? null,
          apply_url: job.hostedUrl,
          category: categorize(job.text),
          stipend: null,
          posted_at: job.createdAt
            ? new Date(job.createdAt).toISOString()
            : null,
          expires_at: null,
        });
      }
    } catch (err) {
      console.warn(`[lever] ${slug}: ${err.message}`);
    }
  }

  return results;
}
