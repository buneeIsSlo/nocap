import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  if (!code) {
    console.error("No code provided in callback");
    throw new Error("No code provided");
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.exchangeCodeForSession(code);

  if (user?.email) {
    const username = user.email.split("@")[0];
    return NextResponse.redirect(`${requestUrl.origin}/u/${username}`);
  }

  return NextResponse.redirect(requestUrl.origin);
}
