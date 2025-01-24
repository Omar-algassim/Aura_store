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
    <>
      <div className="w-full bg-white z-30 sticky top-0 flex flex-col items-center justify-center">
        <div className="flex items-center justify-between gap-4 w-[95vw] max-w-[1480px] rounded-2xl py-[20px] tablet:py-[60px] tablet:justify-between flex-wrap bg-white z-30 sticky top-0">
          <div className="flex justify-between items-center gap-[56px] gap-y-9 order-1">
            <Navbar />
            {user.documentId.length > 0 ? (
              <div className="w-[158px] h-[58px] hidden laptop:flex">
                <ButtonPrimary handleClick={() => route.push("/profile")}>
                  حسابي
                </ButtonPrimary>
              </div>
            ) : (
              <div className="w-[158px] h-[58px] hidden laptop:flex">
                <ButtonPrimary handleClick={() => route.push("/register")}>
                  إنشاء حساب
                </ButtonPrimary>
              </div>
            )}
          </div>
          {/* Search */}
          <div className="w-full hidden tablet:grid order-last tablet:order-2 flex-1 min-w-[320px] h-[78px] laptop:mt-0 ">
            <Search />
          </div>

          {/* Cart and Logo */}
          <div className="flex items-center justify-end gap-4 tablet:w-auto order-2 tablet:order-last">
            <div className="flex items-center">
              <Image
                src="/icons/cart.svg"
                onClick={() => route.push("/cart")}
                alt="cart"
                width={32}
                height={32}
                className="cursor-pointer"
              />
              <div
                className={`relative bottom-3 left-11 w-[20px] h-[20px] tablet:w-[24px] tablet:h-[24px] rounded-full text-white text-center text-[12px] tablet-text-[14px] pt-[3px] ${
                  cart_count === 0 ? "bg-transparent" : "bg-primary"
                }`}
                id="cart-icon-tip"
              >
                {cart_count}
              </div>
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
      <div className="tablet:hidden z-0 w-[95vw] ">
        <Search />
      </div>
    </>
  );
}
