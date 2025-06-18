import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { nanoid } from "nanoid";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  if (!code) {
    console.error("No code provided in callback");
    throw new Error("No code provided");
  }

  const supabase = await createClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.exchangeCodeForSession(code);

    if (!user?.email) {
      throw new Error("No user email found");
    }

    // Check if profile exists
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("email")
      .eq("id", user.id)
      .single();

    let username: string;

    if (!existingProfile) {
      username = user.email.split("@")[0] + nanoid(10);
      const { error: insertError } = await supabase.from("profiles").insert({
        id: user.id,
        email: user.email,
        username,
        avatar: user.user_metadata.avatar_url,
      });

      if (insertError) throw insertError;
    } else {
      const { data: profile } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .single();

      if (!profile?.username) throw new Error("No username found");
      username = profile.username;
    }

    return NextResponse.redirect(`${requestUrl.origin}/u/${username}`);
  } catch (error) {
    console.error("Error in callback:", error);
    return NextResponse.redirect(`${requestUrl.origin}`);
  }
}
