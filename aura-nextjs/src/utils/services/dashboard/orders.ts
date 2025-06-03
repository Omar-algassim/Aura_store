import { apiClient } from "@/utils/api/api-client";

export async function getOrders(jwt: string): 
Promise<{
    message: string;
    type?: string;
    data: any | null;
    error?: any;
}> {
  try {
    const {error, data} = await apiClient.fetchOrder(jwt);
    if (error) {
      return {
        message: error.message,
        type: "server error",
        data: null,
        error: error,
      };
    }
    if (data) {
      return {
        message: "Orders fetched successfully",
        type: "success",
        data: data,
        error: null,
      };
    }
    return {
      message: "No orders found",
      type: "info",
      data: null,
      error: null,
    };
  } catch (error) {
    console.error("Error fetching orders:", error);
    return {
      message: "Failed to fetch orders",
      type: "error",
      data: null,
      error: error,
    };
  }
}