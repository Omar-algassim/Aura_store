'use client';
import React, { Suspense, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  getCategories,
  getProducts,
} from '@/utils/services/products-services';
import Dropdown from '@/components/ui/Dropdown';
import Image from 'next/image';
import ProductCard from '@/components/ui/product/ProductCard';
import FilterProducts from '@/components/ui/FilterDropdown';
import qs from 'qs';
import { Skeleton } from '@/components/ui/shadcn/skeleton';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Product } from '@/interfaces/dto';
import { Loader } from '@/components/common/loader';
import { ArrowLeftIcon } from 'lucide-react';
import { Preloader } from '@/components/ui/Preloader';

interface categoryProps {
  ClickHandler: React.Dispatch<React.SetStateAction<string[] | undefined>>;
  initialCAtegory: string[] | undefined;
}

function ShoppingPage() {
  const searchParam = useSearchParams();
  const [loading, setLoading] = React.useState(true);
  const [SelectedCategories, setSelectedCAtegory] = React.useState<
    string[] | undefined
  >(searchParam.has('category') ? searchParam.getAll('category') : undefined);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [sort, setSort] = React.useState<string>('الأحدث');
  const [sortValue, setSortValue] = React.useState<string>('createdAt:desc');
  const [brand, setBrand] = React.useState<string[] | undefined>(
    searchParam.has('brand') ? searchParam.getAll('brand') : undefined
  );
  const [search, setSearch] = React.useState<string | string[] | undefined>(
    searchParam.has('search') ? searchParam.getAll('search') : undefined
  );
  const [maxPrice, setMaxPrice] = React.useState<number>(25000);
  const [minPrice, setMinPrice] = React.useState<number>(0);
  const [openFilter, setOpenFilter] = React.useState(false);
  const [selectAll, setSelectAll] = React.useState(true);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPage, setTotalPage] = React.useState(1);
  const [error, setError] = React.useState<string | null>(null);
  const route = useRouter();
  const query = qs.stringify(
    {
      category: SelectedCategories?.join(', '),
      brand: brand?.join(', '),
      search: search,
      sort: sortValue,
    },
    {
      skipNulls: true,
      encode: false,
      indices: false,
      addQueryPrefix: true,
      strictNullHandling: true,
    }
  );
  const sortType = [
    'الأحدث',
    'الأكثر شعبية',
    'السعر من الأقل الى الأكثر',
    'السعر من الأكثر إلى الأقل',
    'العروض',
  ];

  const sortNavigate: { [key: string]: string } = {
    الأحدث: 'createdAt:desc',
    'الأكثر شعبية': 'ordered:desc',
    'السعر من الأقل الى الأكثر': 'price:asc',
    'السعر من الأكثر إلى الأقل': 'price:desc',
    العروض: 'discount:desc',
  };
  // useEffect(() => {
  //   setLoading(true);
  //   // const category = searchParam.getAll("category");
  //   // const searchQuery = searchParam.getAll("search");
  //   // const brands = searchParam.getAll("brand");
  //   // setBrand(brands);
  //   // setSearch(searchQuery);
  //   // setSelectedCAtegory(category);
  //   // console.log(SelectedCategories, search, brand);
  //   const fetchProducts = async () => {
  //     if (!SelectedCategories && !search && !brand) {
  //       setSelectAll(true);
  //       getProducts()
  //         .then((data) => {
  //           setProducts(data.products);
  //           setCurrentPage(data.pagination.currentPage);
  //           setTotalPage(data.pagination.pageCount);
  //           setLoading(false);
  //         })
  //         .catch((error) => {
  //           setError(error.message);
  //           setLoading(false);
  //         });
  //     } else {
  //       setLoading(true);
  //       SelectedCategories ? setSelectAll(false) : setSelectAll(true);
  //       getProducts(
  //         {
  //           filters: {
  //             category: SelectedCategories,
  //             brand: brand,
  //             search: search,
  //             price: {
  //               from: minPrice,
  //               to: maxPrice,
  //             },
  //           },
  //           sort: sortValue as
  //             | "createdAt:desc"
  //             | "ordered:desc"
  //             | "price:desc"
  //             | "price:asc"
  //             | "discount:desc",
  //         },
  //         currentPage
  //       )
  //         .then((data) => {
  //           setProducts(data.products);
  //           setCurrentPage(data.pagination.page);
  //           setTotalPage(data.pagination.pageCount);
  //           setLoading(false);
  //           route.push(`/products${query}`);
  //         })
  //         .catch((error) => {
  //           setError(error.message);
  //           setLoading(false);
  //         });
  //     }
  //   };
  //   fetchProducts();
  // }, []);

  useEffect(() => {
    if (
      SelectedCategories ||
      search ||
      brand ||
      minPrice > 0 ||
      maxPrice < 25000
    ) {
      setSelectAll(false);
      getProducts({
        filters: {
          category: SelectedCategories,
          brand: brand,
          search: search,
          price: {
            from: minPrice,
            to: maxPrice,
          },
        },
        sort: sortValue as
          | 'createdAt:desc'
          | 'ordered:desc'
          | 'price:desc'
          | 'price:asc'
          | 'discount:desc',
      })
        .then((data) => {
          setProducts(data.products);
          setCurrentPage(data.pagination.page);
          setTotalPage(data.pagination.pageCount);
          setLoading(false);
          route.push(`/products${query}`);
        })
        .catch(() => {
          setError('هناك مشكلة في الاتصال بالشبكة');
          setLoading(false);
        });
    } else {
      getProducts(
        {
          filters: {
            category: SelectedCategories,
            brand: brand,
            search: search,
            price: {
              from: minPrice,
              to: maxPrice,
            },
          },
          sort: sortValue as
            | 'createdAt:desc'
            | 'ordered:desc'
            | 'price:desc'
            | 'price:asc'
            | 'discount:desc',
        },
        currentPage
      )
        .then((data) => {
          setProducts(data.products);
          setCurrentPage(data.pagination.page);
          setSelectAll(true);
          setTotalPage(data.pagination.pageCount);
          setLoading(false);
          route.push(`/products${query}`);
        })
        // lint-ignore-next-line
        .catch(() => {
          setError('هناك مشكلة في الاتصال بالشبكة');
          setLoading(false);
        });
      // getProducts().then((data) => {
      //   setProducts(data.products);
      //   route.push(`/products${query}`);
      //   setLoading(false);
      // });
    }
  }, [SelectedCategories, brand, search, sort, maxPrice, minPrice]);

  async function getAll() {
    if (!selectAll) {
      setSelectAll(true);
      getProducts()
        .then((data) => {
          setProducts(data.products);
          setLoading(false);
          setSelectedCAtegory(undefined);
          setBrand(undefined);
          setSearch(undefined);
          setSort('الأحدث');
          setSortValue('createdAt:desc');
          setMaxPrice(250000);
          setMinPrice(0);
          setCurrentPage(data.pagination.page);
          setTotalPage(data.pagination.pageCount);
        })
        .catch((error) => {
          setError(error.message);
          setLoading(false);
        });
      route.push(`/products`);
    } else {
      route.push(`/products`);
    }
  }

  function setPriceRange(maxPrice: number, minPrice: number) {
    setMaxPrice(maxPrice);
    setMinPrice(minPrice);
  }

  function setBrandFilter(brands: string[]) {
    if (brands.length === 0) {
      setBrand(undefined);
      return;
    } else setBrand(brands);

    route.push(`/products${query}`);
  }

  const ref = useRef<HTMLDivElement>(null);
  const scrollRight = () => {
    const element = ref.current;
    if (element) {
      element.scrollTo({
        left: element.scrollLeft + 100,
        behavior: 'smooth',
      });
    }
  };
  const scrollLeft = () => {
    const element = ref.current;
    if (element) {
      element.scrollTo({
        left: element.scrollLeft - 100,
        behavior: 'smooth',
      });
    }
  };

  function HorizontallyScroll(e: React.WheelEvent<HTMLDivElement>) {
    const element = ref.current;
    if (element) {
      e.preventDefault();
      element.scrollTo({
        left: element.scrollLeft - e.deltaY,
        behavior: 'smooth',
      });
    }
  }

  async function nextPage() {
    if (currentPage < totalPage) {
      setCurrentPage(currentPage + 1);
      await getProducts(
        {
          filters: {
            category: SelectedCategories,
            brand: brand,
            price: {
              from: minPrice,
              to: maxPrice,
            },
          },
          sort: sortValue as
            | 'createdAt:desc'
            | 'ordered:desc'
            | 'price:desc'
            | 'price:asc'
            | 'discount:desc',
        },
        currentPage + 1
      ).then((data) => {
        setProducts([...products, ...data.products]);
        console.log('all products', products);
        setLoading(false);
      });
    }
  }

  function handleSortChange(selected: string): void {
    setSort(selected);
    setSortValue(sortNavigate[selected]);
  }

  return loading ? (
    <Skeleton />
  ) : (
    <>
      {/* categories bar */}
      <div
        ref={ref}
        className='w-full relative flex items-center gap-4 overflow-x-auto scroll-smooth'
        onWheel={HorizontallyScroll}>
        {/* scroll buttons right */}
        <button
          className='sticky right-0 self-stretch cursor-pointer rounded-tl-xl rounded-bl-xl hover:text-primary-dark transition-all duration-300 ease-in-out bg-white shadow-sm shadow-white p-2'
          onClick={scrollRight}>
          <span className='sr-only'>Scroll Right</span>
          <ArrowLeftIcon className='rotate-180' />
        </button>
        {/* categories menu */}
        <ul className='flex gap-4'>
          <li>
            <button
              className={`p-3 rounded-2xl text-nowrap cursor-pointer ${
                selectAll && 'bg-primary text-white'
              }`}
              onClick={getAll}>
              جميع المنتجات
            </button>
          </li>
          <Category
            ClickHandler={setSelectedCAtegory}
            initialCAtegory={SelectedCategories}
          />
        </ul>
        {/* scroll buttons left*/}
        <button
          className='sticky left-0 self-stretch rounded-tr-xl rounded-br-xl cursor-pointer hover:text-primary-dark transition-all duration-300 ease-in-out bg-white shadow-sm shadow-white p-2'
          onClick={scrollLeft}>
          <span className='sr-only'>Scroll Left</span>
          <ArrowLeftIcon />
        </button>
      </div>

      {/* filters and sorts */}
      <div className='w-full flex items-center justify-center tablet:justify-start px-3 gap-8 mt-20'>
        <div className='w-fit flex flex-col gap-4'>
          <p>تصفية النتائج</p>
          <FilterProducts
            openFilter={openFilter}
            initialBrand={brand}
            onPriceChange={setPriceRange}
            onBrandChange={setBrandFilter}>
            <button
              className='tablet:w-[97px] flex items-center justify-center bg-blue_shade rounded-2xl p-4 cursor-pointer'
              onClick={() => setOpenFilter(!openFilter)}>
              <Image
                alt='filter'
                src='icons/filters.svg'
                width={20}
                height={20}
              />
            </button>
          </FilterProducts>
        </div>
        <div className='flex-1 max-w-[280px] tablet:flex-auto flex flex-col gap-4'>
          <p>ترتيب حسب</p>
          <Dropdown
            data={sortType}
            value={sort}
            // itemClassName={}
            onSelect={(selected: string) => handleSortChange(selected)}
            className='w-[260px]'>
            <button className='tablet:min-w-[260px] bg-blue_shade rounded-2xl p-4 flex items-center gap-2 cursor-pointer'>
              <span className='flex-1 text-start'>{sort}</span>
              <Image
                alt='sort'
                src={'icons/arrows-updown.svg'}
                width={20}
                height={20}
              />
            </button>
          </Dropdown>
        </div>
      </div>
      {/* products list */}
      <InfiniteScroll
        dataLength={products?.length || 0}
        next={nextPage}
        hasMore={currentPage < totalPage}
        loader={<Loader />}
        endMessage={
          <p className='text-center'>
            <b>{error ? error : `لا يوجد المزيد من المنتجات`}</b>
          </p>
        }>
        <div className='flex flex-wrap px-3 py-12 gap-2 tablet:gap-4 justify-center'>
          {products?.map((product) => (
            <div
              className='flex-1 min-w-[160px] tablet:min-w-[320px]'
              key={product.documentId}>
              <ProductCard
                key={product.documentId}
                product={product}
              />
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </>
  );
}

function Category(props: categoryProps) {
  const [categories, setCategories] = React.useState<any[]>([]);
  const [SelectedCategories, setSelectedCAtegory] = React.useState<
    string[] | undefined
  >([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setSelectedCAtegory(props.initialCAtegory);
    getCategories()
      .then((data) => {
        setCategories(data.categories.data);
        setLoading(false);
      })
      // lint-ignore-next-line
      .catch(() => {
        setError('هناك مشكلة في الاتصال بالشبكة');
        setLoading(false);
      });
  }, []);
  // console.log("selected categories", SelectedCategories);

  useEffect(() => {
    setSelectedCAtegory(props.initialCAtegory);
  }, [props.initialCAtegory]);

  function addCategory(item: string) {
    if (SelectedCategories?.includes(item)) {
      const newSelection = SelectedCategories.filter(
        (category) => category !== item
      );
      if (newSelection.length === 0) {
        setSelectedCAtegory(undefined);
        props.ClickHandler(undefined);
        return;
      }
      setSelectedCAtegory(newSelection);
      props.ClickHandler(newSelection);
      return;
    }
    const newSelection = [...(SelectedCategories || []), item];
    setSelectedCAtegory(newSelection);
    props.ClickHandler(newSelection);
    return;
  }

  return loading ? (
    <Skeleton className='w-2' />
  ) : (
    <>
      {error ? (
        <div></div>
      ) : (
        categories.map((item) => (
          <li key={item.documentId}>
            <button
              className={`p-3 active:bg-primary active:text-white rounded-2xl text-nowrap cursor-pointer transition-all duration-200 ${
                SelectedCategories?.includes(item.documentId)
                  ? 'bg-primary text-white'
                  : 'hover:text-primary-dark border-[1px] border-transparent hover:border-primary-dark'
              }`}
              onClick={() => addCategory(item.documentId)}>
              {item.title}
            </button>
          </li>
        ))
      )}
    </>
  );
}

function Page() {
  return (
    <Suspense fallback={<Preloader />}>
      <ShoppingPage />
    </Suspense>
  );
}

export default Page;
