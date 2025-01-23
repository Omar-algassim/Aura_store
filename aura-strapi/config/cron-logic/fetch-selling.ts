// import connections from '../database';
import knex from "knex";

// const db = knex({client: "mysql", connection});

/**
 * fetchSelling, a generic function to fetch products based on the number of sales and sort them in ascending or descending order depending on the orderBy parameter
 * @param orderBy a string to order the products by, either 'asc' or 'desc'
 * @returns <Promise> selling: an array of the top 10 selling products, periodStart: the start of the period, periodEnd: the end of the period
 */
const fetchSelling = async (db: knex.Knex, orderBy: string) => {
  const periodEnd = new Date();
  const periodStart = new Date(periodEnd);
  periodStart.setDate(periodStart.getDate() - 7);
  // // /console.log(periodStart.toISOString(), periodEnd.toISOString());
  const selling = await db("products")
    .select("id")
    .orderBy("sales", orderBy)
    .limit(10);
  return { selling, periodStart, periodEnd };
};

/**
 * fetchBestSelling, a function to fetch the top 10 best selling products and store them in the best_selling table
 * @returns <Promise> bestSellingRecord: the record of the best selling products
 */
const fetchBestSelling = async (db: knex.Knex) => {
  const {
    selling: bestSelling,
    periodStart,
    periodEnd,
  } = await fetchSelling(db, "desc");
  const bestSellingRecord = await db("best_selling").insert(
    bestSelling.map(({ id }) => ({
      product_id: id,
      period_start: periodStart.toISOString(),
      period_end: periodEnd.toISOString(),
    })),
  );
  return bestSellingRecord;
};

/**
 * fetchSteadySelling, a function to fetch the top 10 steady selling products and store them in the steady_selling table
 * @returns <Promise> steadySellingRecord: the record of the steady selling products
 */
const fetchSteadySelling = async (db: knex.Knex) => {
  const {
    selling: steadySelling,
    periodStart,
    periodEnd,
  } = await fetchSelling(db, "asc");
  const steadySellingRecord = await db("steady_selling").insert(
    steadySelling.map(({ id }) => ({
      product_id: id,
      period_start: periodStart.toISOString(),
      period_end: periodEnd.toISOString(),
    })),
  );
  return steadySellingRecord;
};

export { fetchBestSelling, fetchSteadySelling };
