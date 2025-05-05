import bcrypt from "bcrypt"
import NextAuth from "next-auth"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "@/server"
import Google from "next-auth/providers/google"
import Github from "next-auth/providers/github"
 import Credentials from "next-auth/providers/credentials"
import { loginSchema } from "@/types/login-schema"
import { eq } from "drizzle-orm"
import { users } from "./schema"
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db) as any,
  secret : process.env.AUTH_SECRET!,
  session : {strategy : "jwt"},
  providers: [
	  Google({
		  clientId : process.env.AUTH_GOOGLE_ID!,
		  clientSecret : process.env.AUTH_GOOGLE_SECRET!,
	  }),
	  Github({
		  clientId : process.env.AUTH_GITHUB_ID!,
		  clientSecret : process.env.AUTH_GITHUB_SECRET!,
	  }),
	  Credentials({
		authorize: async (credentials) => {
		  const validateData = loginSchema.safeParse(credentials);
		  if (validateData.success) {
			const { email, password } = validateData.data;
			const user = await db.query.users.findFirst({
			  where: eq(users.email, email),
			});
			if (!user || !password) return null;
			const isMatch = await bcrypt.compare(password, user.password!);
			if (isMatch) return user;
		  }
		  return null;
		},
	  }),
  ],
})