"use client";

import { useState } from "react";
import { Profile } from "@/lib/types";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import EditProfileForm from "./edit-profile-form";
import { Squircle } from "@squircle-js/react";
import { Edit, Link } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useAcceptingMessagesMutation } from "@/hooks/useAcceptingMessagesMutation";
import toast from "react-hot-toast";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import LogoutDialog from "./logout-dialog";
import MessagesList from "@/components/messages-list";
import { motion, AnimatePresence } from "motion/react";

export default function ProfileOwnerView({ profile }: { profile: Profile }) {
  const [editing, setEditing] = useState(false);
  const [accepting, setAccepting] = useState(profile.accepting_messages);
  const mutation = useAcceptingMessagesMutation(profile.id);

  const handleToggle = (val: boolean) => {
    setAccepting(val);

    mutation.mutate(val, {
      onError: () => {
        setAccepting((prev) => !prev);
        toast.error("Failed to perform this action");
      },
    });
  };

  return (
    <section className="mx-auto max-w-3xl py-16">
      <AnimatePresence mode="wait">
        {!editing ? (
          <motion.div
            key="profile-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Squircle cornerRadius={30} cornerSmoothing={1}>
              <Card className="flex w-full flex-row justify-between gap-1 p-8">
                <div className="flex flex-col gap-1">
                  <Avatar className="size-14">
                    <AvatarImage
                      src={profile.avatar!}
                      alt={profile.username!}
                    />
                    <AvatarFallback>
                      {profile.username?.[0]?.toUpperCase() ?? "?"}
                    </AvatarFallback>
                  </Avatar>
                  <h1 className="text-main-gradient text-xl font-semibold">
                    {profile.username}
                  </h1>
                  {profile.bio && <p className="max-w-xl">{profile.bio}</p>}
                  <p className="mb-8 text-xs text-gray-400">
                    Joined:{" "}
                    {profile.created_at
                      ? new Date(profile.created_at).toLocaleDateString()
                      : "Unknown"}
                  </p>
                  <Squircle cornerRadius={10} cornerSmoothing={1} asChild>
                    <Button
                      className="w-fit"
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        toast.success("Profile link copied!");
                      }}
                    >
                      <Link className="size-4" />
                      Copy Profile Link
                    </Button>
                  </Squircle>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <div className="flex gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-full"
                          onClick={() => setEditing(true)}
                        >
                          <Edit className="size-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Edit Profile</TooltipContent>
                    </Tooltip>
                    <LogoutDialog />
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <label
                      htmlFor="accepting-switch"
                      className={cn(
                        "flex items-center gap-1 text-base font-medium",
                        !accepting && "text-destructive font-normal",
                      )}
                    >
                      {accepting && (
                        <span className="inline-block size-2.5 animate-pulse rounded-full bg-green-700"></span>
                      )}
                      {accepting
                        ? "Accepting messages"
                        : "Not accepting messages"}
                    </label>
                    <Switch
                      checked={accepting}
                      onCheckedChange={handleToggle}
                      id="accepting-switch"
                    />
                  </div>
                </div>
              </Card>
            </Squircle>
            <MessagesList isAcceptingMessages={accepting} />
          </motion.div>
        ) : (
          <motion.div
            key="edit-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <EditProfileForm
              profile={profile}
              onClose={() => setEditing(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
