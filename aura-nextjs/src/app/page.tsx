"use client";
import { Footer, Header } from "@/components/ui";
import React from "react";
import Image from "next/image";
import { ButtonPrimary } from "@/components/common/Buttons";
import { useRouter } from "next/navigation";

function Home() {
  const router = useRouter();

  return (
    <>
      <Header />
      <main className="flex flex-col items-center justify-center min-h-screen gap-12 tablet:gap-16 laptop:gap-24">
        {/* main hero /only displayed in big screens/ */}
        <section className="hidden mt-24 tablet:flex tablet:w-full desktop:max-w-screen-laptop items-center justify-center">
          <Image
            src={"/images/cover-image-4.png"}
            width={1140}
            height={600}
            alt={"cover image"}
            objectFit="cover"
            objectPosition="center"
            className="w-full border border-none tablet:rounded-lg"
          />
        </section>

        {/* product list (Offers) */}
        <section className="flex flex-col items-center w-full desktop:max-w-screen-laptop overflow-hidden mt-12 tablet:mt-0">
          <div className="w-full flex items-center">
            <h2 className="text-lg tablet:text-xl laptop:text-2xl font-alex font-bold text-center">
              العروض
            </h2>
          </div>

          {/* product list (offers) items */}
          <div className="w-full min-h-[526px] flex items-center justify-center gap-4 border border-red"></div>

          {/* view all */}
          <div className="w-full flex items-center justify-center">
            {/* pass query params for the products to filter-by (offers) */}
            <ButtonPrimary
              variant="link"
              handleClick={() => router.push("/products")}
              className="text-[13px] font-[600] tablet:text-[16px] laptop:text-[18px] tablet:font-[600]"
            >
              جميع المنتجات
            </ButtonPrimary>
          </div>
        </section>

        {/* image container */}
        <section className="w-full desktop:max-w-screen-laptop flex items-center justify-center">
          <Image
            src={"/images/cover-image-1.png"}
            width={1140}
            height={600}
            alt={"cover image"}
            objectFit="cover"
            objectPosition="center"
            className="w-full border border-none tablet:rounded-lg"
          />
        </section>

        {/* products list (latest) */}
        <section className="flex flex-col items-center w-full desktop:max-w-screen-laptop overflow-hidden">
          <div className="w-full flex items-center">
            <h2 className="text-lg tablet:text-xl laptop:text-2xl font-alex font-bold text-center">
              وصل حديثا
            </h2>
          </div>

          {/* product list (latest) items */}
          <div className="w-full min-h-[526px] flex items-center justify-center gap-4 border border-red"></div>

          {/* view all */}
          <div className="w-full flex items-center justify-center">
            {/* pass query params for the products to filter-by (latest) */}
            <ButtonPrimary
              variant="link"
              handleClick={() => router.push("/products")}
              className="text-[13px] font-[600] tablet:text-[16px] laptop:text-[18px] tablet:font-[600]"
            >
              جميع المنتجات
            </ButtonPrimary>
          </div>
        </section>

        {/* image container */}
        <section className="w-full desktop:max-w-screen-laptop flex items-center justify-center">
          <Image
            src={"/images/cover-image-2.png"}
            width={1140}
            height={600}
            alt={"cover image"}
            objectFit="cover"
            objectPosition="center"
            className="w-full border border-none tablet:rounded-lg"
          />
        </section>

        {/* product list (top selling) */}
        <section className="flex flex-col items-center w-full desktop:max-w-screen-laptop overflow-hidden">
          <div className="w-full flex">
            <h2 className="text-lg tablet:text-xl laptop:text-2xl font-alex font-bold text-right">
              الاكثر مبيعا
            </h2>
          </div>

          {/* product list (top-selling) items */}
          <div className="w-full min-h-[526px] flex items-center justify-center gap-4 border border-red"></div>

          {/* view all */}
          <div className="w-full flex items-center justify-center">
            {/* pass query params for the products to filter-by (top-selling) */}
            <ButtonPrimary
              variant="link"
              handleClick={() => router.push("/products")}
              className="text-[13px] font-[600] tablet:text-[16px] laptop:text-[18px] tablet:font-[600]"
            >
              جميع المنتجات
            </ButtonPrimary>
          </div>
        </section>

        {/* image container */}
        <section className="w-full desktop:max-w-screen-laptop flex items-center justify-center">
          <Image
            src={"/images/cover-image-3.png"}
            width={1140}
            height={600}
            alt={"cover image"}
            objectFit="cover"
            objectPosition="center"
            className="w-full border border-none tablet:rounded-lg"
          />
        </section>
      </main>
      <Footer />
    </>
  );
}

export default Home;
