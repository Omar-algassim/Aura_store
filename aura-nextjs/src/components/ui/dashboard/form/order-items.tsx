"use client";
import { useState } from "react";
import Image from "next/image";
import {  Product } from "@/interfaces/dto";
import { FileIcon, TrashBinIcon } from "@/icons";
import { Modal } from "../ui/modal";
import { BaseUrl } from "@/constants/api-constants";

interface OrderItemProps {
    count: number;
    product: Product; // Allow null to handle cases where product is not passed
};

export default function OrderItems(props: OrderItemProps) {
    const [count, setCount] = useState(props.count);
    const [isOpen, setIsOpen] = useState(false);
    const [changed, setChanged] = useState(true);

    function increaseAmount(): void {
      if (count < props.product?.stock) {
        setCount(count + 1);
        if (props.count === count + 1) {
          setChanged(true);
        } else {
          setChanged(false); 
      }
  }
}

    function decreaseAmount(): void {
      if (count > 1) {
        setCount(count - 1);
        if (props.count === count - 1) {
          setChanged(true);
        } else {
          setChanged(false);
        }
    }
    }

    function toggleDeleteModal(): void {
        setIsOpen(!isOpen);
    }

    async function handleDelete(): Promise<void> {
      // Implement the delete logic here
      console.log("Delete item clicked");
      setIsOpen(false);
    }

    function handleSave(): void {
      // Implement the save logic here
      console.log("Save changes clicked");
      setChanged(true);
    }

    if (!props.product) {
        return <div className="text-gray-500">No product available</div>;
    }

    return (
        <div className="flex justify-between items-center w-full border border-primary p-3 rounded-3xl overflow-x-auto">
          <div className="flex flex-col items-start gap-2">
            <div className="overflow-hidden rounded-md">
              <Image
                width={40}
                height={40}
                src={`${BaseUrl}${props.product?.thumbnail}`}
                alt={props.product.name}
              />
            </div>
            <div>
              <p className="font-medium text-gray-500 text-theme-xs dark:text-white/90">
                {props.product?.title || "No title available"}
              </p>
            </div>
          </div>
          <div className="py-3 text-gray-800 text-theme-sm dark:text-gray-400">
            {props.product?.price * count} SDG
          </div>
          <div className="py-3 text-gray-800 text-theme-sm dark:text-gray-400">
            {props.product?.name}
          </div>
           <div className="flex gap-2">
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
          <div className="flex items-center gap-2">
           <button
             onClick={() => console.log("Edit item clicked")}
             type="button"
             disabled={changed}
             className="flex items-center justify-center disabled:cursor-not-allowed disabled:opacity-25 gap-2 rounded-full border border-gray-200 bg-gray-200 px-4 py-3 text-sm font-medium text-white shadow-theme-xs hover:bg-gray-400 hover:text-white dark:border-red-950 dark:bg-red-800 dark:text-white dark:hover:bg-red-950 dark:hover:text-white lg:inline-flex lg:w-auto"
           >
             <FileIcon width={20} />
           </button>
           <button
              onClick={toggleDeleteModal}
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-full border border-red-900 bg-red-800 px-4 py-3 text-sm font-medium text-white shadow-theme-xs hover:bg-red-950 hover:text-white dark:border-red-950 dark:bg-red-800 dark:text-white dark:hover:bg-red-950 dark:hover:text-white lg:inline-flex lg:w-auto"
            >
              <TrashBinIcon width={20} />
            </button>                            
           </div>
          <Modal isOpen={isOpen} onClose={toggleDeleteModal} className="max-w-[400px] m-4">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Delete Item</h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Are you sure you want to delete this item?
              </p>
              <div className="mt-8 max-w-[400px] flex justify-center gap-2">
                <button
                  onClick={toggleDeleteModal}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-full  hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-red-900 bg-red-800 px-4 py-3 text-sm font-medium text-white shadow-theme-xs hover:bg-red-950 hover:text-white dark:border-red-950 dark:bg-red-800 dark:text-white dark:hover:bg-red-950 dark:hover:text-white lg:inline-flex lg:w-auto"
                >
                  Delete
                </button>
              </div>
            </div>
          </Modal>
        </div>
    )
}