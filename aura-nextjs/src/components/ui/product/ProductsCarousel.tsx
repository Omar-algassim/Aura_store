/* eslint-disable react-hooks/exhaustive-deps */
import {
  getOffers,
  getRecentProducts,
  getSimilarProducts,
  getTopSellingProducts,
} from "@/utils/services/products-services";
import React, { useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../shadcn/carousel";
import ProductCard, { ProductCardSkeleton } from "./ProductCard";
import { Product } from "@/interfaces/dto";

function ProductsCarousel({
  productsType,
  productId,
  categories,
  brand,
}: {
  productsType: string;
  productId?: string;
  categories?: string[];
  brand?: string;
}) {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchProducts = async () => {
      switch (productsType) {
        case "offers": {
          const { error, products: fetchedProducts } = await getOffers();
          if (error) {
            console.log(error);
            setError(error);
            setLoading(false);
            return;
          }
          setProducts(fetchedProducts);
          setLoading(false);
          break;
        }

        case "recent": {
          const { error, products: fetchedProducts } =
            await getRecentProducts();
          if (error) {
            console.log(error);
            setError(error);
            setLoading(false);
            return;
          }
          setProducts(fetchedProducts);
          setLoading(false);
          break;
        }

        case "bestSelling": {
          const { error, products: fetchedProducts } =
            await getTopSellingProducts();

          if (error) {
            console.log(error);
            setError(error);
            setLoading(false);
            return;
          }
          setProducts(fetchedProducts);
          setLoading(false);
          break;
        }

        case "similar": {
          if (!productId) {
            setError("لا يوجد منتجات");
            setLoading(false);
            return;
          }
          const { error, products: fetchedProducts } = await getSimilarProducts(
            productId,
            brand,
            categories
          );

          if (error) {
            setError(error);
            setLoading(false);
            return;
          }
          setProducts(fetchedProducts);
          setLoading(false);
          break;
        }

        default:
          setError("لا يوجد منتجات");
          break;
      }
      console.log(JSON.stringify(products, null, 2));
    };
    fetchProducts();
  }, []);

  return (
    <div className="w-full flex flex-col">
      {error && <div>{error}</div>}
      <Carousel
        opts={{
          align: "end",
        }}
        className="w-full max-w-[360px] tablet:max-w-[760px] laptop:max-w-[1400px] scroll-m-3 laptop:scroll-m-0"
        dir="ltr"
      >
        <CarouselContent
          className="-mr-2 py-4 items-stretch justify-items-stretch"
          dir="ltr"
        >
          {loading
            ? Array.from({ length: 3 }).map((_, index) => (
                <CarouselItem
                  key={index}
                  className="basis-1/2 max-w-[173px] tablet:max-w-none tablet:basis-1/3 pr-2 by-2 flex items-stretch justify-items-stretch"
                >
                  <ProductCardSkeleton />
                </CarouselItem>
              ))
            : products.map((product) => (
                <CarouselItem
                  key={`${product.documentId}-${productsType}`}
                  className="basis-1/2 max-w-[173px] tablet:max-w-none laptop:basis-1/3 pr-2 by-2 flex items-stretch justify-items-stretch"
                >
                  <ProductCard product={product} />
                </CarouselItem>
              ))}
        </CarouselContent>
        <CarouselPrevious className="bg-black text-white hidden laptop:flex hover:opacity-75 hover:bg-black hover:text-white w-[50px] h-[50px]" />
        <CarouselNext className="bg-black text-white hidden laptop:flex hover:opacity-75 hover:bg-black hover:text-white w-[50px] h-[50px]" />
      </Carousel>
    </div>
  );
}

export default ProductsCarousel;
