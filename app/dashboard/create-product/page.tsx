import CreateProductForm from "@/components/products/create-product-form";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import React from "react";

const CreateProductPage = async () => {
  const session = await auth();
  if (session?.user.role !== "admin") return redirect("/dashboard/settings");
  return <CreateProductForm />;
};

export default CreateProductPage;
