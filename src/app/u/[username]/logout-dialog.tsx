"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Loader2, LogOut } from "lucide-react";
import { Squircle } from "@squircle-js/react";
import toast from "react-hot-toast";

export default function LogoutDialog() {
  const supabase = createClient();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLogout = async () => {
    startTransition(async () => {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error("Failed to logout");
        console.error("Logout error:", error);
        setOpen(false);
        return;
      }
      setOpen(false);
      router.replace("/");
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="hover:text-destructive rounded-full"
            >
              <LogOut className="size-4" />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>Logout</TooltipContent>
      </Tooltip>
      <Squircle cornerRadius={20} cornerSmoothing={1} asChild>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to log out?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleLogout}
              disabled={isPending}
            >
              {isPending ? <Loader2 className="size-4.5 animate-spin" /> : null}
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Squircle>
    </Dialog>
  );
}
