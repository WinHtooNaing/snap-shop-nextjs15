"use server";
import { productSchema } from "@/types/product-schema";
import { actionClient } from "./safe-action";
import { db } from "@/server";
import { eq } from "drizzle-orm";
import { products } from "../schema";
import { revalidatePath } from "next/cache";

// create product and update product
export const updateProduct = actionClient
  .schema(productSchema)
  .action(async ({ parsedInput: { id, title, description, price } }) => {
    try {
      if (id) {
        const existingProduct = await db.query.products.findFirst({
          where: eq(products.id, id),
        });
        if (!existingProduct) return { error: "Product not found" };

        await db
          .update(products)
          .set({ description, title, price })
          .where(eq(products.id, id));
        revalidatePath("/dashboard/products");
        return { success: ` ${title} updated successfully` };
      } else {
        const product = await db
          .insert(products)
          .values({
            description,
            title,
            price,
          })
          .returning();
        revalidatePath("/dashboard/products");
        return { success: ` ${title} created successfully` };
      }
    } catch (error) {
      return { error: "something went wrong" };
    }
  });
