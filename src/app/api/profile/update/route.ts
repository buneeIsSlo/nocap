import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const supabase = await createClient();

  const { id, username, bio, avatar } = await req.json();

  if (!id || !username) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  const { data: existing, error: checkError } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", username)
    .neq("id", id)
    .maybeSingle();

  if (checkError) {
    return NextResponse.json(
      { error: "Failed to check username" },
      { status: 500 },
    );
  }
  if (existing) {
    return NextResponse.json(
      { error: "Unsername is already taken" },
      { status: 409 },
    );
  }

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ username, bio, avatar })
    .eq("id", id);

  if (updateError) {
    return NextResponse.json(
      { error: "Failed to update user profile" },
      { status: 400 },
    );
  }

  return NextResponse.json({ success: true });
}
