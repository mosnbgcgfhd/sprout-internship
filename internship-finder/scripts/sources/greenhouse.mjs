import { isInternship, categorize } from "../classify.mjs";
import companies from "./companies.json" with { type: "json" };

// Docs: https://developers.greenhouse.io/job-board.html
// Every company on Greenhouse exposes a free, public, unauthenticated
// job board API at this URL — no key needed. Add/remove slugs in
// companies.json. Find a company's slug from its careers page URL:
// boards.greenhouse.io/<slug>
export async function fetchGreenhouse() {
  const results = [];

  for (const slug of companies.greenhouse) {
    const url = `https://boards-api.greenhouse.io/v1/boards/${slug}/jobs?content=true`;
    try {
      const res = await fetch(url);
      if (!res.ok) {
        console.warn(`[greenhouse] ${slug}: HTTP ${res.status}`);
        continue;
      }
      const json = await res.json();

      for (const job of json.jobs ?? []) {
        if (!isInternship(job.title)) continue;
        results.push({
          source: "greenhouse",
          source_id: String(job.id),
          title: job.title,
          company: slug,
          location: job.location?.name ?? null,
          remote: /remote/i.test(job.location?.name ?? ""),
          description: job.content ?? null,
          apply_url: job.absolute_url,
          category: categorize(job.title),
          stipend: null,
          posted_at: job.updated_at ?? null,
          expires_at: null,
        });
      }
    } catch (err) {
      console.warn(`[greenhouse] ${slug}: ${err.message}`);
    }
  }

  return results;
}
