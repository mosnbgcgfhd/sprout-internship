// Run with: npm run fetch:listings
// Intended to run on a daily schedule (see .github/workflows/fetch-listings.yml)
// Requires SUPABASE_SERVICE_ROLE_KEY — this bypasses row-level security,
// so it must only ever run server-side, never in the browser.

import { createClient } from "@supabase/supabase-js";
import { fetchAdzuna } from "./sources/adzuna.mjs";
import { fetchGreenhouse } from "./sources/greenhouse.mjs";
import { fetchLever } from "./sources/lever.mjs";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in the environment."
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

async function main() {
  console.log("Fetching from all sources…");
  const [adzuna, greenhouse, lever] = await Promise.all([
    fetchAdzuna(),
    fetchGreenhouse(),
    fetchLever(),
  ]);

  const all = [...adzuna, ...greenhouse, ...lever];
  console.log(
    `Adzuna: ${adzuna.length} · Greenhouse: ${greenhouse.length} · Lever: ${lever.length} · Total: ${all.length}`
  );

  if (all.length === 0) {
    console.log("Nothing to upsert. Check your API keys / company list.");
    return;
  }

  // upsert in batches to stay well under request size limits
  const BATCH = 200;
  for (let i = 0; i < all.length; i += BATCH) {
    const batch = all.slice(i, i + BATCH);
    const { error } = await supabase
      .from("listings")
      .upsert(batch, { onConflict: "source,source_id" });
    if (error) {
      console.error(`Batch ${i / BATCH} failed:`, error.message);
    } else {
      console.log(`Upserted batch ${i / BATCH + 1} (${batch.length} rows)`);
    }
  }

  // Clean up listings that have hit their expiry date, if one was given
  const { error: cleanupError } = await supabase
    .from("listings")
    .delete()
    .lt("expires_at", new Date().toISOString());
  if (cleanupError) {
    console.warn("Cleanup skipped:", cleanupError.message);
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
