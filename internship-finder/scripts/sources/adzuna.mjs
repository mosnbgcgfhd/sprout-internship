import { isInternship, categorize } from "../classify.mjs";

// Docs: https://developer.adzuna.com/  (free tier: 1,000 calls/month)
export async function fetchAdzuna() {
  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;
  const countries = (process.env.ADZUNA_COUNTRIES || "us").split(",");

  if (!appId || !appKey) {
    console.warn("[adzuna] Skipping — ADZUNA_APP_ID/ADZUNA_APP_KEY not set");
    return [];
  }

  const results = [];

  for (const country of countries) {
    const url = new URL(
      `https://api.adzuna.com/v1/api/jobs/${country.trim()}/search/1`
    );
    url.searchParams.set("app_id", appId);
    url.searchParams.set("app_key", appKey);
    url.searchParams.set("what", "intern OR internship");
    url.searchParams.set("results_per_page", "50");
    url.searchParams.set("sort_by", "date");

    try {
      const res = await fetch(url.toString());
      if (!res.ok) {
        console.warn(`[adzuna] ${country}: HTTP ${res.status}`);
        continue;
      }
      const json = await res.json();

      for (const job of json.results ?? []) {
        if (!isInternship(job.title)) continue;
        results.push({
          source: "adzuna",
          source_id: String(job.id),
          title: job.title,
          company: job.company?.display_name ?? "Unknown",
          location: job.location?.display_name ?? null,
          remote: /remote/i.test(job.location?.display_name ?? ""),
          description: job.description ?? null,
          apply_url: job.redirect_url,
          category: categorize(job.title),
          stipend: job.salary_min
            ? `${Math.round(job.salary_min)}–${Math.round(job.salary_max ?? job.salary_min)}`
            : null,
          posted_at: job.created ?? null,
          expires_at: null,
        });
      }
    } catch (err) {
      console.warn(`[adzuna] ${country}: ${err.message}`);
    }
  }

  return results;
}
