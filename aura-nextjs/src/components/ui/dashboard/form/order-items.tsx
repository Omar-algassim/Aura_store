"use client";
import { useState } from "react";
import { Table } from "lucide-react";
import { TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import Image from "next/image";
import { OrderItem } from "@/interfaces/dto";
import { TrashBinIcon } from "@/icons";
import { Modal } from "../ui/modal";

interface orderItem {
    count: number;
    product: OrderItem;
}

export default function OrderItems(props: orderItem) {
    const [count, setCount] = useState(props.count);
    const [isOpen, setIsOpen] = useState(false);



    function increaseAmount(): void {
        setCount(count + 1);
    }

    function decreaseAmount(): void {
        if (count > 0) {
            setCount(count - 1);
        }
    }

    function toggleDeleteModal(): void {
        setIsOpen(!isOpen);
    }

    return (
        <div>
          <Table>
            {/* Table Header */}
            <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
              <TableRow>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Product
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  price
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  brand
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Amount
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  operations
                </TableCell>
              </TableRow>
            </TableHeader>
      
            {/* Table Body */}
      
            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                <TableRow key={props.product.order_id} className="">
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-[50px] w-[50px] overflow-hidden rounded-md">
                        <Image
                          width={50}
                          height={50}
                          src={props.product.product.thumbnail}
                          className="h-[50px] w-[50px]"
                          alt={props.product.product.title}
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {props.product.product.title}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {props.product.product.price}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {props.product.product.title}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    <div className="flex gap-1">
                        <div>
                            {count}
                        </div>
                        <span className="flex flex-col gap-1">
                            <Image
                            onClick={increaseAmount}
                            alt='increase'
                            width={18}
                            height={18}
                            className="cursor-pointer"
                            src='/icons/angle-up.svg' />
                            <Image
                            onClick={decreaseAmount}
                            alt='decrease'
                            width={18}
                            height={18}
                            className="cursor-pointer"
                            src='/icons/angle-down.svg' />
                        </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                   <div className="flex items-center gap-2">
                   <button
                      onClick={toggleDeleteModal}
                      type="button"
                      className="flex w-full items-center justify-center gap-2 rounded-full border border-red-900 bg-red-800 px-4 py-3 text-sm font-medium text-white shadow-theme-xs hover:bg-red-950 hover:text-white dark:border-red-950 dark:bg-red-800 dark:text-white dark:hover:bg-red-950 dark:hover:text-white lg:inline-flex lg:w-auto"
                    >
                      <TrashBinIcon />
                      Delete
                    </button>                            
                   </div>
                  </TableCell>
                </TableRow>
            </TableBody>
          </Table>
          <Modal isOpen={isOpen} onClose={toggleDeleteModal}>
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Delete Item</h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Are you sure you want to delete this item?
              </p>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={toggleDeleteModal}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Handle delete logic here
                    toggleDeleteModal();
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </Modal>
        </div>
    )
}