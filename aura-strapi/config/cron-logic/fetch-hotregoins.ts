import knex from 'knex';
import connections from '../database';

interface HotRegion {
  id?: string,
  region: "Sudan" | "Egypt" | "KSA",
  total_pay: Number,
  orders_count: Number,
  period_start: String,
  period_end: String,
};

/**
 * fetchHotRegions, a function to fetch the top 10 hot regions based on the number of delivered orders, and store them in the hot_regions table
 * @returns <Promise> hotRegionsRecord: the record of the hot regions
 */
const fetchHotRegions = async (db: knex.Knex) => {
  // const db = knex({client: "mysql", connection});
  const periodEnd = new Date();
  const periodStart = new Date(periodEnd);
  periodStart.setDate(periodStart.getDate() - 7);

  let hotRegionsRecord:any[];
  let hotRegions: HotRegion[];

  // console.log(periodStart.toISOString(), periodEnd.toISOString());
  // query the hot regions from the database
  hotRegions = await db('orders')
    .select('region', db.raw('SUM(total_pay) as total_pay'), db.raw('COUNT(id) as orders_count'))
    .where('order_status', '=',  'delivered')
    .whereBetween('created_at', [periodStart.toISOString(), periodEnd.toISOString()])
    .groupBy('region')
    .orderBy('orders', 'desc');

  console.log(hotRegions);
  // if there were no result, set the hotRegions to the default value
  if (!hotRegions.length) {
    hotRegions = [
      {
      region: "Sudan",
      total_pay: 0,
      orders_count: 0,
      period_end: periodEnd.toISOString(),
      period_start: periodEnd.toISOString(),
    },
      {
      region: "Egypt",
      total_pay: 0,
      orders_count: 0,
      period_end: periodEnd.toISOString(),
      period_start: periodEnd.toISOString(),
    },
      {
      region: "KSA",
      total_pay: 0,
      orders_count: 0,
      period_end: periodEnd.toISOString(),
      period_start: periodEnd.toISOString(),
    },
  ];
  }

  hotRegionsRecord = await db('hot_regions').insert(
    hotRegions.map(({region, total_pay, orders_count}) => (
      {region, total_pay, orders_count,
        period_start: periodStart.toISOString(),
        period_end: periodEnd.toISOString()
      }
    )
  ));

  console.log(hotRegionsRecord);
  return hotRegionsRecord;
};

export {fetchHotRegions};
