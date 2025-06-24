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
        let viewed = parseInt(data.viewed, 10) || 0; // Ensure viewed is a number
        if (viewed < 11111111) {
          viewed += 1; // Increment viewed count only if it's less than 11,111,111
        }
        await strapi.documents('api::product.product').update({
          documentId: id,
          data: {
            viewed: viewed, // Increment the viewed count
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
