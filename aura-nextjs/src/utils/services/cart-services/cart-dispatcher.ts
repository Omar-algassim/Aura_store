import { CartEntity } from '@/entities/cart-entity';
import cookie from 'js-cookie';

export const initialCart = new CartEntity({
  documentId: '',
  user_id: '',
  total_items: 0,
  total_pay: 0,
  products: {},
});

export type CartReducerAction = {
  type: 'CREATE' | 'DELETE' | 'UPDATE';
  payload: { cart: CartEntity | null };
};

export const CartReducer = (_prevState: any, action: CartReducerAction) => {
  const payload = action.payload;
  switch (action.type) {
    case 'CREATE': {
      const cookieCart = cookie.get('cart');
      if (!cookieCart) {
        cookie.set('cart', JSON.stringify(initialCart));
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

    case 'DELETE': {
      cookie.set('cart', JSON.stringify(initialCart));
      return initialCart;
    }

    case 'UPDATE': {
      const cart = payload.cart;
      if (!cart) {
        throw new Error('Cart is null');
      }
      // console.log('Updating cart', cart.total_items, cart.total_pay);
      const cartJson = JSON.stringify(cart.toJson());
      cookie.set('cart', cartJson);
      return new CartEntity({
        documentId: cart.documentId,
        user_id: cart.user_id,
        total_items: cart.total_items,
        total_pay: cart.total_pay,
        products: cart.products,
      });
    }

    default: {
      return payload.cart;
    }
  }
};
