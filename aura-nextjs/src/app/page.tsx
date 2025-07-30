'use client';
import { Footer, Header } from '@/components/ui';
import React from 'react';
import Image from 'next/image';
import { ButtonPrimary } from '@/components/common/Buttons';
import { useRouter } from 'next/navigation';
import ProductsCarousel from '@/components/ui/product/ProductsCarousel';

function Home() {
  const router = useRouter();

  return (
    <div className='flex flex-col items-center justify-center w-screen min-h-screen gap-4 laptop:gap-24 bg-white overflow-x-hidden'>
      <Header />
      <main className='flex flex-col items-center justify-center min-h-screen gap-12 tablet:gap-16 laptop:gap-24 bg-white w-full max-w-[1480px]'>
        {/* cover image */}
        <section className='flex tablet:w-full items-center justify-center -mt-4 tablet:-mt-20'>
          <Image
            src={'/images/cover-image-4.png'}
            width={1140}
            height={600}
            alt={'cover image'}
            content='center'
            className='w-full border border-none tablet:rounded-lg'
          />
        </section>

        {/* product list (Offers) */}
        <section className='flex flex-col gap-4 items-center justify-center w-full px-[17px] tablet:mt-0'>
          <div className='w-full flex flex-col gap-2 tablet:gap-4 items-center'>
            <h2 className='w-full text-xl tablet:text-2xl laptop:text-3xl font-alex font-bold text-right'>
              العروض
            </h2>
            <p className='w-full text-sm tablet:text-xl laptop:text-2xl text-right '>
              احصلي على افضل العروض و الخصومات من أورا
            </p>
          </div>

          {/* product list (offers) items */}
          <div className='w-screen max-w-[1440px] min-h-[408px] tablet:min-h-[526px] flex items-center justify-center gap-4 mt-6 tablet:mt-10'>
            <ProductsCarousel productsType='offers' />
          </div>

          {/* view all */}
          <div className='w-full flex items-center justify-center  mt-6 tablet:mt-10'>
            {/* pass query params for the products to filter-by (offers) */}
            <ButtonPrimary
              handleClick={() => router.push('/products')}
              className='group text-[13px] font-[600] tablet:text-[16px] laptop:text-[18px] tablet:font-[600]'>
              <span className='text-surface group-hover:text-white'>
                جميع المنتجات
              </span>
            </ButtonPrimary>
          </div>
        </section>

        {/* image container */}
        <section className='w-full  flex items-center justify-center'>
          <Image
            src={'/images/cover-image-1.png'}
            width={1140}
            height={600}
            alt={'cover image'}
            content='center'
            className='w-full border border-none tablet:rounded-lg'
          />
        </section>

        {/* products list (latest) */}
        <section className='flex flex-col gap-4 items-center justify-center w-full  mt-12 px-[17px] tablet:mt-0'>
          <div className='w-full flex flex-col gap-2 tablet:gap-4 items-center'>
            <h2 className='w-full text-xl tablet:text-2xl laptop:text-3xl font-alex font-bold text-right'>
              وصل حديثا
            </h2>
            <p className='w-full text-sm tablet:text-xl laptop:text-2xl text-right '>
              اخر المنتجات التي تم اضافتها الى متجرنا
            </p>
          </div>

          {/* product list (latest) items */}
          <div className='w-screen max-w-[1440px] min-h-[408px] tablet:min-h-[526px] flex items-center justify-center gap-4 mt-6 tablet:mt-10'>
            <ProductsCarousel productsType='recent' />
          </div>

          {/* view all */}
          <div className='w-full flex items-center justify-center'>
            {/* pass query params for the products to filter-by (latest) */}
            <ButtonPrimary
              handleClick={() => router.push('/products')}
              className='group text-[13px] font-[600] tablet:text-[16px] laptop:text-[18px] tablet:font-[600]'>
              <span className='text-surface group-hover:text-white'>
                جميع المنتجات
              </span>
            </ButtonPrimary>
          </div>
        </section>

        {/* image container */}
        <section className='w-full  flex items-center justify-center'>
          <Image
            src={'/images/cover-image-2.png'}
            width={1140}
            height={600}
            alt={'cover image'}
            content='center'
            className='w-full border border-none tablet:rounded-lg'
          />
        </section>

        {/* product list (top selling) */}
        <section className='flex flex-col gap-4 items-center justify-center w-full  mt-12 px-[17px] tablet:mt-0'>
          <div className='w-full flex flex-col gap-2 tablet:gap-4 items-center'>
            <h2 className='w-full text-xl tablet:text-2xl laptop:text-3xl font-alex font-bold text-right'>
              الاكثر مبيعا
            </h2>
            <p className='w-full text-sm tablet:text-xl laptop:text-2xl text-right '>
              تعـرفي على افضل المنتجات و الأكثر مبيعا من أورا
            </p>
          </div>

          {/* product list (top-selling) items */}
          <div className='w-screen max-w-[1440px] min-h-[408px] tablet:min-h-[526px] flex items-center justify-center gap-4 mt-6 tablet:mt-10'>
            <ProductsCarousel productsType='bestSelling' />
          </div>

          {/* view all */}
          <div className='w-full flex items-center justify-center'>
            {/* pass query params for the products to filter-by (top-selling) */}
            <ButtonPrimary
              handleClick={() => router.push('/products')}
              className='group text-[13px] font-[600] tablet:text-[16px] laptop:text-[18px] tablet:font-[600]'>
              <span className='text-surface group-hover:text-white'>
                جميع المنتجات
              </span>
            </ButtonPrimary>
          </div>
        </section>

        {/* image container */}
        <section className='w-full  flex items-center justify-center'>
          <Image
            src={'/images/cover-image-3.png'}
            width={1140}
            height={600}
            alt={'cover image'}
            content='center'
            className='w-full border border-none tablet:rounded-lg'
          />
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default Home;
