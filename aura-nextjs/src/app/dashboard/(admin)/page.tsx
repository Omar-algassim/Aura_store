"use server';";

import type { Metadata } from 'next';
import { EcommerceMetrics } from '@/components/ui/dashboard/ecommerce/EcommerceMetrics';
import MonthlyTarget from '@/components/ui/dashboard/ecommerce/MonthlyTarget';
import MonthlySalesChart from '@/components/ui/dashboard/ecommerce/MonthlySalesChart';
import StatisticsChart from '@/components/ui/dashboard/ecommerce/StatisticsChart';
import TopProduct from '@/components/ui/dashboard/ecommerce/TopProduct';
import DemographicCard from '@/components/ui/dashboard/ecommerce/DemographicCard';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getMonthlyTargets } from '@/utils/services/dashboard/monthly-targets';
import {
  getMonthlySales,
  getSalesByDate,
} from '@/utils/services/dashboard/monthly-sales';

export const metadata: Metadata = {
  title: 'Aura-Admin',
  description: 'This is dashboard page for Aura admins',
};

// should be update to fetch all the dashboard stats from the server
// and pass them as props to the components
export default async function Ecommerce() {
  const cookiesStore = await cookies();
  const jwt = cookiesStore.get('jwt')?.value || '';
  if (!jwt) {
    redirect('/login?msg=الرجاء تسجيل الدخول');
  }

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  // fetch monthly target data
  const { error, data: monthlyTargetData } = await getMonthlyTargets(jwt);
  if (error || !monthlyTargetData) {
    console.error('Error fetching monthly target:', error);
    redirect('/404?msg=حدث خطأ, الرجاء المحاولة مرة اخرى');
  }

  const currentMonthTarget = monthlyTargetData.find(
    (target) => target.year === year && target.month === month
  );

  // fetch monthly sales data
  const { error: salesError, data: monthlySalesData } = await getMonthlySales(
    jwt
  );

  if (salesError || !monthlySalesData) {
    console.error('Error fetching monthly sales:', salesError);
    redirect('/404?msg=حدث خطأ, الرجاء المحاولة مرة اخرى');
  }
  const currentMonthSales = monthlySalesData.find(
    (sale) => sale.year === year && sale.month === month
  );

  const pastMonthSales = monthlySalesData.find(
    (sale) => sale.year === year && sale.month === month - 1
  );

  // fetch today sales
  const currentDay = new Date();
  const yesterday = new Date(
    currentDay.getFullYear(),
    currentDay.getMonth(),
    currentDay.getDate() - 1
  );

  const { error: todayOrderSalesError, data: todayOrderSales } =
    await getSalesByDate(jwt, currentDay);
  if (todayOrderSalesError || todayOrderSales === null) {
    console.error('Error fetching monthly sales:', salesError);
    redirect('/404?msg=حدث خطأ, الرجاء المحاولة مرة اخرى');
  }

  const { error: yesterdayOrderSalesError, data: yesterdayOrderSales } =
    await getSalesByDate(jwt, yesterday);
  if (yesterdayOrderSalesError || yesterdayOrderSales === null) {
    console.error('Error fetching monthly sales:', yesterdayOrderSalesError);
    redirect('/404?msg=حدث خطأ, الرجاء المحاولة مرة اخرى');
  }

  // console.log('Current Month Target:', currentMonthTarget);
  // console.log('Current Month Sales:', currentMonthSales);

  return (
    <div className='grid grid-cols-12 gap-4 md:gap-6'>
      <div className='col-span-12 space-y-6 xl:col-span-7'>
        <EcommerceMetrics />

        <MonthlySalesChart />
      </div>

      <div className='col-span-12 xl:col-span-5'>
        <MonthlyTarget
          currentMonthTarget={currentMonthTarget?.target}
          currentMonthSales={currentMonthSales?.sale}
          pastMonthSales={pastMonthSales?.sale}
          todayOrderSales={todayOrderSales}
          yesterdayOrderSales={yesterdayOrderSales}
        />
      </div>

      <div className='col-span-12'>
        <StatisticsChart />
      </div>

      <div className='col-span-12 xl:col-span-5'>
        <DemographicCard />
      </div>

      <div className='col-span-12 xl:col-span-7'>
        <TopProduct />
      </div>
    </div>
  );
}
