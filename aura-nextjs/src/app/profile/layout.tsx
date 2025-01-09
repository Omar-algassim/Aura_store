"use client";
import { ButtonPrimary } from "@/components/common/Buttons";
import {
  useCart,
  useCartDispatcher,
  useUser,
  useUserDispatch,
} from "@/components/context";
import { CartEntity } from "@/entities/cart-entity";
import { useRouter } from "next/navigation";
import React from "react";

function ProfileLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = useUser();
  const userDispatcher = useUserDispatch();
  const cart = useCart() as CartEntity;
  const cartDispatcher = useCartDispatcher();

  const logout = () => {
    userDispatcher({ type: "LOGOUT", payload: {} });
    cartDispatcher({ type: "DELETE", payload: { cart } });
    router.push("/");
  };
  return (
    <div>
      <h2>{`Welcome ${user?.username}`}</h2>
      <ButtonPrimary handleClick={logout}>Logout</ButtonPrimary>
      {children}
    </div>
  );
}

export default ProfileLayout;
