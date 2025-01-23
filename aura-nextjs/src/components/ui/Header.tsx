"use client";
import React from "react";
import { Search } from "./Search";
import { Navbar } from "./Navbar";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart, useUser } from "../context";
import { ButtonPrimary } from "../common/Buttons";

export function Header() {
  const route = useRouter();
  const cart = useCart();
  const user = useUser();
  const cart_count = cart?.total_items || 0;
  return (
    <div className="flex items-center justify-between w-[95vw] pt-[20px] tablet:pt-[60px] tablet:justify-between flex-wrap">
      <div className="flex justify-between items-center gap-[56px] gap-y-9">
        <Navbar />
        {user.documentId.length > 0 ? (
          <div className="w-[158px] h-[58px] hidden laptop:flex">
            <ButtonPrimary handleClick={() => route.push("/profile")}>
              حسابي
            </ButtonPrimary>
          </div>
        ) : (
          <div className="w-[158px] h-[58px] hidden laptop:flex">
            <ButtonPrimary handleClick={() => route.push("/login")}>
              إنشاء حساب
            </ButtonPrimary>
          </div>
        )}
      </div>
      <div className="w-full order-last tablet:order-2 mt-[32px] tablet:w-[447px] h-[78px] laptop:mt-0 ">
        <Search />
      </div>
      <div className="flex items-center gap-[56px] tablet:w-auto tablet:order-last">
        <div className="flex items-center">
          <Image
            src="/icons/cart.svg"
            onClick={() => route.push("/cart")}
            alt="cart"
            width={32}
            height={32}
            className="cursor-pointer"
          />
          {cart_count > 0 && (
            <div className="relative bottom-3 left-11 w-[18px] h-[18px] bg-primary rounded-full text-white text-center text-[8px] pt-[3px]">
              {cart_count}
            </div>
          )}
        </div>
        <Image
          src="/images/logo.png"
          onClick={() => route.push("/")}
          alt="logo"
          width={44}
          height={44}
          className="cursor-pointer"
        />
      </div>
    </div>
  );
}
