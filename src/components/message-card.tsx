"use client";

import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Squircle } from "@squircle-js/react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface MessageCardProps extends React.ComponentPropsWithoutRef<"div"> {
  question: string;
  name?: string;
  time: string;
  avatarSrc?: string;
  onDelete?: () => void;
}

export function MessageCard({
  question,
  name = "Anonymous",
  time,
  avatarSrc,
  className,
  onDelete,
  ...props
}: MessageCardProps) {
  return (
    <Squircle
      asChild
      cornerRadius={25}
      cornerSmoothing={1}
      width={"100%" as unknown as number}
      height={"100%" as unknown as number}
    >
      <div
        data-slot="message-card"
        tabIndex={0}
        className={cn(
          "bg-card text-card-foreground group relative flex w-md max-w-md flex-col justify-between gap-4 overflow-hidden rounded-xl border p-6 shadow-sm hover:bg-neutral-50",
          className,
        )}
        {...props}
      >
        {onDelete && (
          <Button
            type="button"
            size="icon"
            variant={"outline"}
            className="border-destructive absolute top-3 right-3 z-10 hidden rounded-full opacity-80 transition group-hover:grid group-hover:place-content-center group-focus:grid group-focus:place-content-center"
            onClick={onDelete}
            aria-label="Delete message"
          >
            <Trash2 className="text-destructive size-4" />
          </Button>
        )}
        <div className="font-nunito flex flex-1 items-center justify-center text-center text-xl leading-normal font-bold text-wrap">
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
