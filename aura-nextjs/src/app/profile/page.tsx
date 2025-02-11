"use client";
import {
  useCart,
  useCartDispatcher,
  useUser,
  useUserDispatch,
} from "@/components/context";
import { useRouter } from "next/navigation";
import React from "react";
import Image from "next/image";
import Link from "next/link";
// import { ButtonPrimary } from "@/components/common/Buttons";
// import { logout } from "@/utils/services/auth-service";
import AlertDialogElement from "@/components/common/alert-dialog";
import { CartEntity } from "@/entities/cart-entity";
import {
  book as bookIcon,
  user as userIcon,
  cube as cubeIcon,
  exit as exitIcon,
} from "@/constants/app-constants/icons";

const alertProps = {
  header: "تسجيل خروج",
  body: "هل تريد تسجيل الخروج؟",
  action_text: "تأكيد",
  cancel: "إلغاء",
};

function ProfilePage() {
  const user = useUser();
  const userDispatcher = useUserDispatch();
  const cart = useCart() as CartEntity;
  const cartDispatcher = useCartDispatcher();
  const router = useRouter();
  // const cart = useCart() as CartEntity;

  const dateTime = new Date().getHours();

  const welcomingMessage =
    dateTime > 0 && dateTime < 10
      ? "صباح الخير"
      : dateTime > 10 && dateTime < 15
      ? "نهارك سعيد"
      : "مساء الخير";

  const logout = () => {
    userDispatcher({ type: "LOGOUT", payload: {} });
    cartDispatcher({ type: "DELETE", payload: { cart } });
    router.push("/");
  };
  return (
    <>
      {/* profile hero  */}
      <section className="w-full flex flex-col items-center justify-center gap-4 mt-12">
        {/* profile avatar */}
        <div className="w-20 h-20 bg-transparent flex items-center justify-center rounded-full">
          <Image
            src={user.avatar || "/images/default-avatar.png"}
            alt="profile avatar"
            width={80}
            height={80}
          />
        </div>

        {/* welcoming message */}
        <div className="w-full flex flex-col items-center justify-center">
          <h3 className="max-w-[320px] text-center text-lg font-[500]">
            {welcomingMessage}{" "}
          </h3>
          <span className="max-w-[320px] text-center text-lg font-[600]">
            {user.username}
          </span>
        </div>
      </section>

      {/* main profile nav bar */}
      <section className="w-full flex flex-col items-center justify-center gap-4">
        <ul className="w-full max-w-[1024px] flex flex-col items-center justify-center gap-12 list-none">
          <li className="w-full flex gap-3">
            {/* icon */}
            <Image
              className="w-[32px] h-[32px] object-contain object-center"
              src={userIcon}
              alt="profile icon"
              width={42}
              height={42}
            />

            {/* link */}
            <Link
              href="/profile/me"
              className="flex items-center justify-center decoration-transparent text-lg font-[500] hover:text-opacity-85 cursor-pointer"
            >
              المعلومات الشخصية
            </Link>
          </li>
          <li className="w-full flex gap-3">
            {/* icon */}
            <Image
              className="w-[32px] h-[32px] object-contain object-center"
              src={cubeIcon}
              alt="profile icon"
              width={42}
              height={42}
            />

            {/* link */}
            <Link
              href="/profile/orders"
              className="flex items-center justify-center decoration-transparent text-lg font-[500] hover:text-opacity-85 cursor-pointer"
            >
              طلباتي
            </Link>
          </li>
          <li className="w-full flex gap-3">
            {/* icon */}
            <Image
              className="w-[32px] h-[32px] object-contain object-center"
              src={bookIcon}
              alt="profile icon"
              width={42}
              height={42}
            />

            {/* link */}
            <Link
              href="/profile/address-book"
              className="flex items-center justify-center decoration-transparent text-lg font-[500] hover:text-opacity-85 cursor-pointer"
            >
              دليل العناوين
            </Link>
          </li>
          <li className="w-full flex items-center gap-3">
            {/* icon */}
            <Image
              className="w-[32px] h-[32px] object-contain object-center"
              src={exitIcon}
              alt="profile icon"
              width={42}
              height={42}
            />

            {/* link */}
            <AlertDialogElement
              // onClick={toggleMenu}
              trigger={"تسجيل خروج"}
              triggerStyle="bg-transparent text-right text-lg justify-start text-primary font-[600] shadow-none p-0 m-0 hover:bg-transparent hover:text-primary-dark"
              action={logout}
              header={alertProps.header}
              body={alertProps.body}
              cancel="إلغاء"
              action_text={alertProps.action_text}
            />
          </li>
        </ul>
      </section>
    </>
  );
}

export default ProfilePage;
