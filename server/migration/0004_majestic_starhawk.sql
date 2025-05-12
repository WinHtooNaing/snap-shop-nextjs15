CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"description" text NOT NULL,
	"title" text NOT NULL,
	"price" real NOT NULL,
	"createdAt" timestamp DEFAULT now()
);
