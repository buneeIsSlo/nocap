"use client";

import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Squircle } from "@squircle-js/react";

interface MessageCardProps extends React.ComponentPropsWithoutRef<"div"> {
  question: string;
  name?: string;
  time: string;
  avatarSrc?: string;
}

export function MessageCard({
  question,
  name = "Anonymous",
  time,
  avatarSrc,
  className,
  ...props
}: MessageCardProps) {
  return (
    <Squircle asChild cornerRadius={25} cornerSmoothing={1}>
      <div
        data-slot="message-card"
        className={cn(
          "bg-card text-card-foreground flex w-md max-w-md flex-col justify-between gap-4 overflow-hidden rounded-xl border p-6 shadow-sm",
          className,
        )}
        {...props}
      >
        <div className="font-nunito text-center text-xl leading-normal font-bold text-wrap">
          "{question}"
        </div>

        <div className="flex flex-row items-center justify-start gap-2">
          <Avatar className="size-10">
            {avatarSrc && <AvatarImage src={avatarSrc} alt={name} />}
            <AvatarFallback className="bg-main-gradient text-xl font-semibold text-white">
              {name !== "Anonymous" && name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <p className="text-sm font-semibold text-neutral-500">{name}</p>
          <span className="text-muted-foreground font-semibold">·</span>
          <span className="text-muted-foreground text-xs font-semibold">
            {time} ago
          </span>
        </div>
      </div>
    </Squircle>
  );
}
