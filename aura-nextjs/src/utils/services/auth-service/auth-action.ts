"use server";

import { apiClient } from "@/utils/api/api-client";

/**
 * 
 * @param confirmationToken
 * @returns new confirmed user information
 */

export const confirmEmail = async (confirmationToken: string) => {
  try {
    const { error, data } = await apiClient.confirmEmail(confirmationToken);
    if (error) {
      return { ok: false, error };
    }
    return { ok: true, data };
  } catch (error: any) {
    // console.error('Error from confirmEmail Service:', error);
    return {
      ok: false,
      error: {
        message: error.message || 'حدث خطأ ما, الرجاء المحاوله مره اخرى',
        code: error.code || 500,
      },
    };
  }
};