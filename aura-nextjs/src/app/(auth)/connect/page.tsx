"use client";
import React, { useEffect } from "react";
import { useUserDispatch } from "@/components/context/UserContext";
import { useRouter, useSearchParams } from "next/navigation";
import cookie from "js-cookie";
import { useCart, useCartDispatcher } from "@/components/context";
import { CartEntity } from "@/entities/cart-entity";

function Connect() {
  const searchParams = useSearchParams();
  const userDispatcher = useUserDispatch();
  const cartDispatcher = useCartDispatcher();
  const cart = useCart() as CartEntity;
  const router = useRouter();
  const data = searchParams.get("data");

  useEffect(() => {
    // I think we need to convert it to async function
    //console.log('data ===> ', data)
    if (!data) {
      router.replace("/login");
      return;
    }
    const nextPage = cookie.get("nextPage");
    userDispatcher({ type: "LOGIN", payload: { userData: JSON.parse(data) } });
    cart.sync(JSON.parse(data).user.documentId).then(() => {
      cartDispatcher({ type: "UPDATE", payload: { cart: cart } });
    });
    router.replace(nextPage || "/");
  });

  return <div></div>;
}

export default Connect;
