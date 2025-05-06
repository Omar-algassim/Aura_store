'use client'
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DropzoneComponent from "@/components/form/form-elements/DropZone";
import Image from "next/image";
import { useModal } from "@/hooks/useModal";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import { describe } from "node:test";
import SelectInputs from "@/components/form/form-elements/SelectInputs";
import MultiSelect from "@/components/form/MultiSelect";
import Select from "@/components/form/Select";
import { ChevronDownIcon, TrashBinIcon } from "@/icons";
import FileInput from "@/components/form/input/FileInput";

// Define the TypeScript interface for the table rows
interface Product {
  id: number; // Unique identifier for each product
  name: string; // Product name
  variants: string; // Number of variants (e.g., "1 Variant", "2 Variants")
  brand: string; // brand of the product
  price: string; // Price of the product (as a string with currency symbol)
  // status: string; // Status of the product
  image: string; // URL or path to the product image
  status: "Delivered" | "Pending" | "Canceled"; // Status of the product
}

// Define the table data using the interface
const tableData: Product[] = [
  {
    id: 1,
    name: "MacBook Pro 13”",
    variants: "2 Variants",
    brand: "Laptop",
    price: "$2399.00",
    status: "Delivered",
    image: "/images/product/product-01.jpg", // Replace with actual image URL
  },
  {
    id: 2,
    name: "Apple Watch Ultra",
    variants: "1 Variant",
   brand: "Watch",
    price: "$879.00",
    status: "Pending",
    image: "/images/product/product-02.jpg", // Replace with actual image URL
  },
  {
    id: 3,
    name: "iPhone 15 Pro Max",
    variants: "2 Variants",
    brand: "SmartPhone",
    price: "$1869.00",
    status: "Delivered",
    image: "/images/product/product-03.jpg", // Replace with actual image URL
  },
  {
    id: 4,
    name: "iPad Pro 3rd Gen",
    variants: "2 Variants",
    brand: "Electronics",
    price: "$1699.00",
    status: "Canceled",
    image: "/images/product/product-04.jpg", // Replace with actual image URL
  },
  {
    id: 5,
    name: "AirPods Pro 2nd Gen",
    variants: "1 Variant",
    brand: "Accessories",
    price: "$240.00",
    status: "Delivered",
    image: "/images/product/product-05.jpg", // Replace with actual image URL
  },
];

export default function RecentOrders() {
  const [RecentOrders, setRecentOrders] = React.useState<Product[] | []>(tableData || []);
  const [description, setDescription] = React.useState<string>("");
  const [Categories, setCategories] = React.useState<string[]>([]);
  const [brand, setBrand] = React.useState<string>('');
  const { isOpen, openModal, closeModal } = useModal();

  React.useEffect(() => {
    // Simulate an API call to fetch data
    const fetchData = async () => {
      // Simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Set the fetched data to state
      setRecentOrders(tableData);
    };
    fetchData();
  }, []);

  function handleSave(): void {
    throw new Error("Function not implemented.");
  }
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("Selected file:", file.name);
    }
  };

  if (RecentOrders.length === 0) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
        <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Products
            </h3>
          </div>
        </div>
        <p className="text-center text-gray-500">No products available</p>
      </div>
    );
  }

  // Render the table if there are products

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Products
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            <svg
              className="stroke-current fill-white dark:fill-gray-800"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.29004 5.90393H17.7067"
                stroke=""
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17.7075 14.0961H2.29085"
                stroke=""
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12.0826 3.33331C13.5024 3.33331 14.6534 4.48431 14.6534 5.90414C14.6534 7.32398 13.5024 8.47498 12.0826 8.47498C10.6627 8.47498 9.51172 7.32398 9.51172 5.90415C9.51172 4.48432 10.6627 3.33331 12.0826 3.33331Z"
                fill=""
                stroke=""
                strokeWidth="1.5"
              />
              <path
                d="M7.91745 11.525C6.49762 11.525 5.34662 12.676 5.34662 14.0959C5.34661 15.5157 6.49762 16.6667 7.91745 16.6667C9.33728 16.6667 10.4883 15.5157 10.4883 14.0959C10.4883 12.676 9.33728 11.525 7.91745 11.525Z"
                fill=""
                stroke=""
                strokeWidth="1.5"
              />
            </svg>
            Filter
          </button>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
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
                operations
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {tableData.map((product) => (
              <TableRow key={product.id} className="">
                <TableCell className="py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-[50px] w-[50px] overflow-hidden rounded-md">
                      <Image
                        width={50}
                        height={50}
                        src={product.image}
                        className="h-[50px] w-[50px]"
                        alt={product.name}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {product.name}
                      </p>
                      <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                        {product.variants}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {product.price}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {product.brand}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                 <div className="flex items-center gap-2">
                 <button
                    onClick={openModal}
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
                  
                 <button
                    onClick={openModal}
                    className="flex w-full items-center justify-center gap-2 rounded-full border border-red-900 bg-red-800 px-4 py-3 text-sm font-medium text-white shadow-theme-xs hover:bg-red-950 hover:text-white dark:border-red-950 dark:bg-red-800 dark:text-white dark:hover:bg-red-950 dark:hover:text-white lg:inline-flex lg:w-auto"
                  >
                    <TrashBinIcon />
                    Delete
                  </button>
                  
                 </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
              <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                <div className="px-2 pr-14">
                  <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                    Edit Product Information
                  </h4>
                  <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                    Update the product details.
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
                          <Label>Name *</Label>
                          <Input type="text"/>
                        </div>
                        
                        <div>
                          <Label>Title *</Label>
                          <Input type="text" />
                        </div>
                        
                        <div>
                          <MultiSelect
                            label="Category"
                            options={[{value:'category1', text: 'category1', selected: false}, {value:'category2', text: 'category2', selected: false}, {value:'category3', text: 'category3', selected: false}]}
                            onChange={(values) => setCategories(values)}
                          />
                        </div>
                        
                        <div>
                          <Label>Brand</Label>
                         <div className="relative">
                           <Select
                            options={[{value:'brand1', label: 'brand1'}, {value:'brand id', label: 'brand2'}, {value:'brand id', label: 'brand3'}]}
                            placeholder="Select Option"

                            onChange={(value => setBrand(value))}
                            className="dark:bg-dark-900"
                          />
                          <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                              <ChevronDownIcon/>
                            </span>
                         </div>
                        </div>
      
                      </div>
                    </div>
                    <div className="mt-7">
                      <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                        Price information
                      </h5>
      
                      <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                        <div className="col-span-2 lg:col-span-1">
                          <Label>Price *</Label>
                          <Input type="text" />
                        </div>
      
                        <div className="col-span-2 lg:col-span-1">
                          <Label>Discount</Label>
                          <Input type="text" />
                        </div>
      
                      </div>
                      <div>
                        <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                          Additional information
                        </h5>
                      <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">  
                        <div className="col-span-2 lg:col-span-1">
                          <Label>Stock *</Label>
                          <Input placeholder="amount of products in stock" type="text" />
                        </div>

                        <div className="col-span-2 lg:col-span-1">
                          <Label>Color Grade</Label>
                          <Input placeholder="product color grade" type="text" />
                        </div>
                        <div className="col-span-2 lg:col-span-1">
                          <Label>Weight</Label>
                          <Input placeholder="product weight" type="text" />
                        </div>
                        </div>
                        <div className="grid grid-cols-2 gap-x-10 gap-y-6 lg:grid-cols-1 py-6">
                        <div>
                          <Label>Description *</Label>
                          <TextArea
                            value={description}
                            onChange={(value) => setDescription(value)}
                            placeholder="product description"
                          />
                        </div>
                        <div>
                          <Label>Specifications</Label>
                          <TextArea
                            value={description}
                            onChange={(value) => setDescription(value)}
                            placeholder="product description"
                          />
                        </div>
                        <div>
                          <Label>How to Use *</Label>
                          <TextArea
                            value={description}
                            onChange={(value) => setDescription(value)}
                            placeholder="Description of how to use the product"
                          />
                        </div>
                        <div>
                          <Label>Product Thumbnail *</Label>
                          <FileInput onChange={handleFileChange} className="custom-class" />
                        </div>
                        <div>
                          <Label>Product Image *</Label>
                          <DropzoneComponent
                          />
                        </div>
                        </div>
                      </div>
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
