'use client';
import { useState } from 'react';
import Image from 'next/image';
// import { FileIcon, TrashBinIcon } from "@/icons";
import { Modal } from '../ui/modal';
import { BaseUrl } from '@/constants/api-constants';

interface OrderItemProps {
  count: number;
  product: {
    documentId: string; // Allow documentId to be optional
    title: string; // Allow title to be optional
    price: number; // Allow price to be optional
    thumbnail: string; // Allow thumbnail to be optional
    stock?: number; // Allow stock to be optional
  } | null; // Allow product to be null
}

export default function OrderItems(props: OrderItemProps) {
  // const [count, setCount] = useState(props.count);
  const [isOpen, setIsOpen] = useState(false);
  // const [changed, setChanged] = useState(true);

  //     function increaseAmount(): void {
  //       if (count < props.product?.stock) {
  //         setCount(count + 1);
  //         if (props.count === count + 1) {
  //           setChanged(true);
  //         } else {
  //           setChanged(false);
  //       }
  //   }
  // }

  //     function decreaseAmount(): void {
  //       if (count > 1) {
  //         setCount(count - 1);
  //         if (props.count === count - 1) {
  //           setChanged(true);
  //         } else {
  //           setChanged(false);
  //         }
  //     }
  //     }

  function toggleDeleteModal(): void {
    setIsOpen(!isOpen);
  }
  async function handleDelete(): Promise<void> {
    // Implement the delete logic here
    // console.log("Delete item clicked");
    setIsOpen(false);
  }

  if (!props.product) {
    return <div className='text-gray-500'>No product available</div>;
  }

  return (
    <div className='flex justify-between items-center w-full border border-primary p-3 rounded-3xl overflow-x-auto'>
      {/* image and title */}
      <div className='flex-2/3 flex flex-col items-start gap-2'>
        <div className='overflow-hidden rounded-md'>
          <Image
            width={40}
            height={40}
            src={`${BaseUrl}${props.product?.thumbnail}`}
            alt={props.product.title || 'Product Image'}
          />
        </div>
        <div>
          <p
            className='font-medium text-gray-500 text-theme-xs dark:text-white/90 line-clamp-1'
            title={props.product?.title || 'No title available'}>
            {props.product?.title || 'No title available'}
          </p>
        </div>
      </div>
      <div className='flex-1/3 flex items-end justify-end gap-2 text-gray-800 text-theme-sm dark:text-gray-400'>
        {new Intl.NumberFormat('en-SD', {
          style: 'currency',
          currency: 'SDG',
          minimumFractionDigits: 0,
        }).format(props.product?.price || 0)}
        <div className='flex gap-2'>
          <div>{props.count}</div>
          {/* <span className="flex flex-col gap-1">
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
              </span> */}
        </div>
      </div>
      {/* <div className="flex items-center gap-2">
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
           </div>*/}
      <Modal
        isOpen={isOpen}
        onClose={toggleDeleteModal}
        className='max-w-[400px] m-4'>
        <div className='p-6'>
          <h2 className='text-lg font-semibold text-gray-800 dark:text-white'>
            Delete Item
          </h2>
          <p className='mt-2 text-gray-600 dark:text-gray-400'>
            Are you sure you want to delete this item?
          </p>
          <div className='mt-8 max-w-[400px] flex justify-center gap-2'>
            <button
              onClick={toggleDeleteModal}
              className='px-4 py-2 bg-gray-200 text-gray-800 rounded-full  hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'>
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className='flex w-full items-center justify-center gap-2 rounded-full border border-red-900 bg-red-800 px-4 py-3 text-sm font-medium text-white shadow-theme-xs hover:bg-red-950 hover:text-white dark:border-red-950 dark:bg-red-800 dark:text-white dark:hover:bg-red-950 dark:hover:text-white lg:inline-flex lg:w-auto'>
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
