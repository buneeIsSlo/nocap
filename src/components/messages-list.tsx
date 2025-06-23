import { useQuery } from "@tanstack/react-query";
import { MessageCard } from "./message-card";
import { getRelativeTime } from "@/lib/utils";

export default function MessagesList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["messages"],
    queryFn: async () => {
      const res = await fetch("/api/messages");
      return res.json();
    },
  });

  if (isLoading)
    return <div className="py-8 text-center">Loading messages...</div>;
  if (error)
    return (
      <div className="text-destructive py-8 text-center">
        Failed to load messages.
      </div>
    );
  if (!data?.messages?.length)
    return (
      <div className="py-8 text-center text-gray-400">No messages yet.</div>
    );

  return (
    <ul className="columns-2 gap-4 py-8">
      {data.messages.map((msg: any) => (
        <li key={msg.id} className="mb-4 break-inside-avoid">
          <MessageCard
            question={msg.content}
            time={getRelativeTime(msg.created_at)}
            name={
              msg.is_sender_visible && msg.sender_id
                ? msg.sender_id
                : "Anonymous"
            }
            className="h-full w-full"
          />
        </li>
      ))}
    </ul>
  );
}
