export interface Profile {
  id: string;
  created_at: string;
  username: string | null;
  bio: string | null;
  avatar: string | null;
  accepting_messages: boolean;
}
