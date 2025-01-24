import type { Core } from "@strapi/strapi";
import { seedData } from "./seed/seed-data";

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap({ strapi }: { strapi: Core.Strapi }) {
    if (process.env.NODE_ENV !== "production") {
      // /console.log("Running a development environment");
      // seedData(strapi)
      //   .then(() => {})
      //   .catch((error) => {
      //     console.error("Error while seeding data:", error);
      //   });
    }
  },
};
