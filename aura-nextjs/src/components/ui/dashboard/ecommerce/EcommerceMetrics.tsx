"use client";
import React, { useEffect } from "react";
import Badge from "../ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, GroupIcon } from "@/icons";
import cookie from "js-cookie";
import { getUsers } from "@/utils/services/user-services";
import { getOrders } from "@/utils/services/dashboard/orders";

export const EcommerceMetrics = () => {
  const [error, setError] = React.useState<string | null>(null);
  const [users, setUsers] = React.useState<any[]>([]);
  const [orders, setOrders] = React.useState<any[]>([]);

  useEffect(() => {
    const jwt = cookie.get("jwt");
    if (!jwt) {
      setError("you have to login as editor first");
      return;
    }
    const fetchUsers = async () => {
      const jwt = cookie.get("jwt");
      const response = await getUsers(jwt || "");
      if (response.error) {
        console.error("Error fetching users:", response.error);
        return;
      }
      setUsers(response.data);
       try {
            const response = await getOrders(jwt || "");
            if (response.data) {
              setOrders(response.data);
            } else if (response.error) {
              console.error("Error fetching orders:", response.error);
            }
          } catch (error) {
            console.error("An error occurred while fetching orders:", error);
            setError("An error occurred while fetching orders");
          }
    };
    fetchUsers();
  }
  , []);
  
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Customers
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {users.length}
            </h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon />
            11.01%
          </Badge>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          { error ? <div className="text-red-500">{error}</div> :          
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Orders
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {orders.length}
            </h4>
          </div>}

          <Badge color="error">
            <ArrowDownIcon className="text-error-500" />
            9.05%
          </Badge>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}
    </div>
  );
};
