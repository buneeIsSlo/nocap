"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Profile } from "@/lib/types";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Squircle } from "@squircle-js/react";
import TextareaCharLimit from "@/components/textarea-char-limit";
import { motion, AnimatePresence } from "motion/react";
import { SignInDialog } from "@/components/sign-in-dialog";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

const messageSchema = z.object({
  content: z.string().min(5, "Message too short").max(200, "Message too long"),
});

type MessageForm = z.infer<typeof messageSchema>;

interface ProfileViewProps {
  profile: Profile;
  loggedInProfile: Profile | null;
}

export default function ProfileView({
  profile,
  loggedInProfile,
}: ProfileViewProps) {
  const form = useForm<MessageForm>({
    resolver: zodResolver(messageSchema),
    defaultValues: { content: "" },
  });
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [signInOpen, setSignInOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // Adjust Squircle when textarea is resized
  const cardRef = useRef<HTMLDivElement>(null);
  const [squircleSize, setSquircleSize] = useState<null | {
    width: number;
    height: number;
  }>(null);
  useEffect(() => {
    if (!cardRef.current) return;
    const updateSize = () => {
      const rect = cardRef.current!.getBoundingClientRect();
      setSquircleSize({ width: rect.width, height: rect.height });
    };
    updateSize();
    const observer = new window.ResizeObserver(updateSize);
    observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  const mutation = useMutation({
    mutationFn: async (data: MessageForm) => {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile_id: profile.id,
          content: data.content,
        }),
      });
      if (!res.ok) throw await res.json();
      return res.json();
    },
    onSuccess: () => {
      setSuccess(true);
      setErrorMsg(null);
      form.reset();
      toast.success("Message sent!");
    },
    onError: (err: any) => {
      const msg = err?.error || "Internal server error";
      toast.error("Failed to send message");
      setErrorMsg(msg);
    },
  });

  const handleGetOwnMessages = async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      setSignInOpen(true);
    } else if (loggedInProfile?.username) {
      console.log("Entered here I guessss");
      router.push(`/u/${loggedInProfile.username}`);
    } else {
      router.push("/");
    }
  };

  return (
    <section className="mx-auto flex min-h-screen max-w-2xl flex-col justify-between py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <Squircle
          cornerRadius={30}
          cornerSmoothing={1}
          {...(squircleSize
            ? { width: squircleSize.width, height: squircleSize.height }
            : null)}
        >
          <Card ref={cardRef} className="flex flex-col items-center gap-4 p-8">
            {/* Profile info and prompt */}
            <div className="mb-2 flex w-full items-center gap-3">
              <Avatar className="size-14">
                <AvatarImage src={profile.avatar!} alt={profile.username!} />
                <AvatarFallback>
                  {profile.username?.[0]?.toUpperCase() ?? "?"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-main-gradient">@{profile.username}</span>
                <p className="text-base font-medium text-black">
                  Message me anonymously 🤫
                </p>
              </div>
            </div>
            {/* Message form */}
            <div className="w-full">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
                  className="flex w-full flex-col items-center gap-2"
                >
                  <FormField
                    name="content"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <TextareaCharLimit
                            {...field}
                            disabled={mutation.isPending || success}
                            placeholder="Type your anonymous message..."
                            className="min-h-[80px] w-full"
                            maxLength={200}
                            onChange={(e) => {
                              field.onChange(e);
                              if (errorMsg) setErrorMsg(null);
                            }}
                          />
                        </FormControl>
                        <FormMessage className="font-semibold" />
                      </FormItem>
                    )}
                  />
                  <div className="w-full">
                    <Squircle cornerRadius={10} cornerSmoothing={1} asChild>
                      <Button
                        type="submit"
                        disabled={mutation.isPending || success}
                        className="mt-1 h-12 w-full text-base"
                      >
                        {mutation.isPending
                          ? "Sending..."
                          : success
                            ? "Sent!"
                            : "Send"}
                      </Button>
                    </Squircle>
                  </div>
                  <AnimatePresence mode="wait">
                    {success && (
                      <motion.span
                        className="mt-1 font-semibold text-green-600"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                      >
                        Message sent anonymously!
                      </motion.span>
                    )}
                    {errorMsg && (
                      <motion.span
                        className="mt-1 block w-full text-center font-semibold text-red-600"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                      >
                        {errorMsg}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </form>
              </Form>
            </div>
          </Card>
        </Squircle>
      </motion.div>
      {/* Sticky footer CTA */}
      <div className="max-w-2xlpx-4 z-10 mx-auto w-full py-4 backdrop-blur">
        <Button
          className="w-full rounded-full py-8 text-base"
          onClick={handleGetOwnMessages}
        >
          Get your own messages 💬
        </Button>
        <SignInDialog open={signInOpen} onOpenChange={setSignInOpen} />
      </div>
    </section>
  );
}
