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

const profileSchema = z.object({
  username: z.string().min(3).max(32),
  description: z.string().max(200).optional(),
  avatar: z.string().url().optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function EditProfileForm({
  profile,
  onClose,
}: {
  profile: Profile;
  onClose: () => void;
}) {
  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: profile.username || "",
      description: profile.description || "",
      avatar: profile.avatar || "",
    },
  });

  const onSubmit = (data: ProfileForm) => {
    onClose();
  };
  return (
    <Card className="flex flex-col items-center gap-4 p-8">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col items-center gap-4"
        >
          <FormField
            name="avatar"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Avatar URL</FormLabel>
                <FormControl>
                  <Input type="url" {...field} />
                </FormControl>
                <FormDescription>
                  Paste a link to your avatar image.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="username"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="description"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="mt-4">
            Save
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="mt-2"
            onClick={onClose}
          >
            Cancel
          </Button>
        </form>
      </Form>
    </Card>
  );
}
