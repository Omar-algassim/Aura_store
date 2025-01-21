"use client";
import React from "react";
import { Search } from "./Search";
import { Navbar } from "./Navbar";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "../context";
import { ButtonPrimary } from "../common/Buttons";

export function Header() {
  const route = useRouter();
  const cart = useCart();
  const cart_count = cart?.total_items || 0;
  return (
      <div className="flex items-center pt-8 justify-between flex-wrap">
        <div className="flex justify-between items-center gap-[56px]">
          <Navbar />
          <div className={`w-[158px] h-[58px] hidden tablet:flex`}>
            <ButtonPrimary
              handleClick={() => route.push("/login")}
              children="إنشاء حساب"
            />
          </div>
        </div>
        <div className="w-[495px] h-[78px] tablet:order-1 order-2">
          <Search />
        </div>
        <div>
          <div className="flex items-center gap-[56px]">
            <div>  
              <div className="relative w-[18px] h-[18px] bg-primary rounded-full top-3 left-[10.5px] text-white text-center text-[8px] pt-[3px]">
                {cart_count}
              </div>
              <Image
                src="/icons/cart.svg"
                onClick={() => route.push("/cart")}
                alt="cart"
                width={32}
                height={32}
                className="cursor-pointer"
              />
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
      </div>
  );
}
