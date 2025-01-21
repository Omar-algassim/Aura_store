/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  getOffers,
  getRecentProducts,
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
import ProductCard from "./ProductCard";
import { Product } from "@/interfaces/dto";

function ProductsCarousel({ productsType }: { productsType: string }) {
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
      {loading && <div>Loading...</div>}
      {error && <div>{error}</div>}
      <Carousel
        opts={{
          align: "end",
        }}
        className="w-full max-w-[360px] tablet:max-w-[760px] laptop:max-w-screen-laptop scroll-m-3 laptop:scroll-m-0"
        dir="ltr"
      >
        <CarouselContent className="-ml-1 py-4" dir="ltr">
          {products.map((product) => (
            <CarouselItem
              key={`${product.documentId}-${productsType}`}
              className="basis-1/2 max-w-[173px] tablet:max-w-none tablet:basis-1/3 pl-1 by-2"
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
