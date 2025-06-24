'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Router from 'next/navigation';
import { BaseUrl } from '@/constants/api-constants';
import { getProducts } from '@/utils/services/products-services';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/dashboard/ui/table';

export default function TopProduct() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      const { error, products } = await getProducts(
        {
          filters: {},
          sort: 'ordered:desc',
        },
        1,
        5
      );
      if (error) {
        console.error('Error fetching products:', error.error);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        setProducts(products);
        console.log(products);
      }
    };
    fetchData();
  }, []);

  return (
    <div className='overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 mb-10 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6'>
      <div className='flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h3 className='text-lg font-semibold text-gray-800 dark:text-white/90'>
            Top Products
          </h3>
        </div>
        <div className='flex items-center gap-3'>
          <button
            onClick={() => Router.redirect('/dashboard/products-table')}
            className='inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200'>
            See all
          </button>
        </div>
      </div>
      <div className='max-w-full overflow-x-auto'>
        <Table>
          {/* Table Header */}
          <TableHeader className='border-gray-100 dark:border-gray-800 border-y'>
            <TableRow>
              {/* name */}
              <TableCell
                isHeader
                className='py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400'>
                name
              </TableCell>
              {/* price */}
              <TableCell
                isHeader
                className='py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400'>
                price
              </TableCell>
              {/* Brand */}
              <TableCell
                isHeader
                className='py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400'>
                Brand
              </TableCell>
              {/* order count */}
              <TableCell
                isHeader
                className='py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400'>
                Ordered
              </TableCell>
              {/* views count */}
              <TableCell
                isHeader
                className='py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400'>
                Views
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}

          <TableBody className='divide-y divide-gray-100 dark:divide-gray-800'>
            {products?.length > 0 ? (
              products.map((product) => (
                <TableRow
                  key={product.id}
                  className=''>
                  <TableCell className='py-3'>
                    <div className='flex items-center gap-3'>
                      <div className='h-[50px] w-[50px] overflow-hidden rounded-md'>
                        <Image
                          width={50}
                          height={50}
                          src={`${BaseUrl}/${product.thumbnail}`}
                          className='h-[50px] w-[50px]'
                          alt={product.name}
                        />
                      </div>
                      <div>
                        <p className='font-medium text-gray-800 text-theme-sm dark:text-white/90'>
                          {product.name}
                        </p>
                        <span className='text-gray-500 text-theme-xs dark:text-gray-400'>
                          {product.id}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className='py-3 text-gray-500 text-theme-sm dark:text-gray-400'>
                    {product.price}
                  </TableCell>
                  <TableCell className='py-3 text-gray-500 text-theme-sm dark:text-gray-400'>
                    {product.brand ? product.brand.name : 'N/A'}
                  </TableCell>
                  <TableCell className='py-3 text-gray-500 text-theme-sm dark:text-gray-400'>
                    {product.ordered}
                  </TableCell>
                  <TableCell className='py-3 text-gray-500 text-theme-sm dark:text-gray-400'>
                    {product.viewed ? product.viewed : 0}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className='py-3 text-center text-gray-500'>
                  {loading ? 'Loading...' : 'No products found'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
