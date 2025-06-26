'use client';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

import cookies from 'js-cookie';
import { Edit } from 'lucide-react';
import { ApexOptions } from 'apexcharts';

import { getSalesByDate } from '@/utils/services/dashboard/monthly-sales';
import { updateCurrentMonthTarget } from '@/utils/services/dashboard/monthly-targets';

import { MoreDotIcon } from '@/icons';
import { DropdownItem } from '@/components/ui/dashboard/ui/dropdown/DropdownItem';
import { Dropdown } from '@/components/ui/dashboard/ui/dropdown/Dropdown';

import { useToast } from '@/hooks/use-toast';

// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

type MonthlyTargetProps = {
  currentMonthTarget?: number;
  currentMonthSales?: number;
  pastMonthSales?: number;
};

export default function MonthlyTarget({
  currentMonthTarget = 0,
  currentMonthSales = 0,
  pastMonthSales = 0,
}: MonthlyTargetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [target, setTarget] = useState(currentMonthTarget);
  const [editTarget, setEditTarget] = useState(false);
  const [targetReachedValue, setTargetReachedValue] = useState(0);
  const [isTargetReached, setIsTargetReached] = useState(false);
  const [targetIncrease, setTargetIncrease] = useState(0);
  const [newTarget, setNewTarget] = useState(currentMonthTarget);

  const [sales, setSales] = useState(currentMonthSales);
  const [todaySales, setTodaySales] = useState(0);
  const [todaySalesIncrease, setTodaySalesIncrease] = useState(false);

  const { toast } = useToast();

  const options: ApexOptions = {
    colors: [isTargetReached ? '#039855' : '#d5167b'],
    chart: {
      fontFamily: 'Outfit, sans-serif',
      type: 'radialBar',
      height: 330,
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -85,
        endAngle: 85,
        hollow: {
          size: '80%',
        },
        track: {
          background: '#E4E7EC',
          strokeWidth: '100%',
          margin: 5, // margin is in pixels
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            fontSize: '36px',
            fontWeight: '600',
            offsetY: -40,
            color: '#1D2939',
            formatter: function (val) {
              return val + '%';
            },
          },
        },
      },
    },
    fill: {
      type: 'solid',
      colors: [isTargetReached ? '#039855' : '#d5167b'],
    },
    stroke: {
      lineCap: 'round',
    },
    labels: ['Progress'],
  };
  const jwt = cookies.get('jwt');

  const salesStatusMessages = {
    salesIncreased:
      "You earned ${{todayEarns}} today, it's higher than last day. Keep up your good work!",
    salesDecreased:
      "You earned ${{todayEarns}} today, it's lower than last day. Steady Days will Pass Soon",
  };

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function numberShortener(num: number): string {
    if (num >= 1e9) {
      return (num / 1e9).toFixed(1) + 'B';
    } else if (num >= 1e6) {
      return (num / 1e6).toFixed(1) + 'M';
    } else if (num >= 1e3) {
      return (num / 1e3).toFixed(1) + 'K';
    } else {
      return num.toString();
    }
  }

  async function updateTarget() {
    if (!jwt) {
      setError('Session expired, Please login');
      return;
    }
    const { error, data } = await updateCurrentMonthTarget(jwt, newTarget);
    if (error || !data) {
      setError(error || 'Error updating target, please try again');
      setEditTarget(false);
      return;
    }
    toast({
      title: 'Target Updated',
      description: `Target has been updated to ${numberShortener(newTarget)}`,
      variant: 'success',
    });
    setTarget(newTarget);
    setEditTarget(false);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  // get today and yesterday sales for current year
  useEffect(() => {
    const fetchTodaySales = async () => {
      if (!jwt) {
        setError('Session expired, please login again');
        return;
      }
      const currentDay = new Date();
      const currentDayPastMonth = new Date(
        currentDay.getFullYear(),
        currentDay.getMonth(),
        currentDay.getDate() - 1
      );

      const { error: todayOrderSalesError, data: todayOrderSales } =
        await getSalesByDate(jwt, currentDay);
      if (todayOrderSalesError || todayOrderSales === null) {
        setError(
          todayOrderSalesError || 'Error getting sales for current date'
        );
        return;
      }
      setTodaySales(todayOrderSales);
      setSales((prev) => prev + todayOrderSales);

      const {
        error: todayPastMonthSalesError,
        data: todayPastMonthOrderSales,
      } = await getSalesByDate(jwt, currentDayPastMonth);
      if (todayPastMonthSalesError || todayPastMonthOrderSales === null) {
        setError(
          todayPastMonthSalesError ||
            'Error getting sales for the selected Date'
        );
        return;
      }
      setTodaySalesIncrease(todayOrderSales > todayPastMonthOrderSales);
    };
    fetchTodaySales();
  }, []);

  // calculate target Reached
  useEffect(() => {
    const targetReachedValueValue = parseFloat(
      ((sales / target) * 100).toFixed(2)
    );
    setTargetReachedValue(targetReachedValueValue);
    const salesWithoutToday = sales - todaySales;
    const targetReachedValueValueWithoutTodaySales = parseFloat(
      ((salesWithoutToday / target) * 100).toFixed(2)
    );
    setTargetIncrease(
      targetReachedValueValue - targetReachedValueValueWithoutTodaySales
    );
    setIsTargetReached(targetReachedValueValue >= 100);
  }, [target, todaySales]);

  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: error,
        variant: 'destructive',
      });
      setError(null);
    }
  }, [error]);

  return (
    <div className='rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]'>
      <div className='px-5 pt-5 bg-white shadow-default rounded-2xl pb-11 dark:bg-gray-900 sm:px-6 sm:pt-6'>
        <div className='flex justify-between'>
          <div>
            <h3 className='text-lg font-semibold text-gray-800 dark:text-white/90'>
              Monthly Target
            </h3>
            <p className='mt-1 font-normal text-gray-500 text-theme-sm dark:text-gray-400'>
              Target you’ve set for each month
            </p>
          </div>
          <div className='relative inline-block'>
            <button
              onClick={toggleDropdown}
              className='dropdown-toggle'>
              <MoreDotIcon className='text-gray-400 hover:text-gray-700 dark:hover:text-gray-300' />
            </button>
            <Dropdown
              isOpen={isOpen}
              onClose={closeDropdown}
              className='w-40 p-2'>
              <DropdownItem
                tag='a'
                onItemClick={closeDropdown}
                className='flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300'>
                View More
              </DropdownItem>
              <DropdownItem
                tag='a'
                onItemClick={closeDropdown}
                className='flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300'>
                Delete
              </DropdownItem>
            </Dropdown>
          </div>
        </div>
        <div className='relative '>
          <div className='max-h-[330px]'>
            <ReactApexChart
              key={targetReachedValue}
              options={options}
              series={[targetReachedValue]}
              type='radialBar'
              height={330}
            />
            <span className='sr-only'>
              {targetReachedValue.toFixed(2)}% of your target reached
            </span>
          </div>

          <span className='absolute left-1/2 top-full -translate-x-1/2 -translate-y-[95%] rounded-full bg-success-50 px-3 py-1 text-xs font-medium text-success-600 dark:bg-success-500/15 dark:text-success-500'>
            +{targetIncrease.toFixed(2)}%
          </span>
        </div>
        <p className='mx-auto mt-10 w-full max-w-[380px] text-center text-sm text-gray-500 sm:text-base'>
          {todaySalesIncrease
            ? salesStatusMessages.salesIncreased.replace(
                '{{todayEarns}}',
                numberShortener(todaySales)
              )
            : salesStatusMessages.salesDecreased.replace(
                '{{todayEarns}}',
                numberShortener(todaySales)
              )}
        </p>
      </div>

      <div className='flex items-center justify-center gap-5 px-6 py-3.5 sm:gap-8 sm:py-5'>
        <div>
          <p className='mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm'>
            Target
          </p>
          {editTarget ? (
            <div>
              <input
                type='number'
                name='target'
                defaultValue={newTarget}
                value={newTarget}
                onChange={(e) => setNewTarget(Number(e.target.value))}
                className='max-w-[160px] rounded-lg border border-gray-300 bg-white px-3 py-2 text-base font-semibold text-gray-800 dark:bg-gray-900 dark:text-white/90 focus:outline-none focus:ring-2 focus:ring-primary-500'
              />
              <button
                onClick={updateTarget}
                className='m-2 text-sm text-white bg-primary rounded-xl px-4 py-3 cursor-pointer hover:bg-primary-dark'>
                Save
              </button>
            </div>
          ) : (
            <p className='flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg'>
              <Edit
                onClick={() => setEditTarget(true)}
                className='h-5 w-5 text-primary cursor-pointer dark:text-gray-500'
              />
              {numberShortener(target)}
              {/* {targetIncrease ? (
                <svg
                  width='16'
                  height='16'
                  viewBox='0 0 16 16'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'>
                  <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M7.60141 2.33683C7.73885 2.18084 7.9401 2.08243 8.16435 2.08243C8.16475 2.08243 8.16516 2.08243 8.16556 2.08243C8.35773 2.08219 8.54998 2.15535 8.69664 2.30191L12.6968 6.29924C12.9898 6.59203 12.9899 7.0669 12.6971 7.3599C12.4044 7.6529 11.9295 7.65306 11.6365 7.36027L8.91435 4.64004L8.91435 13.5C8.91435 13.9142 8.57856 14.25 8.16435 14.25C7.75013 14.25 7.41435 13.9142 7.41435 13.5L7.41435 4.64442L4.69679 7.36025C4.4038 7.65305 3.92893 7.6529 3.63613 7.35992C3.34333 7.06693 3.34348 6.59206 3.63646 6.29926L7.60141 2.33683Z'
                    fill='#039855'
                  />
                </svg>
              ) : (
                <svg
                  width='16'
                  height='16'
                  viewBox='0 0 16 16'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'>
                  <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M7.26816 13.6632C7.4056 13.8192 7.60686 13.9176 7.8311 13.9176C7.83148 13.9176 7.83187 13.9176 7.83226 13.9176C8.02445 13.9178 8.21671 13.8447 8.36339 13.6981L12.3635 9.70076C12.6565 9.40797 12.6567 8.9331 12.3639 8.6401C12.0711 8.34711 11.5962 8.34694 11.3032 8.63973L8.5811 11.36L8.5811 2.5C8.5811 2.08579 8.24531 1.75 7.8311 1.75C7.41688 1.75 7.0811 2.08579 7.0811 2.5L7.0811 11.3556L4.36354 8.63975C4.07055 8.34695 3.59568 8.3471 3.30288 8.64009C3.01008 8.93307 3.01023 9.40794 3.30321 9.70075L7.26816 13.6632Z'
                    fill='#D92D20'
                  />
                </svg>
              )} */}
            </p>
          )}
        </div>

        <div className='w-px bg-gray-200 h-7 dark:bg-gray-800'></div>

        <div>
          <p className='mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm'>
            Sales
          </p>
          <p className='flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg'>
            {numberShortener(sales)}
            {currentMonthSales > pastMonthSales ? (
              <svg
                width='16'
                height='16'
                viewBox='0 0 16 16'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'>
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M7.60141 2.33683C7.73885 2.18084 7.9401 2.08243 8.16435 2.08243C8.16475 2.08243 8.16516 2.08243 8.16556 2.08243C8.35773 2.08219 8.54998 2.15535 8.69664 2.30191L12.6968 6.29924C12.9898 6.59203 12.9899 7.0669 12.6971 7.3599C12.4044 7.6529 11.9295 7.65306 11.6365 7.36027L8.91435 4.64004L8.91435 13.5C8.91435 13.9142 8.57856 14.25 8.16435 14.25C7.75013 14.25 7.41435 13.9142 7.41435 13.5L7.41435 4.64442L4.69679 7.36025C4.4038 7.65305 3.92893 7.6529 3.63613 7.35992C3.34333 7.06693 3.34348 6.59206 3.63646 6.29926L7.60141 2.33683Z'
                  fill='#039855'
                />
              </svg>
            ) : (
              <svg
                width='16'
                height='16'
                viewBox='0 0 16 16'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'>
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M7.26816 13.6632C7.4056 13.8192 7.60686 13.9176 7.8311 13.9176C7.83148 13.9176 7.83187 13.9176 7.83226 13.9176C8.02445 13.9178 8.21671 13.8447 8.36339 13.6981L12.3635 9.70076C12.6565 9.40797 12.6567 8.9331 12.3639 8.6401C12.0711 8.34711 11.5962 8.34694 11.3032 8.63973L8.5811 11.36L8.5811 2.5C8.5811 2.08579 8.24531 1.75 7.8311 1.75C7.41688 1.75 7.0811 2.08579 7.0811 2.5L7.0811 11.3556L4.36354 8.63975C4.07055 8.34695 3.59568 8.3471 3.30288 8.64009C3.01008 8.93307 3.01023 9.40794 3.30321 9.70075L7.26816 13.6632Z'
                  fill='#D92D20'
                />
              </svg>
            )}
          </p>
        </div>

        <div className='w-px bg-gray-200 h-7 dark:bg-gray-800'></div>

        <div>
          <p className='mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm'>
            Today
          </p>
          <p className='flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg'>
            {numberShortener(todaySales)}
            {todaySalesIncrease ? (
              <svg
                width='16'
                height='16'
                viewBox='0 0 16 16'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'>
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M7.60141 2.33683C7.73885 2.18084 7.9401 2.08243 8.16435 2.08243C8.16475 2.08243 8.16516 2.08243 8.16556 2.08243C8.35773 2.08219 8.54998 2.15535 8.69664 2.30191L12.6968 6.29924C12.9898 6.59203 12.9899 7.0669 12.6971 7.3599C12.4044 7.6529 11.9295 7.65306 11.6365 7.36027L8.91435 4.64004L8.91435 13.5C8.91435 13.9142 8.57856 14.25 8.16435 14.25C7.75013 14.25 7.41435 13.9142 7.41435 13.5L7.41435 4.64442L4.69679 7.36025C4.4038 7.65305 3.92893 7.6529 3.63613 7.35992C3.34333 7.06693 3.34348 6.59206 3.63646 6.29926L7.60141 2.33683Z'
                  fill='#039855'
                />
              </svg>
            ) : (
              <svg
                width='16'
                height='16'
                viewBox='0 0 16 16'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'>
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M7.26816 13.6632C7.4056 13.8192 7.60686 13.9176 7.8311 13.9176C7.83148 13.9176 7.83187 13.9176 7.83226 13.9176C8.02445 13.9178 8.21671 13.8447 8.36339 13.6981L12.3635 9.70076C12.6565 9.40797 12.6567 8.9331 12.3639 8.6401C12.0711 8.34711 11.5962 8.34694 11.3032 8.63973L8.5811 11.36L8.5811 2.5C8.5811 2.08579 8.24531 1.75 7.8311 1.75C7.41688 1.75 7.0811 2.08579 7.0811 2.5L7.0811 11.3556L4.36354 8.63975C4.07055 8.34695 3.59568 8.3471 3.30288 8.64009C3.01008 8.93307 3.01023 9.40794 3.30321 9.70075L7.26816 13.6632Z'
                  fill='#D92D20'
                />
              </svg>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
