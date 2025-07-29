import { ButtonSecondary } from '@/components/common/Buttons';
import { ToolTip } from '@/components/common/ToolTip';
import { BaseUrl } from '@/constants/api-constants';
import { starIcon, starIconEmpty } from '@/constants/app-constants';
import { Product } from '@/interfaces/dto';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Skeleton } from '../shadcn/skeleton';
import { getTotalRate } from '@/utils/services/products-services';
import { useCart, useCartDispatcher } from '@/components/context';
import { CartEntity } from '@/entities/cart-entity';
import { CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

function ProductCard({ product }: { product: Product }) {
  const router = useRouter();
  const cart = useCart() as CartEntity;
  const cartDispatcher = useCartDispatcher();
  const [addedToCart, setAddedToCart] = useState(false);
  const totalRate = getTotalRate(product.reviews || []);

  useEffect(() => {
    setAddedToCart(product.documentId in cart.products);
  }, [cart, cart.products, product.documentId]);

  const handleAddToCart = async (product: Product, amount?: number) => {
    await cart.addProduct(product, amount);
    cartDispatcher({ type: 'UPDATE', payload: { cart: cart } });
    setAddedToCart(true);
  };

  const handleRemoveFromCart = async (product: Product) => {
    await cart.removeProduct(product);
    cartDispatcher({ type: 'UPDATE', payload: { cart: cart } });

    const iconTip = document.getElementById('cart-icon-tip');
    if (iconTip) {
      iconTip.innerHTML = cart.total_items.toString();
      if (cart.total_items === 0) {
        iconTip.classList.add('bg-transparent');
        iconTip.classList.remove('bg-primary');
      }
    }
    setAddedToCart(false);
  };

  return (
    <div
      className='relative flex flex-col gap-y-2 justify-stretch tablet:gap-3 min-h-[412px] w-full max-w-[430px] bg-white p-0 m-0 rounded-xl cursor-pointer tablet:hover:drop-shadow-xl transition-all duration-150'
      dir='ltr'
      role='button'
      tabIndex={0}
      onClick={() => {
        router.push(`/product/${product.documentId}`);
      }}>
      {/* Sale tag */}
      {product.discount && (
        <div className='absolute z-30 top-0 right-0 bg-primary text-white text-[13px] font-[500] p-1 rounded-bl-xl rounded-tr-xl'>
          {product.discount}% خصم
        </div>
      )}

      {/* card image */}
      <div className='relative w-full h-[200px] flex items-center justify-center rounded-lg bg-surface overflow-hidden'>
        {/* out of stock */}
        {product.stock <= 0 && (
          <div className='absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden bg-[#03030325] backdrop-blur-sm'>
            <div className='z-40 bg-primary-dark w-[600px] h-[20px] opacity-70 rotate-45' />
            <div className='absolute inset-0 z-50 flex items-center justify-center'>
              <div className='text-white text-[13px] tablet:text-[16px] font-[600] p-1 rounded-bl-xl rounded-tr-xl'>
                نفذ من المخزون
              </div>
            </div>
          </div>
        )}
        <Image
          src={`${BaseUrl}${product.thumbnail}`}
          width={300}
          height={250}
          alt={product.title}
          // content="center"
          // objectFit="contain"
          className='w-[173px] tablet:w-[200px] h-auto object-cover object-center'
        />
      </div>
      {/* card body */}
      <div className='w-full flex flex-col gap-y-2 tablet:gap-y-3 px-2 tablet:px-3'>
        <div className='flex items-center justify-between w-full'>
          {/* product rating */}
          <div className='tablet:px-2 tablet:py-3 flex'>
            <div
              className={`flex items-center justify-center gap-1 w-[64px] h-[24px] tablet:w-[68px] tablet:h-[30px] bg-surface rounded-xl`}
              dir='rtl'>
              <Image
                src={totalRate ? starIcon : starIconEmpty}
                width={16}
                height={16}
                alt='rating'
                className='w-[10px] h-[10px] tablet:w-[16px] tablet:h-[16px]'
              />
              <div
                className={`"flex flex-col item-center justify-center font-[400] p-0 m-0 ${
                  totalRate === 0
                    ? 'text-gray-5000 text-[10px]'
                    : 'text-[13px] '
                }`}>
                {totalRate || 'لا يوجد'}
              </div>
            </div>
          </div>
          {/* add to cart */}
          <div className='w-full flex flex-1 justify-end items-end gap-4'>
            {product.stock > 0 ? (
              addedToCart ? (
                <>
                  <div className='w-full bg-white rounded-lg py-2 flex items-center justify-center absolute top-1/3 left-0 tablet:relative tablet:top-auto tablet:left-auto animate-enter-from-right-and-exit-to-left'>
                    <CheckCircle
                      color='#02C3F9'
                      className='size-3 mr-1'
                    />
                    <span className='text-center text-[11px] tablet:text-[12px] text-primary font-[500] tablet:font-[600]'>
                      تم الإضافة للسلة
                    </span>
                  </div>
                  <ButtonSecondary
                    variant='outline'
                    className='w-[48px] h-[48px] text-[11px] p-0 border-none rounded-full transition-all duration-300 ease-in flex items-center justify-center hover:bg-transparent focus:outline-none focus:bg-transparent active:bg-transparent'
                    preloader
                    handleClick={() => handleRemoveFromCart(product)}>
                    <Image
                      src='/icons/cart-empty.svg'
                      width={24}
                      height={24}
                      alt='remove from cart'
                      className='w-auto h-full max-h-[24px]'
                    />
                  </ButtonSecondary>
                </>
              ) : (
                <ButtonSecondary
                  variant='outline'
                  className='w-[48px] h-[48px] text-[11px] p-0 border-none rounded-full transition-all duration-300 ease-in flex items-center justify-center hover:bg-transparent focus:outline-none focus:bg-transparent active:bg-transparent'
                  preloader
                  handleClick={() => handleAddToCart(product)}>
                  <Image
                    src='/icons/cart-add.svg'
                    width={24}
                    height={24}
                    alt='add to cart'
                    className='w-auto h-full max-h-[24px]'
                  />
                </ButtonSecondary>
              )
            ) : (
              <div className='text-primary-dark text-[13px] tablet:text-[16px] font-[600] p-1 rounded-bl-xl rounded-tr-xl'>
                غير متوفر
              </div>
            )}
          </div>
        </div>
        {/* product title */}
        <div className='w-full tablet:px-1 tablet:py-2 flex justify-end'>
          <ToolTip content={<p>{product.title}</p>}>
            <Link
              href={`/products/${product.documentId}`}
              className={`text-[13px] tablet:text-[22px] font-[500] tablet:max-h-[27px] overflow-hidden cursor-pointer rounded-lg hover:underline hover:opacity-80 transition-all duration-150`}>
              {product.title.length <= 25
                ? product.title
                : `${product.title.slice(0, 25)}...`}
            </Link>
          </ToolTip>
        </div>
        {/* footer */}
        <div className='w-full flex items-center justify-between gap-4'>
          {/* stock */}
          <div className='w-fit tablet:px-1 tablet:py-2 flex flex-col items-end'>
            {product.stock > 0 && (
              <p className='w-full text-[13px] tablet:text-[16px] font-[400] text-primary text-left'>
                {product.stock} متوفر
              </p>
            )}
          </div>
          {/* product price */}
          <div className='w-fit tablet:px-1 tablet:py-2 flex flex-col items-end'>
            <p
              className={`text-[13px] tablet:text-[18px] font-[700] ${
                product.discount && 'line-through opacity-80'
              }`}>
              {product.price} SDG
            </p>
            {product.discount && (
              <p className='text-[13px] tablet:text-[18px] font-[700] text-primary'>
                {Math.round(
                  product.price - (product.price * product.discount) / 100
                )}{' '}
                SDG
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export const ProductCardSkeleton = () => {
  return (
    <div
      className='flex flex-col gap-y-2 justify-stretch tablet:gap-3 min-h-[412px] w-full bg-white p-0 m-0 rounded-xl '
      dir='rtl'>
      <Skeleton className='w-full h-[200px] flex items-center justify-center rounded-lg bg-surface' />
      <div className='w-full flex flex-col gap-y-2 tablet:gap-y-3 px-2 tablet:px-3'>
        <Skeleton className='h-5 w-[50px] bg-surface' />
        <Skeleton className='h-6 w-[100px] tablet:w-[200px] bg-surface' />
        <Skeleton className='h-5 w-[60px] tablet:w-[120px] bg-surface' />
      </div>
      <div
        className='flex flex-1 flex-col justify-end items-end px-2 tablet:px-3 pb-3'
        dir='ltr'>
        <Skeleton className='h-12 w-[140px] tablet:w-[156px] font-[600] bg-surface' />
      </div>
    </div>
  );
};

export default ProductCard;
