"use client"
import React, { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/dashboard/ui/table";

import Badge from "@/components/ui/dashboard/ui/badge/Badge";
import { Modal } from "@/components/ui/dashboard/ui/modal";
import Button from "@/components/ui/dashboard/ui/button/Button";
import Label from "@/components/ui/dashboard/form/Label";
import Input from "@/components/ui/dashboard/form/input/InputField";
import { useModal } from "@/hooks/useModal";
import { ChevronDownIcon } from "@/icons";
import Select from "@/components/ui/dashboard/form/Select";
import OrderItems from "@/components/ui/dashboard/form/order-items";
import { OrderDTO, OrderItem, OrderStatus, Product } from "@/interfaces/dto";
import { getOrders } from "@/utils/services/dashboard/orders";
import cookie from "js-cookie";



export default function OrderTable() {
    const [isOpen, setIsOpen] = React.useState(false);
    const [edit, setEdit] = React.useState<OrderDTO | undefined>();
    const [orders, setOrders] = React.useState<OrderDTO[]>([]);
    const [status, setStatus] = React.useState<OrderStatus>('pending')
    const [amount, setAmount] = React.useState(0)


    useEffect(() => {
        // Fetch initial data or perform any setup 
        const jwt = cookie.get("jwt");
        const fetchData = async () => {
          if (!jwt) {
            console.error("JWT token is not available");
            return;
          }
          try {
            const response = await getOrders(jwt);
            if (response.data) {
              setOrders(response.data);
            } else if (response.error) {
              console.error("Error fetching orders:", response.error);
            }
          } catch (error) {
            console.error("An error occurred while fetching orders:", error);
          }
        };
        fetchData();
    },[]);
    
    function handleSave(): void {
        throw new Error("Function not implemented.");
    }



  function toggleEditModal(order: OrderDTO | undefined): void {
    setIsOpen(!isOpen);
    if (order) {
      setEdit(order);
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  User
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Order ID
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Customer Phone
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Status
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Total Cost
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Operation
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
                      <div>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {order.user.username}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {order.id}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {/* phone number */}
                    {order.user.phone_number ? (
                      <span className="block font-medium text-gray-800 dark:text-white/90">
                        {order.user.phone_number}
                      </span>
                    ) : (
                      <span className="block font-medium text-gray-800 dark:text-white/90">
                        No phone number provided
                      </span>
                    )} 
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={
                        order.order_status === "confirmed" || "delivered"
                          ? "success"
                          : order.order_status === "pending"
                          ? "warning"
                          : "error"
                      }
                    >
                      {order.order_status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {order.total_pay}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleEditModal(order)}
                        className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
                        >
                       <svg
                         className="fill-current"
                         width="18"
                         height="18"
                         viewBox="0 0 18 18"
                         fill="none"
                         xmlns="http://www.w3.org/2000/svg"
                       >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                          fill=""
                         />
                        </svg>
                       Edit
                     </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={() => toggleEditModal(undefined)} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[800px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Fill Brand Information
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              register new brand in store.
            </p>
          </div>
          <form className="flex flex-col">
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              <div>
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Main information 
                </h5>
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div>
                    <Label>Order status</Label>
                    <div className="relative">
                        <Select
                        defaultValue={edit?.order_status}
                         options={[{value:'pending', label: 'pending'}, {value:'confirmed', label: 'confirmed'}, {value:'delivered', label: 'delivered'}, {value:'canceled', label: 'cancel'}]}
                         placeholder="Select Option"

                         onChange={(value => {
                            setStatus(value as OrderStatus);
                         })}
                         className="dark:bg-dark-900"
                        />
                        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                            <ChevronDownIcon/>
                        </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="">
                <div className="p-6">
                    <Label>Products</Label>
                </div>
                {edit?.order_items.map((orderItem: OrderItem) => (
                  <OrderItems 
                    key={orderItem.order_id} 
                    count={orderItem.quantity} 
                    product={orderItem}
                  />
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
