'use client'
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useModal } from "@/hooks/useModal";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import { PlusIcon, TrashBinIcon } from "@/icons";
import Switch from "@/components/form/switch/Switch";

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

export default function CitiesList() {
  const [ RecentOrders, setRecentOrders ] = React.useState<Product[] | []>(tableData || []);
  const [edit, setEdit] = React.useState<Product>();
  const { isOpen, openModal, closeModal } = useModal();
  const [ alerting, setAlerting ] = React.useState(false)
  const [ openNewCategory, setOpenNewCategory ] = React.useState(false)

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

  function alertingToggle() {
    setAlerting(!alerting);
  }

  function newCategorytWindow() {
    setOpenNewCategory(!openNewCategory);
  }

  function handleSave(): void {
    throw new Error("Function not implemented.");
  }
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("Selected file:", file.name);
    }
  };
  
  function openEdit(data : Product): void {
    setEdit(data);
    openModal();
  }

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
            Brands
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={newCategorytWindow} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            <PlusIcon />
            New Brand
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
                Name
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
              <><TableRow key={product.id} className="">
                    <TableCell className="py-3">
                        <div className="flex items-center gap-3">
                            <div>
                                <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                    {product.name}
                                </p>
                            </div>
                        </div>
                    </TableCell>
                    <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => openEdit(product)}
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
                                        fill="" />
                                </svg>
                                Edit
                            </button>
                            <button
                                onClick={alertingToggle}
                                className="flex w-full items-center justify-center gap-2 rounded-full border border-red-900 bg-red-800 px-4 py-3 text-sm font-medium text-white shadow-theme-xs hover:bg-red-950 hover:text-white dark:border-red-950 dark:bg-red-800 dark:text-white dark:hover:bg-red-950 dark:hover:text-white lg:inline-flex lg:w-auto"
                            >
                                <TrashBinIcon />
                                Delete
                            </button>

                        </div>
                    </TableCell>
                </TableRow>
                </>
            ))}
          </TableBody>

        </Table>
      </div>
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
                        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                            <div className="px-2 pr-14">
                                <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                                    Fill Category Information
                                </h4>
                                <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                                    register new Category in store.
                                </p>
                            </div>
                            <form className="flex flex-col">
                                <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
                                    <div>
                                        <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                                            Main information {edit?.name}
                                        </h5>
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            <div>
                                                <Label>Name *</Label>
                                                <Input placeholder="the name of product" type="text" defaultValue={edit?.name} />
                                            </div>
                                            <div>
                                                <Label>Available</Label>
                                                <Switch label="Available" />
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
            <Modal isOpen={alerting} onClose={alertingToggle} className="max-w-[400px] m-4">
                <div className="no-scrollbar flex flex-col gap-6 mt-4 items-center w-full max-w-[400px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                    <p className="text-white pt-6 text-center text-bold">{`Are you sure to delete "Brand Name" brand`}</p>
                    <div className="flex p-4">
                      <div className="flex gap-6">
                      <button
                    onClick={() => console.log("Delete")}
                    className="flex w-full items-center justify-center gap-2 rounded-full border border-red-900 bg-red-800 px-4 py-3 text-sm font-medium text-white shadow-theme-xs hover:bg-red-950 hover:text-white dark:border-red-950 dark:bg-red-800 dark:text-white dark:hover:bg-red-950 dark:hover:text-white lg:inline-flex lg:w-auto"
                  >
                    Delete
                  </button>
                  <button
                    onClick={alertingToggle}
                    className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
                  >
                          No
                          </button>
                      </div>
                    </div>
                </div>
            </Modal>
            <Modal isOpen={openNewCategory} onClose={newCategorytWindow} className="max-w-[700px] m-4">
            <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
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
      
                        <div>
                          <Label>Name *</Label>
                          <Input placeholder="the name of product" type="text"/>
                        </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                    <Button size="sm" onClick={handleSave}>
                      Submit
                    </Button>
                  </div>
                </form>
              </div>
            </Modal>
    </div>
  );
}
