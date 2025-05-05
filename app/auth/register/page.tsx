"use client";

import AuthForm from "@/components/auth/auth-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { registerSchema } from "@/types/register-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { register } from "@/server/actions/register";

import { useAction } from "next-safe-action/hooks";

const Register = () => {
  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  const { execute, result, status } = useAction(register, {
    onSuccess({ data }) {
      form.reset();
      if (data?.error) {
        toast.error(data.error);
      }
      if (data?.success) {
        toast.success(data?.success, {
          action: {
            label: "Open Gmail",
            onClick: () =>
              window.open("https://mail.google.com/mail/u/0/#inbox"),
          },
        });
      }
    },
  });
  const onSubmit = (values: z.infer<typeof registerSchema>) => {
    const { name, email, password } = values;
    execute({ name, email, password });
  };
  return (
    <AuthForm
      formTitle="Register to your account"
      footerHref="/auth/login"
      footerLabel="Already have an account?"
      showProvider
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Your name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <br />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="snapshop@gmail.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <br />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="********" type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <br />
          </div>
          <Button
            type="submit"
            className={cn(
              "w-full my-4",
              status === "executing" && "animate-pulse"
            )}
            disabled={status === "executing"}
          >
            Register
          </Button>
        </form>
      </Form>
    </AuthForm>
  );
};

export default Register;
