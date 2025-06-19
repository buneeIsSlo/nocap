export interface Profile {
  id: string;
  created_at: string;
  username: string | null;
  description: string | null;
  avatar: string | null;
  accepting_messages: boolean;
}
