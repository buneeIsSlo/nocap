import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Page from "./page";

export default async function Layout({
  params,
}: {
  children: React.ReactNode;
  params: { username: string };
}) {
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username, avatar, bio, created_at, accepting_messages")
    .eq("username", params.username)
    .single();

  if (!profile) return notFound();

  return (
    <main className="bg-main-gradient min-h-screen w-full">
      <Page profile={profile} />
    </main>
  );
}
