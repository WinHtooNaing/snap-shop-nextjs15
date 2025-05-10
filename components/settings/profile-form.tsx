"use client";

import { settingsSchema } from "@/types/settings-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useAction } from "next-safe-action/hooks";
import { updateDisplayName } from "@/server/actions/settings";
import { toast } from "sonner";

type ProfileFormProps = {
  name: string;
  email: string;
  setIsOpen: () => void;
};
const ProfileForm = ({ name, email, setIsOpen }: ProfileFormProps) => {
  const form = useForm({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name,
      email,
    },
  });
  const { execute, status, result } = useAction(updateDisplayName, {
    onSuccess({ data }) {
      form.reset();
      if (data?.error) {
        toast.error(data?.error);
      }
      if (data?.success) {
        setIsOpen();
        toast.success(data?.success);
      }
    },
  });
  const onSubmit = (values: z.infer<typeof settingsSchema>) => {
    const { name, email } = values;
    execute({ name, email });
  };
  return (
    <main>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 px-4 lg:px-0"
        >
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Name</FormLabel>
                <FormControl>
                  <Input placeholder="snapshot@admin" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            className={cn(
              "w-full mb-4",
              status === "executing" && "animate-pulse"
            )}
            disabled={status === "executing"}
          >
            Save
          </Button>
        </form>
      </Form>
    </main>
  );
};

export default ProfileForm;
