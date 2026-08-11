import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// The :id param can be either the saved_applications row id (used by the
// kanban board, which already loaded that id) or the underlying listing_id
// (used by SaveButton, which only knows the listing it's sitting on).
// We match on either, scoped to the signed-in user so no one else's rows
// are touched.

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const { status, notes } = await request.json();

  const { data, error } = await supabase
    .from("saved_applications")
    .update({
      ...(status ? { status } : {}),
      ...(notes !== undefined ? { notes } : {}),
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", user.id)
    .or(`id.eq.${params.id},listing_id.eq.${params.id}`)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ item: data });
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const { error } = await supabase
    .from("saved_applications")
    .delete()
    .eq("user_id", user.id)
    .or(`id.eq.${params.id},listing_id.eq.${params.id}`);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
