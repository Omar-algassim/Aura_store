import knex from 'knex';

export async function updateMonthlyTarget(db: knex.Knex) {
  try {
    // get the previous month target
    const previousMonth = new Date();
    previousMonth.setMonth(previousMonth.getMonth() - 1);
    let target = await db('monthly_targets')
      .where('month', previousMonth.getMonth() + 1)
      .andWhere('year', previousMonth.getFullYear())
      .first();
    if (!target) {
      strapi.log.warn(
        `No target found for the previous month: ${previousMonth.getMonth() + 1}/${previousMonth.getFullYear()} falling back to default target`
      );
      // if no target found for the previous month, use a default target
      const defaultTarget = {
        month: previousMonth.getMonth() + 1,
        year: previousMonth.getFullYear(),
        target: 100000, // default target value
      };
      target = defaultTarget;
    }
    // update the target for the current month
    const currentMonth = new Date();
    currentMonth.setMonth(currentMonth.getMonth());
    const updatedTarget = {
      month: currentMonth.getMonth() + 1,
      year: currentMonth.getFullYear(),
      target: target.target,
    };
    await db('monthly_targets').insert(updatedTarget);
  } catch (error) {
    strapi.log.error(error);
  }
}
