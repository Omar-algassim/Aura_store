import { ButtonPrimary } from "@/components/common/Buttons";
import { ToolTip } from "@/components/common/ToolTip";
import { BaseUrl } from "@/constants/api-constants";
import { starIcon } from "@/constants/app-constants";
import { Product } from "@/interfaces/dto";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Skeleton } from "../shadcn/skeleton";

function ProductCard({ product }: { product: Product }) {
  const addToCart = async () => {
    console.log(`adding ${product.title} to cart`);
  };
  return (
    <div className="relative flex flex-col gap-y-2 justify-stretch tablet:gap-3 min-h-[412px] w-full bg-white p-0 m-0 rounded-xl tablet:hover:drop-shadow-xl transition-all duration-150">
      {/* Sale tag */}
      {product.discount && (
        <div className="absolute top-0 right-0 bg-primary text-white text-[13px] font-[500] p-1 rounded-bl-xl rounded-tr-xl">
          {product.discount}% خصم
        </div>
      )}
      {/* card image */}
      <div className="w-full h-[200px] flex items-center justify-center rounded-lg bg-surface overflow-hidden">
        <Image
          src={`${BaseUrl}${product.thumbnail}`}
          width={300}
          height={250}
          alt={product.title}
          // content="center"
          // objectFit="contain"
          className="w-[173px] tablet:w-[200px] h-auto object-cover object-center"
        />
      </div>
      {/* card body */}
      <div className="w-full flex flex-col gap-y-2 tablet:gap-y-3 px-2 tablet:px-3">
        {/* product rating */}
        <div className="w-full tablet:px-2 tablet:py-3 flex justify-end">
          <div className="flex items-center justify-center gap-1 w-[50px] h-[24px] tablet:w-[54px] tablet:h-[30px] bg-surface rounded-xl">
            <Image
              src={starIcon}
              width={16}
              height={16}
              alt="rating"
              className="w-[10px] h-[10px] tablet:w-[16px] tablet:h-[16px]"
            />
            <div className="flex flex-col item-center justify-center text-[13px] font-[400] p-0 m-0">
              23
            </div>
          </div>
        </div>
        {/* product title */}
        <div className="w-full tablet:px-1 tablet:py-2 flex justify-end">
          <ToolTip content={<p>{product.title}</p>}>
            <Link
              href={`/products/${product.documentId}`}
              className={`text-[13px] tablet:text-[22px] font-[500] tablet:max-h-[27px] overflow-hidden cursor-pointer hover:underline hover:opacity-80 transition-all duration-150`}
            >
              {product.title.length <= 25
                ? product.title
                : `${product.title.slice(0, 25)}...`}
            </Link>
          </ToolTip>
        </div>
        {/* product price */}
        <div className="w-full tablet:px-1 tablet:py-2 flex flex-col items-end">
          <p
            className={`text-[13px] tablet:text-[18px] font-[700] ${
              product.discount && "line-through opacity-80"
            }`}
          >
            {product.price} SDG
          </p>
          {product.discount && (
            <p className="text-[13px] tablet:text-[18px] font-[700] text-primary">
              {Math.round(
                product.price - (product.price * product.discount) / 100
              )}{" "}
              SDG
            </p>
          )}
        </div>
      </div>

      {/* add to cart */}
      <div className="flex flex-1 justify-end items-end px-2 tablet:px-3 pb-3">
        <ButtonPrimary
          className="w-[140px] h-[56px] text-[13px] tablet:text-[18px] tablet:w-[156px] font-[600]"
          preloader
          handleClick={addToCart}
        >
          أضف للسلة
        </ButtonPrimary>
      </div>
    </div>
  );
}

export const ProductCardSkeleton = () => {
  return (
    <div
      className="flex flex-col gap-y-2 justify-stretch tablet:gap-3 min-h-[412px] w-full bg-white p-0 m-0 rounded-xl "
      dir="rtl"
    >
      <Skeleton className="w-full h-[200px] flex items-center justify-center rounded-lg bg-surface" />
      <div className="w-full flex flex-col gap-y-2 tablet:gap-y-3 px-2 tablet:px-3">
        <Skeleton className="h-5 w-[50px] bg-surface" />
        <Skeleton className="h-6 w-[100px] tablet:w-[200px] bg-surface" />
        <Skeleton className="h-5 w-[60px] tablet:w-[120px] bg-surface" />
      </div>
      <div
        className="flex flex-1 flex-col justify-end items-end px-2 tablet:px-3 pb-3"
        dir="ltr"
      >
        <Skeleton className="h-12 w-[140px] tablet:w-[156px] font-[600] bg-surface" />
      </div>
    </div>
  );
};

export default ProductCard;
