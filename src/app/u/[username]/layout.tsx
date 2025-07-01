import { notFound } from "next/navigation";
import Page from "./page";
import type { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";

async function getProfileByUsername(username: string) {
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username, avatar, bio, created_at, accepting_messages")
    .eq("username", username)
    .single();
  return profile;
}

export async function generateMetadata({
  params,
}: {
  params: { username: string };
}): Promise<Metadata> {
  const profile = await getProfileByUsername(params.username);

  if (!profile) return {};

  return {
    title: `@${profile.username}`,
    description:
      profile.bio || `Message @${profile.username} anonymously on No Cap.`,
  };
}

export default async function Layout({
  params,
}: {
  children: React.ReactNode;
  params: { username: string };
}) {
  const profile = await getProfileByUsername(params.username);

  if (!profile) return notFound();

  return (
    <main className="bg-main-gradient min-h-screen w-full">
      <Page profile={profile} />
    </main>
  );
}
