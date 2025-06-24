"use client";

import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useId } from "react";

interface TextareaCharLimitProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  maxLength: number;
}

export default function TextareaCharLimit({
  value = "",
  onChange,
  maxLength,
  className = "",
  ...props
}: TextareaCharLimitProps) {
  const id = useId();
  const charCount = typeof value === "string" ? value.length : 0;
  return (
    <div className="*:not-first:mt-2">
      <Textarea
        id={id}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        className={className}
        aria-describedby={`${id}-description`}
        {...props}
      />
      <p
        id={`${id}-description`}
        className={cn(
          "text-muted-foreground mt-2 text-right text-xs",
          maxLength - charCount <= 20 && "text-destructive",
        )}
        role="status"
        aria-live="polite"
      >
        <span className="tabular-nums">{maxLength - charCount}</span> characters
        left
      </p>
    </div>
  );
}
