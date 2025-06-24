// this is a corn job that calculates the aggregated monthly sales
// runs each day at 00:00 EAT
// query database orders table for the current month
// and calculate the total order sales and add it to the monthly_sales table for the current month

import knex from 'knex';

export async function calculateMonthlySales(db: knex.Knex) {
  try {
    const today = new Date();
    const totalOrders = await db('orders')
      .where(
        'updated_at',
        '>=',
        new Date(today.getFullYear(), today.getMonth(), 1)
      )
      .andWhere(
        'updated_at',
        '<',
        new Date(today.getFullYear(), today.getMonth() + 1, 1)
      )
      .andWhere('order_status', '=', 'delivered');
    console.log(
      `Total orders for the month: ${totalOrders.length}`,
      JSON.stringify(totalOrders, null, 2)
    );
    const totalSales = totalOrders.reduce(
      (acc, order) => acc + parseFloat(order.total_pay),
      0
    );
    const currentMonthSales = await db('saleses')
      .where('month', today.getMonth())
      .andWhere('year', today.getFullYear())
      .first();

    if (currentMonthSales) {
      // If there is already an entry for this month, update it
      await db('saleses').where('id', currentMonthSales.id).update({
        sale: totalSales,
        orders: totalOrders.length,
      });
      return;
    }
    await db('saleses').insert({
      month: today.getMonth(),
      year: today.getFullYear(),
      sale: totalSales,
      orders: totalOrders.length,
    });
  } catch (error) {
    console.error('Error calculating monthly sales:', error);
  }
}
