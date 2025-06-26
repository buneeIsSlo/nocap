import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
  useMutation,
} from "@tanstack/react-query";
import { MessageCard } from "./message-card";
import InfiniteScrollContainer from "./infinite-scroll-container";
import { getRelativeTime } from "@/lib/utils";
import { Loader2, MessageCircleMore } from "lucide-react";
import { Squircle } from "@squircle-js/react";
import { Button } from "./ui/button";
import { useRef } from "react";
import toast from "react-hot-toast";

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

interface MessagesListProps {
  isAcceptingMessages: boolean;
}

export default function MessagesList({
  isAcceptingMessages,
}: MessagesListProps) {
  const queryClient = useQueryClient();
  const topOfListRef = useRef<HTMLDivElement>(null);
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
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60,
    refetchInterval: 5 * 1000 * 60,
  });

  const messages = data?.pages.flatMap((page) => page.messages) || [];
  const latestCreatedAt = messages[0]?.created_at;

  // Poll for new messages every 20s
  const { data: newMessages } = useQuery({
    queryKey: ["newMessages", latestCreatedAt],
    queryFn: async () => {
      if (!latestCreatedAt) return [];
      const res = await fetch(
        `/api/messages?since=${encodeURIComponent(latestCreatedAt)}`,
      );
      const json = await res.json();
      return json.messages || [];
    },
    refetchInterval: 20000,
    enabled: !!latestCreatedAt && isAcceptingMessages,
  });

  const handlePrpendingNewMessages = () => {
    if (!newMessages?.length) return;
    queryClient.setQueryData(["messages"], (oldData: any) => {
      if (!oldData) return oldData;

      const updatedPages = [...oldData.pages];
      updatedPages[0] = {
        ...updatedPages[0],
        messages: [...newMessages, ...updatedPages[0].messages],
      };
      return {
        ...oldData,
        pages: updatedPages,
      };
    });

    queryClient.setQueryData(["newMessages", latestCreatedAt], []);
    // Scroll to top of the message list
    if (topOfListRef.current) {
      topOfListRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/messages?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
    },
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ["messages"] });
      const prevData = queryClient.getQueryData(["messages"]);

      queryClient.setQueryData(["messages"], (old: any) => {
        if (!old) return old;
        const updatedPages = old.pages.map((page: any) => ({
          ...page,
          messages: page.messages.filter((msg: any) => msg.id !== id),
        }));
        return { ...old, pages: updatedPages };
      });

      return { prevData };
    },
    onError: (_err, _id, context) => {
      if (context?.prevData) {
        queryClient.setQueryData(["messages"], context.prevData);
      }
      toast.error("Failed to delete message");
    },
  });

  if (isLoading) return <MessageLoader text="Loading messages..." />;
  if (isError)
    return (
      <div className="text-destructive py-8 text-center">
        Failed to load messages.
      </div>
    );

  if (!messages.length)
    return (
      <div className="py-8 text-center text-gray-400">No messages yet.</div>
    );

  return (
    <>
      <div ref={topOfListRef} />
      {newMessages && newMessages.length > 0 && (
        <div className="sticky top-0 z-30 flex justify-center pt-8">
          <Button
            className="bg-primary flex items-center gap-2 rounded-full p-3 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:scale-105 md:w-[25%] md:p-6 md:text-base"
            onClick={handlePrpendingNewMessages}
          >
            {newMessages.length} New Message
            {newMessages.length > 1 ? "s" : ""}
            <MessageCircleMore className="text-white/90" />
          </Button>
        </div>
      )}
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
              onDelete={async () => {
                deleteMutation.mutate(msg.id);
              }}
            />
          </div>
        ))}
        {isFetchingNextPage && (
          <MessageLoader text="Loading previous messages..." />
        )}
      </InfiniteScrollContainer>
    </>
  );
}
