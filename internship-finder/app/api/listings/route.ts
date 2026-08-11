import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const supabase = createClient();

  let query = supabase
    .from("listings")
    .select("*")
    .order("posted_at", { ascending: false })
    .limit(60);

  const q = searchParams.get("q");
  const remote = searchParams.get("remote");
  const category = searchParams.get("category");

  if (q) query = query.or(`title.ilike.%${q}%,company.ilike.%${q}%`);
  if (remote) query = query.eq("remote", remote === "true");
  if (category) query = query.eq("category", category);

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ items: data });
}
