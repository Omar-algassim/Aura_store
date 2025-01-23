"use client";
import React, { useState } from "react";
import { ButtonPrimary } from "../common/Buttons";
import { ButtonSecondary } from "../common/Buttons";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  useUser,
  useUserDispatch,
  useCartDispatcher,
  useCart,
} from "@/components/context";
import { CartEntity } from "@/entities/cart-entity";
import AlertDialogElement from "../common/alert-dialog";

interface NavElementProps {
  name: string;
  link: string;
}

const alertProps = {
  header: "تسجيل خروج",
  body: "هل تريد تسجيل الخروج؟",
  action_text: "تأكيد",
  cancel: "إلغاء",
};

function NavElement(props: NavElementProps) {
  return (
    <Link
      href={props.link}
      className="hover:bg-primary-dark hover:text-white active:bg-primary-dark
         active:text-white focus:outline-none focus:bg-primary-dark w-[345px]
         focus:text-white rounded-[12px] py-[12px] px-[6px]"
    >
      {props.name}
    </Link>
  );
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const user = useUser();
  const userDispatcher = useUserDispatch();
  const cartDispatcher = useCartDispatcher();
  const cart = useCart() as CartEntity;
  const router = useRouter();

  function toggleMenu() {
    setIsOpen(!isOpen);
  }

  function logout() {
    if (user.documentId) {
      userDispatcher({ type: "LOGOUT", payload: {} });
      cartDispatcher({ type: "DELETE", payload: { cart } });
      router.push("/");
    } else {
      router.push("/login");
    }
  }

  return (
    <div className="flex z-10 flex-col items-start">
      <div>
        <div className="relative z-10 tablet:max-w-[56px] tablet:max-h-[56px] max-w-[32px] max-h-[32px]">
          <Image
            width={32}
            height={32}
            src="/icons/menu.svg"
            alt="navbar menu"
            onClick={toggleMenu}
          />
        </div>
        <div
          className={`items-center max-w-[393px] max-h-[506px] text-xs rounded-xl absolute ${
            isOpen ? "flex-col animate-scaleIn" : "hidden animate-scaleOut"
          } ease-in-out duration-300 bg-white z-10`}
        >
          <div className="flex flex-col w-[345px] justify-between py-[64px] px-[24px] items-center text-center relative rounded-xl">
            <Image
              src="/icons/close.svg"
              alt="exit"
              onClick={toggleMenu}
              className="w-[32px] h-[32px] cursor-pointer absolute left-[24px] top-[15px]"
              width={32}
              height={32}
            />
            <div
              className={`flex flex-col items-center justify-between w-[158px] text-xs space-y-5`}
            >
              {user.documentId ? (
                <AlertDialogElement
                  trigger={"تسجيل خروج"}
                  action={logout}
                  header={alertProps.header}
                  body={alertProps.body}
                  cancel="إلغاء"
                  action_text={alertProps.action_text}
                />
              ) : (
                <>
                  <ButtonPrimary
                    children="إنشاء حساب"
                    handleClick={() => router.push("/register")}
                    className={`text-xs p-2 tablet:hidden`}
                  />
                  <ButtonSecondary
                    children={"تسجيل دخول"}
                    handleClick={logout}
                    className="text-xs p-2"
                  />
                </>
              )}
            </div>
            <div className="flex flex-col justify-between pt-[40px]">
              <NavElement link="/products" name="جميع المنتجات" />
              <NavElement link="/contact-us" name="تواصل معنا" />
              <NavElement link="/about-us" name="نبذة عن Aura" />
              <NavElement link="/profile" name="الملف الشخصي" />
            </div>
          </div>
        </div>
      </div>
      {isOpen && (
        // TODO: take the menu out of overlay
        <div
          onClick={toggleMenu}
          className="fixed inset-0 bg-black/50 z-0 w-full h-full"
        ></div>
      )}
    </div>
  );
}
