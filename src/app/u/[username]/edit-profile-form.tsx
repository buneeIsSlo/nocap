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

const profileSchema = z.object({
  username: z.string().min(3).max(32),
  bio: z.string().max(100).optional(),
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
  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: profile.username || "",
      bio: profile.bio || "",
      avatar: undefined,
    },
  });

  const onSubmit = (data: ProfileForm) => {
    onClose();
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
                      <Input type="text" {...field} />
                    </FormControl>
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
                <Button type="submit">Save</Button>
                <Button type="button" variant="secondary" onClick={onClose}>
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </Card>
      </Squircle>
    </section>
  );
}
