"use client";
import { ButtonPrimary } from "@/components/common/Buttons";
import { ToolTip } from "@/components/common/ToolTip";
import { BaseUrl } from "@/constants/api-constants";
import { starIcon } from "@/constants/app-constants";
import { Product } from "@/interfaces/dto";
import { Minus, Plus } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import RenderMarkdown from "../RenderMarkdown";

function ProductPageComponent(params: { product: Product }) {
  const [product, setProduct] = useState(params.product);
  const [hero, setHero] = useState(product.thumbnail);
  const [images, setImages] = useState(product.images.map((img) => img.url));
  const [loadingImage, setLoadingImage] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const swapHero = (newHero: string, index: number) => {
    setLoadingImage(true);
    const temp = hero;
    setHero(newHero);
    images[index] = temp;
    setImages(images);
    setLoadingImage(false);
  };

  const increaseQuantity = () => {
    const newQuantity = quantity + 1;
    if (newQuantity >= product.stock) {
      // handle it in better way
      return;
    }
    setQuantity(newQuantity);
  };

  const decreaseQuantity = () => {
    if (quantity <= 1) {
      // handle it in better way
      return;
    }
    setQuantity(quantity - 1);
  };

  const addToCart = async () => {
    console.log(`adding ${product.title} to cart`);
  };

  return (
    <div className="flex flex-col items-center gap-y-2">
      {/* product main */}
      <section className="flex flex-col items-center justify-center gap-8 mb-8">
        {/* product images */}
        <div className="flex flex-col gap-y-2 w-full p-0 m-0">
          {/* hero */}
          <div className="w-full flex items-center justify-center bg-surface">
            <Image
              className="w-[392px] h-[236px] object-contain object-center animate-out "
              src={`${BaseUrl}/${hero}`}
              width={1400}
              height={800}
              alt={product.title}
            />
          </div>
          {/* product rating */}
          <div className="w-full tablet:px-2 tablet:py-3 flex justify-start mx-[16px]">
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

          {/* product images */}
          <div className="flex flex-row flex-wrap gap-2 w-full max-w-[640px] px-[16px]">
            {images.map((img, index) => (
              <div
                key={index}
                className="w-[71] h-[71] bg-surface rounded-lg"
                onClick={() => swapHero(img, index)}
              >
                <Image
                  className="w-[71px] h-[71px] object-cover object-center rounded-lg animate-in "
                  src={`${BaseUrl}/${img}`}
                  width={100}
                  height={100}
                  alt={product.title}
                />
              </div>
            ))}
          </div>
        </div>

        {/* product title/price */}
        <div className="w-full flex flex-col gap-2 items-center justify-center px-[16px]">
          <div className="w-full tablet:px-1 tablet:py-2 flex">
            <ToolTip content={<p>{product.title}</p>}>
              <p className="text-[13px] tablet:text-[22px] font-[500] tablet:max-h-[27px] overflow-hidden">
                {product.title.length <= 25
                  ? product.title
                  : `${product.title.slice(0, 25)}...`}
              </p>
            </ToolTip>
          </div>
          {/* product price */}
          <div className="w-full tablet:px-1 tablet:py-2 flex flex-col">
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
        <div className="w-full flex flex-col gap-12 items-center justify-center px-[16px]">
          {/* quantity buttons */}
          <div className="w-full flex flex-col gap-2">
            <div className="flex-1 flex">
              <h2 className="w-full text-lg font-[700] text-right">الكمية</h2>
            </div>
            <div className="w-full flex">
              {/* decrease */}
              <div
                className={`flex w-[70px] h-[58px] items-center justify-center border-2 rounded-lg ${
                  quantity >= product.stock && "opacity-50"
                }"`}
              >
                <button
                  onClick={increaseQuantity}
                  disabled={quantity >= product.stock}
                >
                  <Plus size={30} fontWeight={700} color="#202020" />
                </button>
              </div>

              {/* amount */}
              <div className="flex w-[70px] h-[58px] items-center justify-center border-0 rounded-lg">
                <p className="text-[18px] font-[500]">{quantity}</p>
              </div>

              {/* increase  */}
              <div
                className={`flex w-[70px] h-[58px] items-center justify-center border-2 rounded-lg ${
                  quantity <= 1 && "opacity-50"
                }`}
              >
                <button onClick={decreaseQuantity} disabled={quantity <= 1}>
                  <Minus size={30} fontWeight={700} color="#202020" />
                </button>
              </div>
            </div>
          </div>

          {/* add to cart */}
          <div className="w-full flex flex-col items-center justify-center">
            <ButtonPrimary
              className=" h-[56px] text-[13px] tablet:text-[18px] tablet:w-[156px] font-[600]"
              preloader
              handleClick={addToCart}
            >
              أضف للسلة
            </ButtonPrimary>
          </div>
        </div>
      </section>

      {/* product details */}
      <section className="w-full flex flex-col gap-8 px-4 ">
        {/* description */}
        <div className="w-full flex flex-col gap-4">
          <h2 className="w-full text-right text-lg font-[700]">وصف المنتج</h2>
          <RenderMarkdown page={product.description} />
        </div>

        {/* specification */}
        <div className="w-full flex flex-col gap-4">
          <h2 className="w-full text-right text-lg font-[700]">
            مواصفات المنتج
          </h2>
          <div className="w-full flex gap-1">
            <p className="text-[15px] font-[600]">العلامة التجارية:</p>
            <p className="text-[15px] font-[400] opacity-85">
              {" "}
              {product.brand.name}
            </p>
          </div>
          <div className="w-full flex gap-1">
            <p className="text-[15px] font-[600]">الوزن:</p>
            <p className="text-[15px] font-[400]"> {product.weight} kg</p>
          </div>
          {product.color_grade && (
            <div className="w-full flex gap-1">
              <p className="text-[15px] font-[600]">درجة اللون:</p>
              <p className="text-[15px] font-[400]"> {product.color_grade}</p>
            </div>
          )}
        </div>

        {/* features */}
        {product.features && (
          <div className="w-full flex flex-col gap-4">
            <h2 className="w-full text-right text-lg font-[700]">
              مميزات المنتج
            </h2>
            <RenderMarkdown page={product.features} />
          </div>
        )}

        {/* usage */}
        {product.usage && (
          <div className="w-full flex flex-col gap-4">
            <h2 className="w-full text-right text-lg font-[700]">
              طريقة الاستخدام
            </h2>
            <RenderMarkdown page={product.usage} />
          </div>
        )}
      </section>

      {/* product reviews */}
      <section></section>

      {/* related products */}
      <section></section>
    </div>
  );
}

export default ProductPageComponent;
