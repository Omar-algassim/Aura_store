"use client";
import { CartEntity } from "@/entities/cart-entity";
import {
  CartReducer,
  CartReducerAction,
  initialCart,
} from "@/utils/services/cart-services/cart-dispatcher";
import React, { createContext, useContext, useEffect, useReducer } from "react";

const CartContext = createContext<CartEntity | undefined>(initialCart);
const CartDispatcher = createContext<React.Dispatch<CartReducerAction> | null>(
  null
);

function CartContextProvider({ children }: { children: React.ReactNode }) {
  const [cart, dispatch] = useReducer(CartReducer, initialCart);

  useEffect(() => {
    dispatch({ type: "CREATE", payload: { cart: initialCart } });
  }, []);
  return (
    <CartContext.Provider value={cart}>
      <CartDispatcher.Provider value={dispatch}>
        {children}
      </CartDispatcher.Provider>
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
export const useCartDispatcher = () =>
  useContext(CartDispatcher) as React.Dispatch<CartReducerAction>;
export default CartContextProvider;
