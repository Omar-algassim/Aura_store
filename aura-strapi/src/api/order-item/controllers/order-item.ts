/**
 * order-item controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  'api::order-item.order-item',
  ({ strapi }) => ({
    async create(ctx) {
      // update the product stock
      const { product: bodyProduct, count: _count } = ctx.request.body.data;

      const productId = bodyProduct.connect;

      const product = await strapi.documents('api::product.product').findOne({
        documentId: productId,
      });

      if (!product) {
        return ctx.badRequest('Product not found');
      }
      const count = parseInt(_count, 10);
      const stock = parseInt(product.stock, 10);
      if (stock < count) {
        return ctx.badRequest('Not enough stock');
      }
      // Update the product stock

      const ordered = parseInt(product.ordered, 10);
      const viewed = parseInt(product.viewed || '0', 10);

      try {
        await strapi.documents('api::product.product').update({
          documentId: productId,
          data: {
            stock: stock - count,
            ordered: ordered + count,
            viewed: viewed + 1,
          },
        });
      } catch (error) {
        console.error('Error updating product stock:', error);
        return ctx.internalServerError('Error updating product stock');
      }
      // Call the default create action
      const { data, meta } = await super.create(ctx);

      // Return the response
      return { data, meta };
    },
  })
);
