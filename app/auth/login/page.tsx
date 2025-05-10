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
import { cn } from "@/lib/utils";
import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/types/login-schema";
import { z } from "zod";
import { useAction } from "next-safe-action/hooks";
import { login } from "@/server/actions/login";
import { toast } from "sonner";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const Login = () => {
  const [isTwoFactorOn, setIsTwoFactorOn] = useState(false);
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      code: "",
    },
  });
  const { execute, status, result } = useAction(login, {
    onSuccess({ data }) {
      if (data?.error) {
        toast.error(data?.error);
        form.reset();
      }
      if (data?.success) {
        toast.success(data?.success);
      }
      if (data?.twoFactor) {
        toast.success(data?.twoFactor);
        setIsTwoFactorOn(true);
      }
    },
  });
  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    const { email, password, code } = values;
    execute({ email, password, code });
  };
  return (
    <>
      <AuthForm
        formTitle={isTwoFactorOn ? "Place your code" : "Login to your account"}
        footerHref="/auth/register"
        footerLabel="Don't have an account?"
        showProvider={true}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {isTwoFactorOn && (
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>We sent a code to your email.</FormLabel>
                    <FormControl>
                      <InputOTP
                        maxLength={6}
                        {...field}
                        disabled={status === "executing"}
                        className=""
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
            {!isTwoFactorOn && (
              <div>
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
                        <Input
                          {...field}
                          placeholder="********"
                          type="password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <br />
                <Button size={"sm"} variant={"link"}>
                  <Link href={"/auth/reset"} className="">
                    Forgot Password?
                  </Link>
                </Button>
              </div>
            )}
            <Button
              type="submit"
              className={cn(
                "w-full mb-2 mt-4",
                status === "executing" && "animate-pulse"
              )}
              disabled={status === "executing"}
            >
              {isTwoFactorOn ? "Verify Code" : "Login"}
            </Button>
          </form>
        </Form>
      </AuthForm>
    </>
  );
};

export default Login;
