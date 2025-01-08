import {
  CartProductsDTO,
  DeliveryAddress,
  Product,
  Regions,
} from "@/interfaces/dto";

export class CartEntity {
  documentId: string;
  user_id: string;
  total_pay: number;
  products: CartProductsDTO;

  constructor(
    documentId: string = "",
    user_id: string = "",
    total_pay: number = 0,
    products: CartProductsDTO = {}
  ) {
    this.documentId = documentId;
    this.user_id = user_id;
    this.total_pay = total_pay;
    this.products = products;
  }

  /**
   * add a product to the cart
   * @param product the product to be added to the cart
   * @param amount the amount of the product items to be added, default is 1
   * @description if the product is already in the cart, it will increase the amount of the product by the given amount, otherwise it will add the product to the cart, and adjust the total pay accordingly
   */
  async addProduct(product: Product, amount: number = 1) {
    console.log("Adding product to cart", JSON.stringify(product, null, 2));
    if (Object.hasOwn(this.products, product.documentId)) {
      console.log("Product already in cart, increasing amount");
      this.products[product.documentId].amount += amount;
    } else {
      console.log("Product not in cart, adding it");
      this.products[product.documentId] = { product, amount };
    }
    this.total_pay += product.price * amount;
  }

  /**
   * remove a product from the cart
   * @param product the product to be removed from the cart
   * @param amount the amount of the product items to be removed, default is 1
   * @description if the product is in the cart, it will decrease the amount of the product by the given amount, if the amount is less than the product's amount, otherwise it will remove the product from the cart, and adjust the total pay accordingly
   */
  async removeProduct(product: Product, amount: number = 1) {
    if (Object.hasOwn(this.products, product.documentId)) {
      if (this.products[product.documentId].amount > amount) {
        this.products[product.documentId].amount -= amount;
        this.total_pay -= product.price * amount;
      } else {
        this.total_pay -=
          product.price * this.products[product.documentId].amount;
        delete this.products[product.documentId];
      }
    }
    console.log("Removing product from cart", product);
  }

  /**
   * an interface to clear a product from the cart, it uses the removeProduct method behind the scenes
   * @param product the product to be cleared from the cart
   */
  async clearProduct(product: Product) {
    await this.removeProduct(
      product,
      this.products[product.documentId]?.amount || 1000 * 1000
    );
  }

  /**
   * clear the cart locally, and remove it from the database if it exists
   */
  async clear() {
    this.products = {};
    this.total_pay = 0;
    console.log("Clearing cart");
    // if the cart is in database, delete it
    if (this.documentId) {
      console.log("Deleting cart from database");
    }
  }

  /**
   * Sync the cart with the server
   * @description It will start by creating the cart in database if it doesn't exist, and create the order items by passing the cart id, product id, and quantity.
   */
  async sync(userId: string) {
    console.log("Syncing cart with server");
    if (!this.documentId) {
      console.log("Creating cart in database for user ", userId);
    }
    for (const product of Object.values(this.products)) {
      console.log("Creating order item for product", product);
    }
  }

  /**
   * Checkout the cart and create an order for it
   * @param {string} userId the current logged in user id
   * @param {Regions} region the current region of the ordered user's address
   * @param {DeliveryAddress} delivery_address the delivery address of the order
   * @param {string} checkout_image url image of the checkout screen to be used as a receipt
   * @param {string} order_status the status of the order, default is "pending"
   */
  async checkout(
    userId: string,
    region: Regions,
    delivery_address: DeliveryAddress,
    checkout_image: string,
    order_status: string = "pending"
  ) {
    console.log("Checking out cart");
    console.log(
      "Order: ",
      JSON.stringify(
        {
          userId,
          region,
          delivery_address,
          checkout_image,
          total_pay: this.total_pay,
          order_status,
        },
        null,
        2
      )
    );
    // create order from cart
    // const {error, order} = api.createOrder(userId, region, delete_address, checkout_image, this.total_pay);

    console.log(
      "Order's order items: ",
      JSON.stringify(this.products, null, 2)
    );
    // create order's order items
    // for (const product of Object.values(this.products)) {
  }

  // the clear method need to be called from the same component that calls checkout
}
