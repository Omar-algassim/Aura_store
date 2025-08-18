'use client';
import cookies from 'js-cookie';
import { CartEntity } from '@/entities/cart-entity';
import {
  CartReducer,
  CartReducerAction,
  initialCart,
} from '@/utils/services/cart-services/cart-dispatcher';
import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
} from 'react';

const CartContext = createContext<CartEntity | undefined>(initialCart);
const CartDispatcher = createContext<React.Dispatch<CartReducerAction> | null>(
  null
);

function CartContextProvider({ children }: { children: React.ReactNode }) {
  const cartFromCookies = cookies.get('cart');
  const [cart, dispatch] = useReducer(
    CartReducer,
    cartFromCookies ? JSON.parse(cartFromCookies) : initialCart
  );

  useEffect(() => {
    dispatch({
      type: 'CREATE',
      payload: {
        cart: cartFromCookies ? JSON.parse(cartFromCookies) : initialCart,
      },
    });
  }, []);
  return (
    // stupid solution to avoid typescript error: it's working fine
    <CartContext.Provider value={cart || undefined}>
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
