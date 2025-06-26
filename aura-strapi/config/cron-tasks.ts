/**
 * Contains the cron tasks that will be run by Strapi cron job
 */

import { calculateMonthlySales } from './cron-logic/calculate-monthly-sales';

import { updateMonthlyTarget } from './cron-logic/update-monthly-target';

export default {
  calculateMonthlySales: {
    task: async ({ strapi }) => {
      try {
        strapi.log.info(
          `Calculating Monthly Sales started at ${new Date().toISOString()}`
        );
        // Call the function to calculate monthly sales
        await calculateMonthlySales();
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
      // rule: '*/1 * * *', // runs every 1 minute for testing purposes
      tz: 'Africa/Cairo', // East Africa Time
    },
  },
  updateMonthlyTarget: {
    task: async ({ strapi }) => {
      strapi.log.info(
        `Updating Monthly Target started at ${new Date().toISOString()}`
      );
      await updateMonthlyTarget();
    },
    options: {
      rule: '0 0 1 * *', // runs on the first day of every month at 00:00 EAT
      // rule: '*/1 * * *', // runs every 1 minute for testing purposes
      tz: 'Africa/Cairo', // East Africa Time
    },
  },
};
