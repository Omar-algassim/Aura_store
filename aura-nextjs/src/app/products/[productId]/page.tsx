import React from 'react';
import cookies from 'js-cookie';
import { getProduct } from '@/utils/services/products-services';
import { Product } from '@/interfaces/dto';

import ProductPageComponent from '@/components/ui/product/ProductPage';

async function ProductPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;
  const jwt = cookies.get('jwt');
  const { error, data } = await getProduct(productId, jwt);
  // console.log(data.data);
  return error ? (
    <div>{error}</div>
  ) : (
    <ProductPageComponent product={data.data} />
  );
}

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ productId: string }>;
}) => {
  const { productId } = await params;
  const { error, data } = await getProduct(productId);
  if (error) {
    return {
      title: 'Aura-Store | Product Not Found',
      description: 'The product you are looking for does not exist.',
    };
  }
  const product: Product = data.data;
  return {
    title: `Aura-Store | ${product.title}`,
    description: product.description,
    keywords: [
      'Personal Care',
      'Sudan',
      'Beauty Products',
      'شامبو',
      'منتجات العناية الشخصية',
      'السودان',
      'منتجات الجمال',
    ],
  };
};
export default ProductPage;
