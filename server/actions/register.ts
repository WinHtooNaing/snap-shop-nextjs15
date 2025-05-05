"use server";

import { actionClient } from "./safe-action";
import { registerSchema } from "@/types/register-schema";
import { db } from "..";
import { eq } from "drizzle-orm";
import { users } from "../schema";
import bcrypt from "bcrypt";
import { generateEmailVerificationToken } from "./tokens";
import { sendEmail } from "./emails";

export const register = actionClient
  .schema(registerSchema)
  .action(async ({ parsedInput: { name, email, password } }) => {
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    if (existingUser) {
      if (!existingUser.emailVerified) {
        const verificationToken = await generateEmailVerificationToken(email);
        await sendEmail(
          verificationToken[0].email,
          verificationToken[0].token,
          name.slice(0, 5)
        );
        return { success: "Email verification resent your email" };
      }
      return {
        error: "Email already exists",
      };
    }
    if(existingUser){
        return {
            error : "Email already exists"
        }
    }
    await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
    });
     const verificationToken = await generateEmailVerificationToken(email);
    await sendEmail(
      verificationToken[0].email,
      verificationToken[0].token,
      name.slice(0, 5)
    );

    return {
      success: "Email verification sent your email",
    };
  });