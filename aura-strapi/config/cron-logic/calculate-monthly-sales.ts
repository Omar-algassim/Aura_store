// this is a cron job that calculates the aggregated monthly sales
// runs each day at 00:00 EAT
// query orders for the current month
// and calculate the total order sales and add it to the monthly_sales table for the current month

export async function calculateMonthlySales() {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);

    // Fetch delivered orders for the current month
    const totalOrders = await strapi.documents('api::order.order').findMany({
      filters: {
        $and: [
          {
            updatedAt: {
              $gte: startOfMonth.toISOString(),
            },
          },
          {
            updatedAt: {
              $lt: endOfMonth.toISOString(),
            },
          },
          {
            order_status: {
              $eq: 'delivered',
            },
          },
        ],
      },
      fields: ['total_pay'],
    });

    strapi.log.info(
      `Total delivered orders for the month: ${totalOrders.length}`
    );

    const totalSales = totalOrders.reduce(
      (acc, order) => acc + (order.total_pay || 0),
      0
    );

    // Check if there's already an entry for this month
    const existingSales = await strapi
      .documents('api::sales.sales')
      .findFirst({
        filters: {
          $and: [
            {
              month: {
                $eq: today.getMonth() + 1, // getMonth() is zero-based, so we add 1
              },
            },
            {
              year: {
                $eq: today.getFullYear(),
              },
            },
          ],
        },
        fields: ['sale'], // we only need the documentId which it will be retrieved automatically, so we will add the sales field just to reduce the data size
      });

    const salesData = {
      month: today.getMonth() + 1,
      year: today.getFullYear(),
      sale: totalSales,
      orders: totalOrders.length,
    };

    if (existingSales) {
      // If there is already an entry for this month, update it
      await strapi.documents('api::sales.sales').update({
        documentId: existingSales.documentId,
        data: {
          sale: totalSales,
          orders: totalOrders.length,
        },
      });
      strapi.log.info(
        `Updated monthly sales for ${today.getMonth() + 1}/${today.getFullYear()}: Sales: ${totalSales}, Orders: ${totalOrders.length}`
      );
    } else {
      // Create new entry for this month
      await strapi.documents('api::sales.sales').create({
        data: salesData,
        status: 'published',
      });
      strapi.log.info(
        `Created monthly sales for ${today.getMonth() + 1}/${today.getFullYear()}: Sales: ${totalSales}, Orders: ${totalOrders.length}`
      );
    }
  } catch (error) {
    strapi.log.error('Error calculating monthly sales:', error);
  }
}
