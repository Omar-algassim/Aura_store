"use client";
import React, { useEffect, useRef } from "react";
import { Search } from "./Search";
import { Navbar } from "./Navbar";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart, useUser } from "../context";
import { ButtonPrimary } from "../common/Buttons";

export function Header() {
  const containerRef = useRef<HTMLDivElement>(null);
  const route = useRouter();
  const cart = useCart();
  const user = useUser();
  const [cartCount, setCartCount] = React.useState(cart?.total_items);

  useEffect(() => {
    setCartCount(cart?.total_items);
  }, [cart?.total_items]);

  useEffect(() => {
    let prevScrollTop = 0;
    const handleScroll = () => {
      if (containerRef.current) {
        const scrollTop = window.scrollY;
        const headerHeight = containerRef.current.offsetHeight;

        if (scrollTop <= headerHeight) {
          containerRef.current.classList.remove("top-0");
          containerRef.current.classList.add("-top-[200px]");
          return;
        }

        if (scrollTop > prevScrollTop && scrollTop > headerHeight) {
          containerRef.current.classList.remove("top-0");
          containerRef.current.classList.add("-top-[200px]");
        } else {
          containerRef.current.classList.remove("-top-[200px]");
          containerRef.current.classList.add("top-0");
        }
        prevScrollTop = scrollTop;
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  return (
    <>
      {/* static one */}
      <div className="w-full relative flex flex-col items-center justify-center bg-white px-3">
        <div className="w-full max-w-[1440px] z-30 sticky top-0 flex flex-col items-center justify-center">
          <div className="flex items-center justify-between gap-4 w-[95vw] max-w-[1480px] rounded-2xl py-[20px]  tablet:justify-between flex-wrap z-30 sticky top-0">
            {/* nav bar and create account button */}
            <div className="flex justify-between items-center gap-[56px] gap-y-9 order-1">
              <Navbar />
              {user.documentId.length > 0 ? (
                <div className="w-[158px] h-[58px] hidden laptop:flex">
                  <ButtonPrimary handleClick={() => route.push("/profile")}>
                    حسابي
                  </ButtonPrimary>
                </div>
              ) : (
                <div className="w-[158px] h-[58px] hidden tablet:flex">
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
                    cartCount === 0 ? "bg-transparent" : "bg-primary"
                  }`}
                  id="cart-icon-tip"
                >
                  {cartCount}
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
      </div>

      {/* dynamic one */}
      <div
        ref={containerRef}
        className="fixed w-full z-50 -top-[200px] transition-all duration-300 ease-in-out flex flex-col items-center justify-center"
      >
        <div className="w-full max-w-[1440px] bg-white z-30 sticky top-0 flex flex-col items-center justify-center">
          <div className="flex items-center justify-between gap-4 w-[95vw] max-w-[1480px] rounded-2xl py-[20px] px-4 tablet:justify-between flex-wrap bg-white z-30 sticky top-0">
            {/* nav bar and create account button */}
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
                    cartCount === 0 ? "bg-transparent" : "bg-primary"
                  }`}
                  id="cart-icon-tip"
                >
                  {cartCount}
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
      </div>
    </>
  );
}
