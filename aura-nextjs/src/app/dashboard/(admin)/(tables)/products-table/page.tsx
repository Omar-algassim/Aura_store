'use client';
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/dashboard/ui/table';
import DropzoneComponent from '@/components/ui/dashboard/form/form-elements/DropZone';
import Image from 'next/image';
import Button from '@/components/ui/dashboard/ui/button/Button';
import { Modal } from '@/components/ui/dashboard/ui/modal';
import Label from '@/components/ui/dashboard/form/Label';
import Pagination from '@/components/ui/dashboard/tables/Pagination';
import Input from '@/components/ui/dashboard/form/input/InputField';
import TextArea from '@/components/ui/dashboard/form/input/TextArea';
import { BaseUrl } from '@/constants/api-constants';
import SelectInputs from '@/components/ui/dashboard/form/form-elements/SelectInputs';
import MultiSelect from '@/components/ui/dashboard/form/MultiSelect';
import Select from '@/components/ui/dashboard/form/Select';
import { ChevronDownIcon, TrashBinIcon } from '@/icons';
import FileInput from '@/components/ui/dashboard/form/input/FileInput';
import { Product } from '@/interfaces/dto';
import {
  deleteProduct,
  getProducts,
} from '@/utils/services/products-services';
import ProductForm from '../../(forms)/new-product/page';
import { Loader } from '@/components/common/loader';
import cookie from 'js-cookie';
import { useToast } from '@/hooks/use-toast';
import { Alert } from '@/components/ui/shadcn/alert';

export default function ProductTable() {
  const [page, setPage] = React.useState<number>(1);
  const [pageCount, setPageCount] = React.useState<number>(0);
  const [Products, setProducts] = React.useState<Product[] | []>([]);
  const [description, setDescription] = React.useState<string | undefined>('');
  const [specifications, setSpecifications] = React.useState<
    string | undefined
  >('');
  const [usage, setUsage] = React.useState<string | undefined>('');
  const [Categories, setCategories] = React.useState<string[]>([]);
  const [brand, setBrand] = React.useState<string[]>([]);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isDelete, setIsDelete] = React.useState(false);
  const [edit, setEdit] = React.useState<Product>();
  const [toDelete, setToDelete] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      const { error, products, pagination } = await getProducts(
        {
          filters: {
            category: Categories,
            brand: brand,
          },
          sort: 'updatedAt:desc',
        },
        page
      );
      if (error) {
        console.error('Error fetching products:', error.error);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        setProducts(products);
        setPageCount(pagination.pageCount);
      }
    };
    fetchData();
  }, [page]);

  function handleEdit(product: Product): void {
    setEdit(product);
    setSpecifications(edit?.specifications);
    setDescription(edit?.description);
    setUsage(edit?.usage);
    setIsOpen(true);
    console.log('Edit product:', edit);
  }

  async function handleDelete() {
    console.log(toDelete);
    const jwt = cookie.get('jwt');
    if (jwt) {
      setIsLoading(true);
      const response = await deleteProduct(toDelete, jwt);
      if (response.error) {
        setIsDelete(false);
        setIsLoading(false);
        toast({
          variant: 'destructive',
          title: 'Error deleting',
          description: response.error || 'Error deleting product',
        });
      } else {
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.id !== toDelete)
        );
        setToDelete('');
        setIsDelete(false);
        setIsLoading(false);

        toast({
          variant: 'success',
          title: 'delete success',
          description: 'product deleted successfully',
        });
        window.location.reload();
      }
    }
  }

  function toggleDelete(id: string): void {
    if (isDelete) {
      setToDelete('');
    } else {
      setToDelete(id);
    }
    setIsDelete(!isDelete);
  }

  function toggleForm() {
    setIsOpen(!isOpen);
  }

  function nexPage(page: number): void {
    setPage(page);
  }

  // Render the table if there are products

  return (
    <div className='overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6'>
      <div className='flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h3 className='text-lg font-semibold text-gray-800 dark:text-white/90'>
            Products
          </h3>
        </div>

        <div className='flex items-center gap-3'>
          <button className='inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200'>
            <svg
              className='stroke-current fill-white dark:fill-gray-800'
              width='20'
              height='20'
              viewBox='0 0 20 20'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'>
              <path
                d='M2.29004 5.90393H17.7067'
                stroke=''
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M17.7075 14.0961H2.29085'
                stroke=''
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M12.0826 3.33331C13.5024 3.33331 14.6534 4.48431 14.6534 5.90414C14.6534 7.32398 13.5024 8.47498 12.0826 8.47498C10.6627 8.47498 9.51172 7.32398 9.51172 5.90415C9.51172 4.48432 10.6627 3.33331 12.0826 3.33331Z'
                fill=''
                stroke=''
                strokeWidth='1.5'
              />
              <path
                d='M7.91745 11.525C6.49762 11.525 5.34662 12.676 5.34662 14.0959C5.34661 15.5157 6.49762 16.6667 7.91745 16.6667C9.33728 16.6667 10.4883 15.5157 10.4883 14.0959C10.4883 12.676 9.33728 11.525 7.91745 11.525Z'
                fill=''
                stroke=''
                strokeWidth='1.5'
              />
            </svg>
            Filter
          </button>
        </div>
      </div>
      <div className='max-w-full overflow-x-auto'>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <Table>
              {/* Table Header */}
              <TableHeader className='border-gray-100 dark:border-gray-800 border-y'>
                <TableRow>
                  <TableCell
                    isHeader
                    className='py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400'>
                    Product
                  </TableCell>
                  <TableCell
                    isHeader
                    className='py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400'>
                    price
                  </TableCell>
                  <TableCell
                    isHeader
                    className='py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400'>
                    brand
                  </TableCell>
                  {/* ordered */}
                  <TableCell
                    isHeader
                    className='py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400'>
                    ordered
                  </TableCell>
                  {/* views */}
                  <TableCell
                    isHeader
                    className='py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400'>
                    views
                  </TableCell>
                  <TableCell
                    isHeader
                    className='py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400'>
                    operations
                  </TableCell>
                </TableRow>
              </TableHeader>

              {/* Table Body */}

              <TableBody className='divide-y divide-gray-100 dark:divide-gray-800'>
                {Products.map((product) => (
                  <TableRow
                    key={product.id}
                    className=''>
                    <TableCell className='py-3'>
                      <div className='flex items-center gap-3'>
                        <div className='h-[50px] w-[50px] overflow-hidden rounded-md'>
                          <Image
                            width={50}
                            height={50}
                            src={`${BaseUrl}${product.thumbnail}`}
                            className='h-[50px] w-[50px]'
                            alt={product.name}
                          />
                        </div>
                        <div>
                          <p className='font-medium text-gray-800 text-theme-sm dark:text-white/90'>
                            {product.name}
                          </p>
                          <span className='text-gray-500 text-theme-xs dark:text-gray-400'>
                            {product.categories
                              .map((category) => category.title)
                              .join(', ')}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className='py-3 text-gray-500 text-theme-sm dark:text-gray-400'>
                      {product.price}
                    </TableCell>
                    <TableCell className='py-3 text-gray-500 text-theme-sm dark:text-gray-400'>
                      {product.brand?.name ? product.brand.name : 'N/A'}
                    </TableCell>
                    {/* ordered */}
                    <TableCell className='py-3 text-gray-500 text-theme-sm dark:text-gray-400'>
                      {product.ordered}
                    </TableCell>
                    {/* views */}
                    <TableCell className='py-3 text-gray-500 text-theme-sm dark:text-gray-400'>
                      {product.viewed ? product.viewed : 0}
                    </TableCell>

                    {/* operations */}
                    <TableCell className='py-3 text-gray-500 text-theme-sm dark:text-gray-400'>
                      <div className='flex items-center gap-2'>
                        <button
                          onClick={() => handleEdit(product)}
                          className='flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto'>
                          <svg
                            className='fill-current'
                            width='18'
                            height='18'
                            viewBox='0 0 18 18'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'>
                            <path
                              fillRule='evenodd'
                              clipRule='evenodd'
                              d='M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z'
                              fill=''
                            />
                          </svg>
                          Edit
                        </button>

                        <button
                          onClick={() => toggleDelete(product.documentId)}
                          className='flex w-full items-center justify-center gap-2 rounded-full border border-red-900 bg-red-800 px-4 py-3 text-sm font-medium text-white shadow-theme-xs hover:bg-red-950 hover:text-white dark:border-red-950 dark:bg-red-800 dark:text-white dark:hover:bg-red-950 dark:hover:text-white lg:inline-flex lg:w-auto'>
                          <TrashBinIcon className='text-white' />
                          Delete
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className='flex items-center w-full justify-center px-2 mt-4 py-4'>
              <Pagination
                currentPage={page}
                totalPages={pageCount}
                onPageChange={nexPage}
              />
            </div>
          </>
        )}
      </div>
      <Modal
        isOpen={isOpen}
        onClose={toggleForm}
        className='max-w-[700px] m-4'>
        <ProductForm
          data={edit}
          editMode={true}
          toggleEditMode={toggleForm}
        />
      </Modal>
      <Modal
        isOpen={isDelete}
        onClose={() => toggleDelete('')}
        className='max-w-[400px] m-4'>
        <div className='no-scrollbar flex flex-col items-center justify-center justify-items-center w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11'>
          <div className='px-2 pr-14'>
            <h4 className='mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90'>
              Delete Product
            </h4>
            <p className='mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7'>
              Are you sure you want to delete this product?
            </p>
          </div>
          <div className='flex flex-row items-center gap-3 px-2 mt-6 lg:justify-end'>
            <button
              onClick={handleDelete}
              className='inline-flex items-center justify-center gap-2 rounded-full border border-red-900 bg-red-800 px-4 py-3 text-sm font-medium text-white shadow-theme-xs hover:bg-red-900 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto'>
              Delete
            </button>
            <button
              onClick={() => toggleDelete('')}
              className='inline-flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto'>
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
