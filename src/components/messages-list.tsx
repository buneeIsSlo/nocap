import { useInfiniteQuery } from "@tanstack/react-query";
import { MessageCard } from "./message-card";
import InfiniteScrollContainer from "./infinite-scroll-container";
import { getRelativeTime } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { Squircle } from "@squircle-js/react";

const LIMIT = 10;

function MessageLoader({ text = "Loading Messages..." }) {
  return (
    <Squircle
      cornerRadius={15}
      cornerSmoothing={1}
      className="col-span-full mx-auto mt-4 flex w-fit justify-center bg-white"
    >
      <div className="flex items-center justify-center gap-2 p-4 font-semibold">
        <Loader2 className="text-primary animate-spin" />
        {text}
      </div>
    </Squircle>
  );
}

export default function MessagesList() {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["messages"],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await fetch(
        `/api/messages?limit=${LIMIT}&offset=${pageParam}`,
      );
      return res.json();
    },
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce(
        (acc, page) => acc + (page.messages.length || 0),
        0,
      );
      if (loaded < (lastPage.count || 0)) {
        return loaded;
      }
      return undefined;
    },
    initialPageParam: 0,
  });

  if (isLoading) return <MessageLoader text="Loading messages..." />;
  if (isError)
    return (
      <div className="text-destructive py-8 text-center">
        Failed to load messages.
      </div>
    );

  const messages = data?.pages.flatMap((page) => page.messages) || [];

  if (!messages.length)
    return (
      <div className="py-8 text-center text-gray-400">No messages yet.</div>
    );

  return (
    <InfiniteScrollContainer
      className="grid grid-cols-1 gap-4 py-8 md:grid-cols-2"
      onBottomReached={() => {
        if (hasNextPage && !isFetchingNextPage) fetchNextPage();
      }}
    >
      {messages.map((msg: any, i: number) => (
        <div key={msg.id + `${i}`}>
          <MessageCard
            question={msg.content}
            time={getRelativeTime(msg.created_at)}
            name={
              msg.is_sender_visible
                ? (msg.sender_id ?? "Anonymous")
                : "Anonymous"
            }
            className="h-full w-full"
          />
        </div>
      ))}
      {isFetchingNextPage && (
        <MessageLoader text="Loading previous messages..." />
      )}
    </InfiniteScrollContainer>
  );
}
