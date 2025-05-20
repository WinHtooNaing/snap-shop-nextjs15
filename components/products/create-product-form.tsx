"use client";
import { getSingleProduct, updateProduct } from "@/server/actions/products";
import { productSchema } from "@/types/product-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { DollarSign } from "lucide-react";
import { Button } from "../ui/button";
import Tiptap from "./tip-tap";
import { useEffect, useState } from "react";

const CreateProductForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get("edit_id");
  const [editProduct, setEditProduct] = useState<string>("");

  const isProductExist = async (id: number) => {
    if (isEditMode) {
      const response = await getSingleProduct(id);
      if (isEditMode) {
        const response = await getSingleProduct(id);
        if (response.error) {
          toast.error(response.error);
          router.push("/dashboard/products");
          return;
        }
        if (response.success) {
          setEditProduct(response?.success?.title);
          form.setValue("title", response?.success?.title);
          form.setValue("description", response?.success?.description);
          form.setValue("price", response?.success?.price);
          form.setValue("id", response?.success?.id);
        }
      }
    }
  };

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
    },
  });
  const { execute, status, result } = useAction(updateProduct, {
    onSuccess({ data }) {
      if (data?.error) {
        console.log(data?.error);

        toast.error(data?.error);
      }
      if (data?.success) {
        toast.success(data?.success);
        form.reset();
        router.push("/dashboard/products");
      }
    },
  });
  const onSubmit = (values: z.infer<typeof productSchema>) => {
    const { id, title, description, price } = values;
    execute({ id, title, description, price });
  };

  useEffect(() => {
    if (isEditMode) {
      isProductExist(Number(isEditMode));
    }
  }, []);
  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditMode ? "Edit" : "Create"} Product</CardTitle>
        <CardDescription>
          {isEditMode
            ? `Edit your product : ${editProduct}`
            : "Create a new product"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product title</FormLabel>
                  <FormControl>
                    <Input placeholder="T-shirt" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <br />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product description</FormLabel>
                  <FormControl>
                    <Tiptap val={field.value} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <br></br>
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product price</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <DollarSign
                        size={36}
                        className="p-2 bg-muted rounded-md"
                      />
                      <Input
                        placeholder="Price must shown in MMK"
                        {...field}
                        // step={10}
                        min={0}
                        type="number"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <br />
            <Button
              type="submit"
              className="w-full"
              disabled={status === "executing"}
            >
              {isEditMode ? "Update product" : "Create product"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreateProductForm;
