import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export function useAcceptingMessagesMutation(
  profileId: string,
  queryKey = ["accepting-messages", profileId],
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (accepting: boolean) => {
      const { error } = await supabase
        .from("profiles")
        .update({ accepting_messages: accepting })
        .eq("id", profileId);
      if (error) {
        console.error("Mutation failed:", error);
        throw error;
      }

      return accepting;
    },
    onMutate: async (accepting) => {
      await queryClient.cancelQueries({ queryKey });
      const prev = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old: any) => ({
        ...old,
        accepting_messages: accepting,
      }));
      return { prev };
    },
    onError: (err, accepting, context) => {
      console.error(
        "OnError: Mutation error, reverting UI for",
        accepting,
        err,
      );
      if (context?.prev) {
        queryClient.setQueryData(queryKey, context.prev);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
