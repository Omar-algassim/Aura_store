export async function updateMonthlyTarget() {
  try {
    // get the previous month target
    const previousMonth = new Date();
    previousMonth.setMonth(previousMonth.getMonth() - 1);

    const previousTarget = await strapi
      .documents('api::monthly-target.monthly-target')
      .findFirst({
        filters: {
          $and: [
            {
              month: {
                $eq: previousMonth.getMonth() + 1,
              },
            },
            {
              year: {
                $eq: previousMonth.getFullYear(),
              },
            },
          ],
        },
        fields: ['target'],
      });

    let target: number = 0;
    if (!previousTarget) {
      strapi.log.warn(
        `No target found for the previous month: ${previousMonth.getMonth() + 1}/${previousMonth.getFullYear()} falling back to default target`
      );
      // if no target found for the previous month, use a default target
      target = 100000;
    } else {
      target = previousTarget.target;
    }

    // Check if target already exists for current month
    const currentMonth = new Date();
    const existingTarget = await strapi
      .documents('api::monthly-target.monthly-target')
      .findFirst({
        filters: {
          $and: [
            {
              month: {
                $eq: currentMonth.getMonth() + 1,
              },
            },
            {
              year: {
                $eq: currentMonth.getFullYear(),
              },
            },
          ],
        },
      });

    if (existingTarget) {
      strapi.log.info(
        `Target already exists for current month: ${currentMonth.getMonth() + 1}/${currentMonth.getFullYear()}`
      );
      return;
    }

    // Create the target for the current month
    const newTarget = {
      month: currentMonth.getMonth() + 1,
      year: currentMonth.getFullYear(),
      target: target,
    };

    await strapi.documents('api::monthly-target.monthly-target').create({
      data: newTarget,
      status: 'published',
    });

    strapi.log.info(
      `Successfully created monthly target for ${currentMonth.getMonth() + 1}/${currentMonth.getFullYear()} with target: ${target}`
    );
  } catch (error) {
    strapi.log.error('Error updating monthly target:', error);
  }
}
