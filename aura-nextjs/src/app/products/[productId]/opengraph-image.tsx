import { getProduct } from '@/utils/services/products-services';

export default async function ProductImage({
  params,
}: {
  params: { productId: string };
}) {
  const { productId } = params;

  const product = await getProduct(productId);
  if (!product || !product.data) {
    return null;
  }
  const imageResponse = await fetch(product.data.thumbnail);
  if (!imageResponse.ok) {
    return null;
  }
  const imageBlob = await imageResponse.blob();
  return imageBlob;
}
