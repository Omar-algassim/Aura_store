/* eslint-disable @typescript-eslint/no-explicit-any */
import qs from "qs";
import { apiClient } from "../api/api-client";
import { OrderDTO } from "@/interfaces/dto";
export const getUserOrders = async (
  jwt: string,
  userId: string
): Promise<{ error?: any; data?: OrderDTO[] }> => {
  const q = qs.stringify({
    filters: {
      user: {
        documentId: {
          $eq: userId,
        },
      },
    },
    sort: ["createdAt:desc"],
    populate: {
      order_items: {
        populate: "*",
      },
    },
  });

  const { error, data } = await apiClient.getUserOrders(jwt, q);

  if (error || !data) {
    return { error: error || "حدث خطاء, الرجاء المحاولة مرة اخرى" };
  }
  return { data };
};
