/**
 * Contains the cron tasks that will be run by Strapi cron job
 */

import { calculateMonthlySales } from './cron-logic/calculate-monthly-sales';
import { fetchHotRegions } from './cron-logic/fetch-hotregoins';
import {
  fetchBestSelling,
  fetchSteadySelling,
} from './cron-logic/fetch-selling';
import knex from 'knex';
import { updateMonthlyTarget } from './cron-logic/update-monthly-target';

const getDatabase = (strapi) => {
  const db: knex.Knex = strapi.db.connection;
  return db;
};

export default {
  // // fetching and filling the hot regions table
  // // this will be run every 7 days
  // fetchHotRegionsJob: {
  //   task: async ({ strapi }) => {
  //     strapi.log.info(strapi);
  //     let db: knex.Knex;
  //     let result: any;

  //     try {
  //       db = getDatabase(strapi);
  //       strapi.log.info(
  //         `FetchingHotRegions started at ${new Date().toISOString()}`
  //       );
  //       result = await fetchHotRegions(db);
  //       strapi.log.info(`Result: ${result}`);
  //     } catch (error) {
  //       strapi.log.error(error);
  //     } finally {
  //       strapi.log.info(
  //         `FetchingHotRegions ended at ${new Date().toISOString()}`
  //       );
  //     }
  //   },
  //   options: {
  //     rule: '*/1 * * * *', // runs every 7 days at 0:59 AM on Sunday
  //     tz: 'Africa/Cairo', // East Africa Time
  //   },
  // },
  // // fetching and filling the best selling table
  // // this will be run every 7 days
  // fetchBestSellingJob: {
  //   task: async ({ strapi }) => {
  //     // /console.log(strapi);
  //     let db: knex.Knex;
  //     let result: any;

  //     try {
  //       strapi.log.info(
  //         `FetchingBestSelling started at ${new Date().toISOString()}`
  //       );
  //       db = getDatabase(strapi);
  //       result = await fetchBestSelling(db);
  //       strapi.log.info(`Result: ${result}`);
  //     } catch (error) {
  //       strapi.log.error(error);
  //     } finally {
  //       strapi.log.info(
  //         `FetchingBestSelling ended at ${new Date().toISOString()}`
  //       );
  //     }
  //   },
  //   options: {
  //     rule: '/2 * * * *', // runs every 7 days at 1:00 AM on Thursday
  //     tz: 'Africa/Cairo', // East Africa Time
  //   },
  // },
  // // fetching and filling the steady selling table
  // // this will be run every 7 days
  // fetchSteadySellingJob: {
  //   task: async ({ strapi }) => {
  //     // /console.log(strapi);
  //     let db: knex.Knex;
  //     let result: any;
  //     // const dbConfig = strapi.config.get('database.connections');
  //     try {
  //       db = getDatabase(strapi);
  //       strapi.log.info(
  //         `FetchingSteadySelling started at ${new Date().toISOString()}`
  //       );
  //       result = await fetchSteadySelling(db);

  //       strapi.log.info(`Result: ${result}`);
  //     } catch (error) {
  //       strapi.log.error(error);
  //     } finally {
  //       strapi.log.info(
  //         `FetchingSteadySelling ended at ${new Date().toISOString()}`
  //       );
  //     }
  //   },
  // },
  // options: {
  //   rule: '/3 * * * *', // runs every 7 days at 1:01 AM on Thursday
  //   tz: 'Africa/Cairo', // East Africa Time
  // },
  calculateMonthlySales: {
    task: async ({ strapi }) => {
      let db: knex.Knex;
      try {
        db = getDatabase(strapi);
        strapi.log.info(
          `Calculating Monthly Sales started at ${new Date().toISOString()}`
        );
        // Call the function to calculate monthly sales
        await calculateMonthlySales(db);
      } catch (error) {
        strapi.log.error(error);
      } finally {
        strapi.log.info(
          `Calculating Monthly Sales ended at ${new Date().toISOString()}`
        );
      }
    },
    options: {
      rule: '0 0 * * *', // runs every day at 00:00 EAT
      tz: 'Africa/Cairo', // East Africa Time
    },
  },
  updateMonthlyTarget: {
    task: async ({ strapi }) => {
      let db: knex.Knex;
      db = getDatabase(strapi);
      strapi.log.info(
        `Updating Monthly Target started at ${new Date().toISOString()}`
      );
      await updateMonthlyTarget(db);
    },
    options: {
      rule: '0 0 1 * *', // runs on the first day of every month at 00:00 EAT
      tz: 'Africa/Cairo', // East Africa Time
    },
  },
};
