/**
 * product controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  'api::product.product',
  ({ strapi }) => ({
    async findOne(ctx) {
      const { id } = ctx.params;
      try {
        const { data, meta } = await super.findOne(ctx);
        await strapi.documents('api::product.product').update({
          documentId: id,
          data: {
            viewed: data.viewed + 1, // Increment the viewed count
          },
        });
        await strapi
          .documents('api::product.product')
          .publish({ documentId: id });
        return { data, meta };
      } catch (error) {
        if (error.name === 'NotFoundError') {
          return ctx.notFound('Product not found');
        }
        console.error('Error fetching product:', error);
        return ctx.internalServerError(
          'An error occurred while fetching the product'
        );
      }
    },
  })
);
