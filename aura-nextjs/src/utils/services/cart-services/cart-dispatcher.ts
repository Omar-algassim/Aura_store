import { CartEntity } from "@/entities/cart-entity";
import cookie from "js-cookie";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const initialCart = new CartEntity();

export type CartReducerAction = {
  type: string;
  payload: { cart: CartEntity };
};

// NOTE: We should remove all the async calls from the reducer and use it in the component instead, we can call the reducer from the component and pass the async call result as a payload
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
      return new CartEntity(
        cartObject.documentId,
        cartObject.user_id,
        cartObject.products,
        cartObject.total_pay
      );
    }

    case "DELETE": {
      cookie.set("cart", JSON.stringify(initialCart));
      return initialCart;
    }

    // no need for it, instead we call DELETE after clearing the cart from the component
    case "CLEAR": {
      const cart: CartEntity = payload.cart;
      cart.clear().then(() => {
        cookie.set("cart", JSON.stringify(initialCart));
      });
      return initialCart;
    }

    // all the following cases can be converted to UPDATE
    case "SYNC": {
      const cart: CartEntity = payload.cart;
      if (!cart || Object.keys(cart.products).length === 0) {
        return cart;
      }
      // cart.sync().then(() => {
      //   cookie.set("cart", JSON.stringify(cart));
      //   return cart;
      // });
      break;
    }

    case "ADD_PRODUCT": {
      const cart = payload.cart;
      // cart.addProduct(payload.product).then(() => {
      //   cookie.set("cart", JSON.stringify(cart));
      // });
      // break;
      return cart;
    }

    case "REMOVE_PRODUCT": {
      const cart = payload.cart;
      // cart.removeProduct(payload.product).then(() => {
      //   cookie.set("cart", JSON.stringify(cart));
      // });
      // break;
      return cart;
    }

    case "UPDATE": {
      const cart = payload.cart;
      cookie.set("cart", JSON.stringify(cart));
      return cart;
    }

    default: {
      return payload.cart;
    }
  }
};
