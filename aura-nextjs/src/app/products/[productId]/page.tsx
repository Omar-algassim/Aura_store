import ProductPageComponent from "@/components/ui/product/ProductPage";
import { getProduct } from "@/utils/services/products-services";
import React from "react";

async function ProductPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;
  const { error, data } = await getProduct(productId);
  // // /console.log(data.data);
  return error ? (
    <div>{error}</div>
  ) : (
    <ProductPageComponent product={data.data} />
  );
}

export default ProductPage;
