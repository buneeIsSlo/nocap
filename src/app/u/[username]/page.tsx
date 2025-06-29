import ProfileOwnerView from "./profile-owner-view";
import { createClient } from "@/utils/supabase/server";
import { Profile } from "@/lib/types";
import ProfileView from "./profile-view";

interface PageProps {
  profile: Profile;
}

export default async function Page({ profile }: PageProps) {
  const supabase = await createClient();
  const {
    data: { user: loggedInUser },
  } = await supabase.auth.getUser();

  let loggedInProfile = null;
  if (loggedInUser) {
    if (loggedInUser.id === profile.id) {
      loggedInProfile = profile;
    } else {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", loggedInUser.id)
        .single();
      loggedInProfile = data;
    }
  }

  if (loggedInUser && loggedInUser.id === profile.id) {
    return <ProfileOwnerView profile={profile} />;
  }

  return <ProfileView profile={profile} loggedInProfile={loggedInProfile} />;
}
