"use client";
import { twoFactorSchema } from "@/types/settings-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import SettingCard from "./setting-card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "../ui/form";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Switch } from "../ui/switch";
import { useAction } from "next-safe-action/hooks";
import { twoFactorToggler } from "@/server/actions/settings";
import { toast } from "sonner";

type TwoFactorProps = {
  isTwoFactorEnabled: boolean;
  email: string;
};
const TwoFactor = ({ isTwoFactorEnabled, email }: TwoFactorProps) => {
  const form = useForm({
    resolver: zodResolver(twoFactorSchema),
    defaultValues: {
      email,
      isTwoFactorEnabled,
    },
  });
  const { execute, status, result } = useAction(twoFactorToggler, {
    onSuccess({ data }) {
      form.reset();
      if (data?.error) {
        toast.error(data?.error);
      }
      if (data?.success) {
        toast.success(data?.success);
      }
    },
  });
  const onSubmit = (values: z.infer<typeof twoFactorSchema>) => {
    const { email, isTwoFactorEnabled } = values;
    execute({ isTwoFactorEnabled, email });
  };
  useEffect(() => {
    form.setValue("isTwoFactorEnabled", isTwoFactorEnabled);
  }, [isTwoFactorEnabled, form]);
  return (
    <SettingCard>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            name="isTwoFactorEnabled"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Two Factor Authentication</FormLabel>
                <FormDescription>
                  {isTwoFactorEnabled ? "Disable" : "Enable"} two factor
                  authentication for your account
                </FormDescription>
                <FormControl>
                  <Switch
                    disabled={status === "executing"}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="my-2"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button
            className={cn(
              "w-full mb-4 mt-2",
              status === "executing" && "animate-pulse",
              isTwoFactorEnabled ? "bg-red-500 hover:bg-red-600" : "bg-primary"
            )}
            disabled={status === "executing"}
          >
            {isTwoFactorEnabled ? "Disable" : "Enable"}
          </Button>
        </form>
      </Form>
    </SettingCard>
  );
};

export default TwoFactor;
