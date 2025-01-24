import { CartEntity } from "@/entities/cart-entity";
import cookie from "js-cookie";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const initialCart = new CartEntity({
  documentId: "",
  user_id: "",
  total_items: 0,
  total_pay: 0,
  products: {},
});

export type CartReducerAction = {
  type: string;
  payload: { cart: CartEntity };
};

export const CartReducer = (_prevState: any, action: CartReducerAction) => {
  const payload = action.payload;
  switch (action.type) {
    case "CREATE": {
      const cookieCart = cookie.get("cart");
      if (!cookieCart) {
        cookie.set("cart", JSON.stringify(initialCart));
        return initialCart;
      }
      const cartObject = JSON.parse(cookieCart);
      const retrievedCart = new CartEntity({
        documentId: cartObject.documentId,
        user_id: cartObject.user_id,
        total_items: cartObject.total_items,
        total_pay: cartObject.total_pay,
        products: cartObject.products,
      });
      // /console.log("Retrieved cart", JSON.stringify(retrievedCart, null, 2));
      return retrievedCart;
    }

    case "DELETE": {
      cookie.set("cart", JSON.stringify(initialCart));
      return initialCart;
    }

    case "UPDATE": {
      const cart = payload.cart;
      // console.log("Updating cart", cart.total_items, cart.total_pay);
      cookie.set("cart", JSON.stringify(cart.toJson()));
      return cart;
    }

    default: {
      return payload.cart;
    }
  }
};
