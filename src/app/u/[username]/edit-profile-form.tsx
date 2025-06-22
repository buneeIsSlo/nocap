import { Profile } from "@/lib/types";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Squircle } from "@squircle-js/react";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import useDebouncedValue from "@/hooks/useDebounceValue";
import UsernameStatus from "@/components/username-status";

const profileSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(32)
    .regex(/^[a-zA-Z0-9_-]+$/, {
      message:
        "Username can only contain letters, numbers, underscores, and hyphens.",
    })
    .transform((val) => val.trim()),
  bio: z
    .string()
    .max(100)
    .optional()
    .transform((val) => val?.trim()),
  avatar: z.any().optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function EditProfileForm({
  profile,
  onClose,
}: {
  profile: Profile;
  onClose: () => void;
}) {
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar || "");
  const [usernameToCheck, setUsernameToCheck] = useState(
    profile.username || "",
  );
  const debouncedUsername = useDebouncedValue(usernameToCheck, 500);
  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: profile.username || "",
      bio: profile.bio || "",
      avatar: undefined,
    },
  });
  const router = useRouter();

  const {
    data: usernameCheck,
    isFetching: usernameChecking,
    isSuccess: usernameCheckSuccess,
    isError: usernameCheckError,
  } = useQuery({
    queryKey: ["check-username", debouncedUsername],
    queryFn: async () => {
      if (!debouncedUsername || debouncedUsername === profile.username) {
        return { isAvailable: true };
      }
      const res = await fetch(
        `/api/profile/check-username?username=${encodeURIComponent(debouncedUsername)}`,
      );
      return res.json();
    },
    enabled:
      !!debouncedUsername &&
      debouncedUsername !== profile.username &&
      debouncedUsername.length > 2,
    staleTime: 1000,
  });

  const mutation = useMutation({
    mutationFn: async (data: ProfileForm) => {
      const response = await fetch("/api/profile/update", {
        method: "PUT",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          id: profile.id,
          username: data.username,
          bio: data.bio,
        }),
      });

      const json = await response.json();
      if (!response.ok) throw json;
      return json;
    },
    onSuccess: (_data, variables) => {
      toast.success("Profile updated!");
      if (variables.username !== profile.username) {
        router.replace(`/u/${variables.username}`);
        router.refresh();
      }
      onClose();
    },
    onError: (err: any) => {
      if (err?.error?.toLowerCase().includes("username")) {
        form.setError("username", { message: err.error });
      } else {
        toast.error(err?.error || "Failed to update user profile");
      }
    },
  });

  const onSubmit = (data: ProfileForm) => {
    mutation.mutate(data);
  };

  return (
    <section className="mx-auto max-w-3xl py-16">
      <Squircle cornerRadius={30} cornerSmoothing={1}>
        <Card className="flex w-full flex-col items-center gap-4 p-8">
          <Avatar className="mb-2 size-14">
            <AvatarImage src={avatarUrl} alt={profile.username!} />
            <AvatarFallback>
              {profile.username?.[0]?.toUpperCase() ?? "?"}
            </AvatarFallback>
          </Avatar>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex w-full flex-col items-center gap-4"
            >
              <FormField
                name="avatar"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Avatar</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          field.onChange(file);
                          if (file) {
                            const url = URL.createObjectURL(file);
                            setAvatarUrl(url);
                          }
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Upload a new avatar image.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="username"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          setUsernameToCheck(e.target.value);
                        }}
                      />
                    </FormControl>
                    {usernameToCheck &&
                      usernameToCheck !== profile.username &&
                      usernameToCheck.length > 2 && (
                        <div className="mt-1 min-h-[1.25em] text-xs">
                          <UsernameStatus
                            status={
                              usernameChecking
                                ? "checking"
                                : usernameCheckSuccess &&
                                    usernameCheck?.isAvailable
                                  ? "available"
                                  : usernameCheckSuccess &&
                                      !usernameCheck?.isAvailable
                                    ? "taken"
                                    : usernameCheckError
                                      ? "error"
                                      : "idle"
                            }
                          />
                        </div>
                      )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="bio"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea className="[resize:none]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="mt-4 flex gap-2">
                <Squircle cornerRadius={10} cornerSmoothing={1} asChild>
                  <Button
                    type="submit"
                    disabled={
                      mutation.isPending ||
                      usernameChecking ||
                      (usernameCheckSuccess && !usernameCheck?.isAvailable)
                    }
                    className="min-w-28"
                  >
                    {mutation.isPending ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : null}
                    {mutation.isPending ? "Saving" : "Save"}
                  </Button>
                </Squircle>
                <Squircle cornerRadius={10} cornerSmoothing={1} asChild>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={onClose}
                    className="min-w-28"
                  >
                    Cancel
                  </Button>
                </Squircle>
              </div>
            </form>
          </Form>
        </Card>
      </Squircle>
    </section>
  );
}
