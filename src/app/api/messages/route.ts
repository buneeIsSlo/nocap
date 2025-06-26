import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Unauthorized request" },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(req.url);
    const since = searchParams.get("since");
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);

    let query = supabase
      .from("messages")
      .select(
        "id, profile_id, content, created_at, is_sender_authenticated, is_sender_visible",
        { count: "exact" }, // Returns total number of rows exactly
      )
      .eq("profile_id", user.id);

    // If since_timestamp is provided, fetch only newer message
    if (since) {
      query = query
        .gt("created_at", since)
        .order("created_at", { ascending: false });
    } else {
      // Regular pagination for infinite scroll
      query = query
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);
    }

    const { data: messages, error: messagesError, count } = await query;

    if (messagesError) {
      return NextResponse.json(
        { error: messagesError.message },
        { status: 500 },
      );
    }

    return NextResponse.json({ messages, count });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

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

export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Unauthorized request" },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(req.url);
    const messageId = searchParams.get("id");
    if (!messageId) {
      return NextResponse.json(
        { error: "Missing message id" },
        { status: 400 },
      );
    }

    // Check ownership
    const { data: message, error: fetchError } = await supabase
      .from("messages")
      .select("id, profile_id")
      .eq("id", messageId)
      .single();

    if (fetchError || !message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }
    if (message.profile_id !== user.id) {
      return NextResponse.json(
        { error: "Unauthorized request" },
        { status: 403 },
      );
    }

    const { error: deleteError } = await supabase
      .from("messages")
      .delete()
      .eq("id", messageId);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
