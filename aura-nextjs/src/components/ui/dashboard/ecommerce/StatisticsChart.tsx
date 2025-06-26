'use client';
import React from 'react';
// import Chart from "react-apexcharts";
import { ApexOptions } from 'apexcharts';
import ChartTab from '../common/ChartTab';
import dynamic from 'next/dynamic';
import { numberShortener } from '@/utils/services/dashboard/helper';

// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

type StatisticsChartProps = {
  monthlyTargetsData: {
    year: number;
    month: number;
    target: number;
  }[];
  monthlySalesData: {
    year: number;
    month: number;
    orders: number;
    sale: number;
  }[];
  todaySales: number;
};

export default function StatisticsChart({
  monthlyTargetsData,
  monthlySalesData,
  todaySales,
}: StatisticsChartProps) {
  const options: ApexOptions = {
    legend: {
      show: false, // Hide legend
      position: 'top',
      horizontalAlign: 'left',
    },
    colors: ['#d5167b', '#9CB9FF'], // Define line colors
    chart: {
      fontFamily: 'Outfit, sans-serif',
      height: 310,
      type: 'line', // Set the chart type to 'line'
      toolbar: {
        show: false, // Hide chart toolbar
      },
    },
    stroke: {
      curve: 'straight', // Define the line style (straight, smooth, or step)
      width: [2, 2], // Line width for each dataset
    },

    fill: {
      type: 'gradient',
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    markers: {
      size: 0, // Size of the marker points
      strokeColors: '#fff', // Marker border color
      strokeWidth: 2,
      hover: {
        size: 6, // Marker size on hover
      },
    },
    grid: {
      xaxis: {
        lines: {
          show: false, // Hide grid lines on x-axis
        },
      },
      yaxis: {
        lines: {
          show: true, // Show grid lines on y-axis
        },
      },
    },
    dataLabels: {
      enabled: false, // Disable data labels
    },
    tooltip: {
      enabled: true, // Enable tooltip
      x: {
        format: 'dd MMM yyyy', // Format for x-axis tooltip
      },
    },
    xaxis: {
      type: 'category', // Category-based x-axis
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
        show: false, // Hide x-axis border
      },
      axisTicks: {
        show: false, // Hide x-axis ticks
      },
      tooltip: {
        enabled: false, // Disable tooltip for x-axis points
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: '12px', // Adjust font size for y-axis labels
          colors: ['#6B7280'], // Color of the labels
        },
        formatter: (val: number) => {
          return numberShortener(val);
        },
      },
      title: {
        text: '', // Remove y-axis title
        style: {
          fontSize: '0px',
        },
      },
    },
  };

  const series = [
    getSalesSeries()[0], // Sales series
    getTargetSeries()[0], // Target series
  ];

  function getSalesSeries(): ApexAxisChartSeries {
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
  function getTargetSeries(): ApexAxisChartSeries {
    const series: number[] = Array(12).fill(0);
    if (!monthlyTargetsData || monthlyTargetsData.length === 0) {
      return [
        {
          name: 'Target',
          data: series,
        },
      ];
    }

    const updateSeries = series.map((_, index) => {
      const monthData = monthlyTargetsData.find(
        (data) => data.month === index + 1
      );
      return monthData ? monthData.target : 0.0; // Use the monthly target data if available
    });
    // console.log('Monthly Target Series:', updateSeries);
    return [
      {
        name: 'Target',
        data: updateSeries,
      },
    ];
  }

  return (
    <div className='rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6'>
      <div className='flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between'>
        <div className='w-full'>
          <h3 className='text-lg font-semibold text-gray-800 dark:text-white/90'>
            Statistics
          </h3>
          <p className='mt-1 text-gray-500 text-theme-sm dark:text-gray-400'>
            Target you’ve set for each month
          </p>
        </div>
        {/* <div className='flex items-start w-full gap-3 sm:justify-end'>
          <ChartTab />
        </div> */}
      </div>

      <div className='max-w-full overflow-x-auto custom-scrollbar'>
        <div className='min-w-[1000px] xl:min-w-full'>
          <ReactApexChart
            options={options}
            series={series}
            type='area'
            height={310}
          />
        </div>
      </div>
    </div>
  );
}
