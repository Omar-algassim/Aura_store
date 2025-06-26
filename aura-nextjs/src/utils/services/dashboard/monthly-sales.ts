import { apiClient } from '@/utils/api/api-client';
import qs from 'qs';

type MonthlySales = {
  documentId: string;
  year: number;
  month: number;
  orders: number;
  sale: number;
};

type MonthlySalesResponse = {
  message: string;
  type: 'success' | 'error';
  data: MonthlySales[] | null;
  error: string | null;
};

export async function getMonthlySales(
  jwt: string
): Promise<MonthlySalesResponse> {
  if (!jwt) {
    return {
      message: 'الرجاء تسجيل الدخول',
      type: 'error',
      data: null,
      error: 'JWT token is missing',
    };
  }

  const today = new Date();
  const year = today.getFullYear();

  const query = qs.stringify(
    {
      filters: {
        year: {
          $eq: year,
        },
      },
    },
    {
      addQueryPrefix: true,
    }
  );

  const { error, data } = await apiClient.getMonthlySales(jwt, query);
  if (error || !data) {
    return {
      message: 'حدث خطأ, الرجاء المحاولة مرة اخرى',
      type: 'error',
      data: null,
      error: error || 'Failed to fetch monthly sales',
    };
  }

  // console.log('Monthly Sales Data:', data);
  return {
    message: 'تم جلب المبيعات الشهرية بنجاح',
    type: 'success',
    data: data,
    error: null,
  };
}

type SalesByDateResponse = {
  message: string;
  type: 'success' | 'error';
  data: { total_sales: number; total_orders: number } | null;
  error: string | null;
};

export async function getSalesByDate(
  jwt: string,
  date: Date
): Promise<SalesByDateResponse> {
  if (!jwt) {
    return {
      message: 'الرجاء تسجيل الدخول',
      type: 'error',
      data: null,
      error: 'JWT token is missing',
    };
  }

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const query = qs.stringify(
    {
      filters: {
        $and: [
          {
            updatedAt: {
              $gte: startOfDay.toISOString(),
            },
          },
          {
            updatedAt: {
              $lte: endOfDay.toISOString(),
            },
          },
          {
            order_status: {
              $eg: 'delivered',
            },
          },
        ],
      },
      fields: ['total_pay'],
    },
    {
      addQueryPrefix: true,
    }
  );

  const { error, data } = await apiClient.fetchOrder(jwt, query);
  if (error || !data) {
    // console.log('Error getting day orders', error);
    return {
      message: 'حدث خطأ, الرجاء المحاولة مرة اخرى',
      type: 'error',
      data: null,
      error: error || 'Failed to fetch monthly sales by date',
    };
  }

  // console.log('Monthly Sales Data by Date:', data);
  const sales = data.reduce(
    (total: number, order: { total_pay: number }) => total + order.total_pay,
    0
  );
  return {
    message: 'تم جلب المبيعات الشهرية بنجاح',
    type: 'success',
    data: { total_sales: sales, total_orders: data.length },
    error: null,
  };
}
