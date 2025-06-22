import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      profile_id,
      content,
      sender_id,
      is_sender_authenticated,
      is_sender_visible,
    } = body;

    if (
      !profile_id ||
      !content ||
      typeof content !== "string" ||
      content.trim().length === 0
    ) {
      return NextResponse.json(
        { error: "Missing or invalid profile_id or content" },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    // Check if the profile is accepting messages
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("accepting_messages")
      .eq("id", profile_id)
      .single();

    if (profileError) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }
    if (!profile?.accepting_messages) {
      return NextResponse.json(
        { error: "This user is not accepting messages right now." },
        { status: 403 },
      );
    }

    const { error, data } = await supabase
      .from("messages")
      .insert([
        {
          profile_id,
          content,
          sender_id: sender_id || null,
          is_sender_authenticated: !!is_sender_authenticated,
          is_sender_visible: !!is_sender_visible,
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: data });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Internal server error" },
      { status: 500 },
    );
  }
}
