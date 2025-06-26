'use client';
import { ApexOptions } from 'apexcharts';
import dynamic from 'next/dynamic';
import { MoreDotIcon } from '@/icons';
import { DropdownItem } from '../ui/dropdown/DropdownItem';
import { useState } from 'react';
import { Dropdown } from '../ui/dropdown/Dropdown';
import { numberShortener } from '@/utils/services/dashboard/helper';

// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

type MonthlySalesChartProps = {
  monthlySalesData: {
    year: number;
    month: number;
    orders: number;
    sale: number;
  }[];
  todaySales: number;
};

export default function MonthlySalesChart({
  monthlySalesData,
  todaySales = 0,
}: MonthlySalesChartProps) {
  const options: ApexOptions = {
    colors: ['#d5167b'],
    chart: {
      fontFamily: 'Outfit, sans-serif',
      type: 'bar',
      height: 180,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '39%',
        borderRadius: 5,
        borderRadiusApplication: 'end',
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 4,
      colors: ['transparent'],
    },
    xaxis: {
      categories: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'left',
      fontFamily: 'Outfit',
    },
    yaxis: {
      title: {
        text: undefined,
      },
      labels: {
        formatter: (val: number) => numberShortener(val), // Format y-axis labels to show in thousands
      },
    },
    grid: {
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    fill: {
      opacity: 1,
    },

    tooltip: {
      x: {
        show: false,
      },
      y: {
        formatter: (val: number) => numberShortener(val),
      },
    },
  };
  const series = getSeries();
  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  function getSeries(): ApexAxisChartSeries {
    const series: number[] = Array(12).fill(0);
    if (!monthlySalesData || monthlySalesData.length === 0) {
      return [
        {
          name: 'Sales',
          data: series,
        },
      ];
    }

    const today = new Date();
    const currentMonth = today.getMonth() + 1; // getMonth() is zero-based, so we add 1

    const updateSeries = series.map((_, index) => {
      const monthData = monthlySalesData.find(
        (data) => data.month === index + 1
      );
      if (currentMonth === index + 1) {
        const sale = (monthData ? monthData.sale : 0) + todaySales; // add today's sales for the current month
        return sale;
      }
      const sale = monthData ? monthData.sale : 0.0; // Use the monthly sales data if
      return sale;
    });
    // console.log('Monthly Sales Series:', updateSeries);
    return [
      {
        name: 'Sales',
        data: updateSeries,
      },
    ];
  }

  return (
    <div className='overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6'>
      <div className='flex items-center justify-between'>
        <h3 className='text-lg font-semibold text-gray-800 dark:text-white/90'>
          Monthly Sales
        </h3>

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
              onItemClick={closeDropdown}
              className='flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300'>
              View More
            </DropdownItem>
            <DropdownItem
              onItemClick={closeDropdown}
              className='flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300'>
              Delete
            </DropdownItem>
          </Dropdown>
        </div>
      </div>

      <div className='max-w-full overflow-x-auto custom-scrollbar'>
        <div className='-ml-5 min-w-[650px] xl:min-w-full pl-2'>
          <ReactApexChart
            options={options}
            series={series}
            type='bar'
            height={180}
          />
        </div>
      </div>
    </div>
  );
}
