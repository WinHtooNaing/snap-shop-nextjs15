import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  pgEnum,
  boolean,
  real,
  serial,
} from "drizzle-orm/pg-core";
import type { AdapterAccount } from "next-auth/adapters"; // to use AdapterAccount
import { createId } from "@paralleldrive/cuid2";
export const RoleEnum = pgEnum("roles", ["user", "admin"]);
export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name"),
  email: text("email").unique(),
  password: text("password"),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  isTwoFactorEnabled: boolean("isTwoFactorEnabled").default(false),
  role: RoleEnum("role").default("user"),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);
export const emailVerificationToken = pgTable(
  "email_verification_token",
  {
    id: text("id")
      .notNull()
      .$defaultFn(() => createId()),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
    email: text("email").notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({
      columns: [vt.id, vt.token],
    }),
  })
);
export const resetPasswordToken = pgTable(
  "reset_password_token",
  {
    id: text("id")
      .notNull()
      .$defaultFn(() => createId()),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
    email: text("email").notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({
      columns: [vt.id, vt.token],
    }),
  })
);

export const twoFactorTokens = pgTable(
  "two_factor_tokens",
  {
    id: text("id")
      .notNull()
      .$defaultFn(() => createId()),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
    email: text("email").notNull(),
    userId: text("userId").references(() => users.id, { onDelete: "cascade" }),
  },
  (token) => ({
    compoundKey: primaryKey({
      columns: [token.id, token.token],
    }),
  })
);

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  description: text("description").notNull(),
  title: text("title").notNull(),
  price: real("price").notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
});
