"use client";
import React, { use, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  getCategories,
  getProducts,
} from "@/utils/services/products-services";
import Dropdown from "@/components/ui/Dropdown";
import Image from "next/image";
import ProductCard from "@/components/ui/product/ProductCard";
import FilterProducts from "@/components/ui/FilterDropdown";
import qs from "qs";
import { Skeleton } from "@/components/ui/shadcn/skeleton";
import InfiniteScroll from 'react-infinite-scroll-component';
import { Product } from "@/interfaces/dto";
import { Loader } from "@/components/common/loader";


interface categoryProps {
  ClickHandler: React.Dispatch<React.SetStateAction<string[] | undefined>>;
}

export function Category(props: categoryProps) {
  const [categories, setCategories] = React.useState<any[]>([]);
  const [SelectedCategories, setSelectedCAtegory] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error , setError] = React.useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getCategories().then((data) => {
      setCategories(data.categories.data);
      console.log("categories", categories);
      setLoading(false);
    }).catch((error) => {
      setError(error.message);
      setLoading(false);
    });
  }
  , []);
  // console.log("selected categories", SelectedCategories);

  function addCategory(item: string) {
    if (SelectedCategories?.includes(item)) {
      console.log("item", item);
      const newSelection = SelectedCategories.filter(
        (category) => category !== item
      );
      setSelectedCAtegory(newSelection);
      const url = new URL(window.location.href);
      url.searchParams.delete("category");
      url.searchParams.set("category", newSelection.join(", "));
      props.ClickHandler(newSelection);
      return;
    }
    const newSelection = [...(SelectedCategories || []), item];
    setSelectedCAtegory(newSelection);
    const url = new URL(window.location.href);
    url.searchParams.delete("category");
    url.searchParams.set("category", newSelection.join(", "));
    props.ClickHandler(newSelection);
    return;
  }

  return ( loading ? <Skeleton /> :
    <div className="flex gap-4">
      {error ? <div>{error}</div> :
       categories.map((item) => (
        <div
          className={`p-3 active:bg-primary active:text-white rounded-2xl text-nowrap cursor-pointer ${
            SelectedCategories.includes(item.documentId) && "bg-primary text-white"
          }`}
          onClick={() => addCategory(item.documentId)}
        >
          {item.title}
        </div>
      ))}
    </div>
  );
}

function ShoppingPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParam = useSearchParams();
  const [loading, setLoading] = React.useState(true);
  const [categories, setCategories] = React.useState<any[]>([]);
  const [SelectedCategories, setSelectedCAtegory] = React.useState<
    string[] | undefined
  >(searchParam.get("category")?.split(", ") || []);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [sort, setSort] = React.useState<string>("الأحدث");
  const [sortValue, setSortValue] = React.useState<string>("createdAt:desc");
  const [brand, setBrand] = React.useState<string[] | undefined>(searchParam.get("brand")?.split(", ") || []);
  const [search, setSearch] = React.useState<string | string[] | undefined>(searchParam.getAll("search"));
  const [maxPrice, setMaxPrice] = React.useState<number>(25000);
  const [minPrice, setMinPrice] = React.useState<number>(0);
  const [openFilter, setOpenFilter] = React.useState(false);
  const [selectAll, setSelectAll] = React.useState(true);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPage, setTotalPage] = React.useState(1);
  const route = useRouter();
  const query = qs.stringify({
    category: SelectedCategories?.join(", "),
    brand: brand?.join(", "),
    search: search,
    sort: sortValue
  });

  const sortType = [
    "الأحدث",
    "الأكثر شعبية",
    "السعر من الأقل الى الأكثر",
    "السعر من الأكثر إلى الأقل",
    "العروض",
  ];

  const sortNavigate: { [key: string]: string } = {
    "الأحدث": "createdAt:desc",
    "الأكثر شعبية": "ordered:desc",
    "السعر من الأقل الى الأكثر": "price:asc",
    "السعر من الأكثر إلى الأقل": "price:desc",
    "العروض": "discount:desc",
  };

  
  // const params = searchParam.getAll("");
  //   const { category, searchParam, brands } = params;
  //   // console.log("params", params);
  //   const BrandArray = Array.isArray(brands) ? brands : brands?.split(",");
  //   const categoryArray = Array.isArray(category)
  //     ? category
  //     : category?.split(",");
  //   setBrand(BrandArray);
  //   setSearch(searchParam);
  //   setSelectedCAtegory(categoryArray);
  //   setSelectAll(false);
  
  useEffect(() => {
    setLoading(true);
    console.log(SelectedCategories, search, brand);
    const fetchCAtegory = async () => {
      if (!SelectedCategories && !search && !brand) {
        setSelectAll(true);
        getProducts().then((data) => {
          setProducts(data.products);
          setCurrentPage(data.pagination.currentPage);
          setTotalPage(data.pagination.pageCount);
          setLoading(false);
        });
      } else {
        console.log("search param test" , searchParam.getAll("category"));
        console.log("query working" , SelectedCategories, search, brand);
        setSelectAll(false);
        getProducts({
          filters: {
            category: SelectedCategories,
            brand: brand,
            price: {
              from: minPrice,
              to: maxPrice,
            }
          },
          sort: sortValue as "createdAt:desc" | "ordered:desc" | "price:desc" | "price:asc" | "discount:desc",
        },currentPage
      ).then((data) => {
        setProducts(data.products);
        setCurrentPage(data.pagination.page);
        setTotalPage(data.pagination.pageCount);
          setLoading(false);
        });
      }
    };
    fetchCAtegory();
  }, []);
  
  useEffect(() => {
    if (SelectedCategories || search || brand || sort || minPrice > 0 || maxPrice < 25000) {
      setSelectAll(false);
      getProducts({
        filters: {
          category: SelectedCategories,
          brand: brand,
          price: {
            from: minPrice,
            to: maxPrice,
          },
        },
        sort: sortValue as "createdAt:desc" | "ordered:desc" | "price:desc" | "price:asc" | "discount:desc",
      },
     ).then((data) => {
        setProducts(data.products);
        setCurrentPage(data.pagination.page);
        setTotalPage(data.pagination.pageCount);
        setLoading(false);
      });
    } else {
      setSelectAll(true);
      getProducts().then((data) => {
        setProducts(data.products);
        setLoading(false);
      });
    }
}, [SelectedCategories, brand, search, sort, maxPrice, minPrice]);

  async function getAll() {
    if (!selectAll) {
      setSelectAll(true);
      getProducts().then((data) => {
        setProducts(data.products);
        setLoading(false);
        setSelectedCAtegory(undefined);
        setBrand(undefined);
        setSearch(undefined);
        setSort("الأحدث");
        setSortValue("createdAt:desc");
        setMaxPrice(250000)
        setMinPrice(0)
      });
      route.push("/products");
    } else {
      route.push(`/products`);
    }
  }
  
  function setPriceRange(maxPrice: number, minPrice: number) {
    setMaxPrice(maxPrice);
    setMinPrice(minPrice);
  };

  function setBrandFilter(brands: string[]) {
    setBrand(brands);
    route.push(`/products?${query}`);
  }

  const ref = useRef<HTMLDivElement>(null)
  const scrollRight = () => {
    const element = ref.current;
    if (element) {
      element.scrollTo({
        left: element.scrollLeft + 100,
        behavior: "smooth",
      });
    }
  };
  const scrollLeft = () => {
    const element = ref.current;
    if (element) {
      element.scrollTo({
        left: element.scrollLeft - 100,
        behavior: "smooth",
      });
    }
  };

  async function nextPage() {
    if (currentPage < totalPage) {
      setCurrentPage(currentPage + 1);
      await getProducts({
        filters: {
          category: SelectedCategories,
          brand: brand,
          price: {
            from: minPrice,
            to: maxPrice,
          },
        },
        sort: sortValue as "createdAt:desc" | "ordered:desc" | "price:desc" | "price:asc" | "discount:desc",
      }, currentPage + 1).then((data) => {
        setProducts([...products, ...data.products]);
        console.log("all products", products)
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
  <div>
    <div>
      {/* categories bar */}
      <div ref={ref} className="flex gap-4 max-w-[100vw] overflow-x-auto scroll-smooth">
        <Image className="sticky right-0 shadow-lg bg-white cursor-pointer" onClick={scrollRight} alt="right scroll" src='icons/rightArrow.svg' width={20} height={20} />
        <div className={`p-3 rounded-2xl text-nowrap cursor-pointer ${selectAll && "bg-primary text-white"}`} onClick={getAll}>جميع المنتجات</div>
          <Category
            ClickHandler={setSelectedCAtegory} />
        <Image className="sticky left-0 shadow-lg bg-white cursor-pointer" onClick={scrollLeft} alt="scroll-left" src='icons/leftArrow.svg' width={20} height={20} />
        </div>
      </div>
      <div className="flex mr-10 gap-8 mt-20">
          <div className="flex flex-col gap-4">
            <p>تصفية النتائج</p>
            <FilterProducts
              openFilter={openFilter}
              onPriceChange={setPriceRange}
              onBrandChange={setBrandFilter}
            >
              <button
                className="w-[97px] flex items-center justify-center bg-blue_shade rounded-2xl p-4"
                onClick={() => setOpenFilter(!openFilter)}
              >
                <Image
                  alt="filter"
                  src="icons/filters.svg"
                  width={20}
                  height={20} />
              </button>
            </FilterProducts>
          </div>
          <div className="flex flex-col gap-4">
            <p>ترتيب حسب</p>
            <Dropdown data={sortType} onSelect={(selected: string) => handleSortChange(selected)}>
              <button className="bg-blue_shade rounded-2xl p-4 flex items-center justify-center">
                {sort}
                <Image
                  alt="sort"
                  src={"icons/arrows-updown.svg"}
                  width={20}
                  height={20} />
              </button>
            </Dropdown>
          </div>
        </div>
        <InfiniteScroll
          dataLength={products.length}
          next={nextPage}
          hasMore={currentPage < totalPage}
          loader={<Loader />}
          endMessage={
            <p className="text-center">
              <b>لا يوجد المزيد من المنتجات</b>
            </p>
          }
        >
          <div className="flex flex-wrap pt-12 pb-12 gap-4 justify-center">
            {products.map((product) => (
              <div className="flex justify-center w-[150px] tablet:w-[300px]" key={product.documentId}>
                <ProductCard key={product.documentId} product={product} />
              </div>
          ))}
          </div>
        </InfiniteScroll>

    </div>
  ); 
}

export default ShoppingPage;