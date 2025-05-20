import { db } from "@/server";
import placeHolderImage from "@/public/placeholder.jpg";
import { DataTable } from "./data-table";
import { columns } from "./columns";
const ProductsPage = async () => {
  const products = await db.query.products.findMany({
    orderBy: (products, { desc }) => desc(products.id),
  });
  const productData = products.map((product) => {
    return {
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
      variants: [],
      image: placeHolderImage.src,
    };
  });

  return (
    <main>
      <DataTable columns={columns} data={productData} />
    </main>
  );
};

export default ProductsPage;
