'use server';
import { apiClient } from '@/utils/api/api-client';
import qs from 'qs';

type MonthlyTarget = {
  documentId: string;
  year: number;
  month: number;
  target: number;
};

type MonthlyTargetResponse = {
  message: string;
  type: 'success' | 'error';
  data: MonthlyTarget[] | null;
  error: string | null;
};

export async function getMonthlyTargets(
  jwt: string
): Promise<MonthlyTargetResponse> {
  if (!jwt) {
    return {
      message: 'الرجاء تسجيل الدخول',
      type: 'error',
      data: null,
      error: 'Session Expired, please login',
    };
  }
  const today = new Date();
  const year = today.getFullYear();

  const q = qs.stringify(
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

  const { error, data } = await apiClient.getMonthlyTargets(jwt, q);
  if (error || !data) {
    return {
      message: 'حدث خطأ, الرجاء المحاولة مرة اخرى',
      type: 'error',
      data: null,
      error: error || 'Failed to fetch monthly target',
    };
  }
  // console.log('Monthly Target Data:', data);
  return {
    message: 'تم جلب الهدف الشهري بنجاح',
    type: 'success',
    data: data,
    error: null,
  };
}

type UpdateTargetResponse = {
  message: string;
  type: 'error' | 'success';
  data: 'Target update Successful' | null;
  error?: string;
};

export async function updateCurrentMonthTarget(
  jwt: string,
  newTarget: number
): Promise<UpdateTargetResponse> {
  if (!jwt) {
    return {
      message: 'Session Expired please login',
      type: 'error',
      data: null,
      error: 'Login Required',
    };
  }
  const today = new Date();
  const q = qs.stringify(
    {
      filters: {
        $and: [
          {
            year: { $eq: today.getFullYear() },
          },
          {
            month: { $eq: today.getMonth() + 1 }, // getMonth() is zero-based, so we add 1
          },
        ],
      },
      // fields: ['documentId'],
    },
    {
      addQueryPrefix: true,
    }
  );
  const { error, data } = await apiClient.updateMonthlyTarget(
    jwt,
    q,
    newTarget
  );
  if (error || !data) {
    return {
      message: 'Error Updating target, Please try again',
      data: null,
      type: 'error',
      error: 'Failed to update monthly target',
    };
  }
  // console.log('Update Monthly Target Data:', data);
  return {
    message: 'تم تحديث الهدف الشهري بنجاح',
    type: 'success',
    data: 'Target update Successful',
  };
}
