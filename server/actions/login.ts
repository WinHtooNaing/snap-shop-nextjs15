"use server";

import { loginSchema } from "@/types/login-schema";
import { actionClient } from "./safe-action";
import { AuthError } from "next-auth";
import { db } from "..";
import { eq } from "drizzle-orm";
import { users } from "../schema";
import { generateEmailVerificationToken } from "./tokens";
import { sendEmail } from "./emails";
import { signIn } from "../auth";

export const login = actionClient
  .schema(loginSchema)
  .action(async ({ parsedInput: { email, password, code } }) => {
    console.log(code);

    try {
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email),
      });
      if (existingUser?.email !== email) {
        return { error: "Please provide valid credentials" };
      }
      if (!existingUser.emailVerified) {
        const verificationToken = await generateEmailVerificationToken(
          existingUser.email
        );
        await sendEmail(
          verificationToken[0].email,
          verificationToken[0].token,
          existingUser.name!.slice(0, 5)
        );
        return { success: "Email verification resent" };
      }
      await signIn("credentials", { email, password, redirectTo: "/" });
      return { success: "Login Successful" };
    } catch (error) {
        if (error instanceof AuthError) {
            if (error.message.includes("CredentialsSignin")) {
              return { error: "Please provide valid credentials" };
            }
            if (error.message.includes("OAuthSignInError")) {
              return { error: error.message };
            }
            return { error: "Authentication failed" };
          }
      throw error;
    }
  });