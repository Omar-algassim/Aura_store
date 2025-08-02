'use client';
import cookie from 'js-cookie';
import { ButtonPrimary } from '@/components/common/Buttons';
import { ToolTip } from '@/components/common/ToolTip';
import { BaseUrl } from '@/constants/api-constants';
import { starIcon } from '@/constants/app-constants';
import { Product } from '@/interfaces/dto';
import { CheckCircle, Minus, Plus } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import RenderMarkdown from '../RenderMarkdown';
import { useCart, useCartDispatcher, useUser } from '@/components/context';
import ProductRate, { SetProductRates } from './ProductRate';
import { getUserMe } from '@/utils/services/user-services';
import { useRouter } from 'next/navigation';
import {
  createProductReview,
  getTotalRate,
} from '@/utils/services/products-services';
import ProductReview from './ProductReview';
import ProductsCarousel from './ProductsCarousel';
import AlertDialogElement from '@/components/common/alert-dialog';
import { CartEntity } from '@/entities/cart-entity';
import { useToast } from '@/hooks/use-toast';

function ProductPageComponent(params: { product: Product }) {
  const router = useRouter();
  const user = useUser();
  const cart = useCart() as CartEntity;
  const cartDispatcher = useCartDispatcher();
  const [error, setError] = useState('');
  const [errorOpen, setErrorOpen] = useState(false);
  const [product] = useState(params.product);
  const [addedToCart, setAddedToCart] = useState(false);
  const [hero, setHero] = useState(product.thumbnail);
  const [images] = useState([hero, ...product.images.map((img) => img.url)]);
  // const [loadingImage, setLoadingImage] = useState(true);
  const [productReviews, setProductReviews] = useState(product.reviews || []);
  const [quantity, setQuantity] = useState(1);
  const [review, setReview] = useState('');
  const [rate, setRate] = useState(0);
  const { toast } = useToast();

  // console.log(JSON.stringify(product, null, 2));
  const totalRate = getTotalRate(productReviews);

  useEffect(() => {
    if (addedToCart) {
      const timer = setTimeout(() => {
        setAddedToCart(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [addedToCart]);

  const swapHero = (newHero: string) => {
    if (newHero === hero) return;
    setHero(newHero);
  };

  const increaseQuantity = () => {
    const newQuantity = quantity + 1;
    if (newQuantity >= product.stock) {
      // handle it in better way
      return;
    }
    setQuantity(newQuantity);
  };

  const decreaseQuantity = () => {
    if (quantity <= 1) {
      // handle it in better way
      return;
    }
    setQuantity(quantity - 1);
  };

  const addToCart = async () => {
    // console.log(`adding ${quantity} items from ${product.title} to cart`);
    await cart.addProduct(product, quantity);
    // console.log(`added ${quantity} items from ${product.title} to cart`);
    // console.log('Cart total items ', cart.total_items);
    cartDispatcher({ type: 'UPDATE', payload: { cart: cart } });
    const iconTip = document.getElementById('cart-icon-tip');
    if (iconTip) {
      iconTip.innerHTML = cart.total_items.toString();
      iconTip.classList.remove('bg-transparent');
      iconTip.classList.add('bg-primary');
    }
    setAddedToCart(true);
  };

  const sendReview = async () => {
    // check if all the fields are their
    // console.log(
    //   `sending review for ${product.title} with ${review} and rate ${rate} stars, sended by ${user.username}`
    // );
    if (!review || !rate) {
      setError('الرجاء كتابة تقيمك مع اختيار التقدير اولا');
      setErrorOpen(true);
      toast({
        title: 'خطأ',
        description: 'الرجاء كتابة تقيمك مع اختيار التقدير اولا',
        variant: 'destructive',
      });
      return;
    }
    // check if the user logged in
    const jwt = cookie.get('jwt');
    const { ok } = await getUserMe(jwt);
    if (!ok || !jwt) {
      cookie.set('nextPage', `/products/${product.documentId}`);
      alert('يجب تسجيل الدخول أولا');
      router.push('/login');
      return;
    }
    // send the review, using the reviewService
    // console.log('user', user);
    const { error, data } = await createProductReview(
      product.documentId,
      user.documentId,
      user.username,
      { text: review, rate: rate },
      jwt
    );

    if (error) {
      setError(error);
      return;
    }
    setReview('');
    setRate(0);
    setProductReviews([...productReviews, data]);
  };

  const toReadablePrice = (price: number): string => {
    return new Intl.NumberFormat('en-SD', {
      style: 'currency',
      currency: 'SDG',
      minimumFractionDigits: 0,
    }).format(price);
  };
  return (
    <>
      <div className='w-full flex flex-col items-center tablet:items-start gap-y-2'>
        {/* product main */}
        <section className='w-full flex flex-col items-center justify-center gap-8 mb-8 tablet:mb-12 laptop:mb-20'>
          {/* product images */}
          <div className='flex flex-col gap-y-2 w-full p-0 m-0'>
            {/* hero */}
            <div className='relative w-full flex items-center justify-center bg-surface tablet:rounded-xl overflow-hidden'>
              {/* out of stock */}
              {product.stock <= 0 && (
                <div className='absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden bg-[#03030325] backdrop-blur-sm'>
                  <div className='z-40 bg-primary-dark w-[600px] h-[20px] opacity-70 rotate-45' />
                  <div className='absolute inset-0 z-50 flex items-center justify-center'>
                    <div className='text-white text-[13px] tablet:text-[18px] laptop:text-[22px] font-[600] p-1 rounded-bl-xl rounded-tr-xl'>
                      نفذ من المخزون
                    </div>
                  </div>
                </div>
              )}
              <Image
                className='w-full max-w-[392px] max-h-[236px] tablet:max-w-[1140px] tablet:max-h-[400px] laptop:w-full laptop:max-h-[560px] laptop:max-w-[1400px] tablet:rounded-xl object-contain object-center animate-out '
                src={`${BaseUrl}${hero}`}
                width={1400}
                height={800}
                alt={product.title}
              />
            </div>
            {/* product rating */}
            <div className='w-full max-w-[1044px] tablet:px-2 tablet:py-3 flex justify-start mx-[16px]'>
              <div
                className={`flex items-center justify-center gap-1 w-[50px] h-[24px] tablet:w-[54px] tablet:h-[30px] bg-surface rounded-xl ${
                  !totalRate && 'hidden'
                }`}>
                <Image
                  src={starIcon}
                  width={16}
                  height={16}
                  alt='rating'
                  className='w-[10px] h-[10px] tablet:w-[16px] tablet:h-[16px]'
                />
                <div className='flex flex-col item-center justify-center text-[13px] font-[400] p-0 m-0'>
                  {totalRate}
                </div>
              </div>
            </div>

            {/* product images */}
            <div className='flex flex-row flex-wrap gap-2 w-full max-w-[640px] px-[16px]'>
              {images.map((img, index) => (
                <div
                  key={index}
                  className='relative w-[71px] h-[71px] tablet:w-[100px] tablet:h-[100px]  bg-surface rounded-lg overflow-hidden'
                  onClick={() => swapHero(img)}
                  onMouseEnter={() => swapHero(img)}
                  // onMouseLeave={() => swapHero(img, index)}
                >
                  {/* out of stock */}
                  {product.stock <= 0 && (
                    <div className='absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden bg-[#03030325] backdrop-blur-sm'>
                      <div className='z-40 bg-primary-dark w-[600px] h-[10px] opacity-70 rotate-45' />
                      <div className='absolute inset-0 z-50 flex items-center justify-center'>
                        <div className='text-white text-center text-[13px]  font-[600] p-1 rounded-bl-xl rounded-tr-xl'>
                          نفذ من المخزون
                        </div>
                      </div>
                    </div>
                  )}
                  <Image
                    className='w-[71px] h-[71px] tablet:w-[100px] tablet:h-[100px] object-cover object-center rounded-lg animate-in cursor-pointer hover:scale-105 hover:ring-1 hover:ring-primary transition-transform duration-50'
                    src={`${BaseUrl}${img}`}
                    width={100}
                    height={100}
                    alt={product.title}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* product title/price */}
          <div className='w-full flex flex-col gap-2 items-center justify-center px-[16px]'>
            <div className='w-full tablet:px-1 tablet:py-2 flex'>
              <ToolTip content={<p>{product.title}</p>}>
                <p className='text-[13px] tablet:text-[22px] font-[500]'>
                  {product.title}
                </p>
              </ToolTip>
            </div>
            {/* product price */}
            <div className='w-full tablet:px-1 tablet:py-2 flex flex-col'>
              <p
                className={`text-xs tablet:text-lg ${
                  product.discount
                    ? 'line-through italic opacity-80 font-[500]'
                    : 'font-[700]'
                }`}>
                {toReadablePrice(product.price)}
              </p>
              {product.discount && (
                <p className='text-xs tablet:text-lg font-[700] text-primary'>
                  {toReadablePrice(
                    Math.round(
                      product.price - (product.price * product.discount) / 100
                    )
                  )}{' '}
                </p>
              )}
            </div>
          </div>

          {/* add to cart */}
          <div className='w-full flex flex-col gap-12 items-center justify-center px-[16px]'>
            {/* quantity buttons */}
            <div
              className={`w-full flex flex-col gap-2 ${
                product.stock <= 0 && 'opacity-65 pointer-events-none'
              }`}>
              <div className='flex-1 flex'>
                <h2 className='w-full text-lg font-[700] text-right'>
                  الكمية
                </h2>
              </div>
              <div className='w-full flex'>
                {/* increase */}
                <button
                  onClick={increaseQuantity}
                  disabled={quantity >= product.stock}
                  className={`flex w-[70px] h-[58px] items-center justify-center border-2 rounded-lg cursor-pointer disabled:cursor-not-allowed bg-white hover:bg-primary-dark hover:text-white transition-colors duration-300 ease-in-out group ${
                    quantity >= product.stock
                      ? 'opacity-50 cursor-not-allowed'
                      : 'cursor-pointer'
                  }"`}>
                  <Plus
                    size={30}
                    fontWeight={700}
                    className='group-hover:animate-ping'
                    style={{ animationDuration: '0.5s' }}
                  />
                </button>

                {/* amount */}
                <div className='flex w-[70px] h-[58px] items-center justify-center border-0 rounded-lg'>
                  <p className='text-[18px] font-[500]'>{quantity}</p>
                </div>

                {/* decrease  */}
                <button
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  className={`flex w-[70px] h-[58px] items-center justify-center border-2 rounded-lg cursor-pointer disabled:cursor-not-allowed bg-white hover:bg-primary-dark hover:text-white transition-colors duration-300 ease-in-out group ${
                    quantity <= 1
                      ? 'opacity-50 cursor-not-allowed pointer-events-none'
                      : 'cursor-pointer'
                  }`}>
                  <Minus
                    size={30}
                    fontWeight={700}
                    className='group-hover:animate-ping'
                    style={{ animationDuration: '0.5s' }}
                  />
                </button>
              </div>
            </div>

            {/* add to cart */}
            <div className='relative w-full flex flex-col tablet:flex-row justify-start items-center'>
              {product.stock > 0 ? (
                <ButtonPrimary
                  className=' h-[56px] text-[13px] tablet:text-[18px] tablet:w-[168px] font-[600]'
                  preloader
                  handleClick={addToCart}>
                  أضف للسلة
                </ButtonPrimary>
              ) : (
                <div className='w-full max-w-[230px] text-primary-dark bg-surface text-[14px] tablet:text-[16px] laptop:text-[20px] text-center font-[600] p-1 rounded-tl-xl rounded-br-xl border-2 border-primary-dark py-3 px-4'>
                  غير متوفر
                </div>
              )}

              {addedToCart ? (
                <div className='w-[200px] bg-transparent rounded-lg p-2 flex items-center justify-center gap-2 animate-enterFromRightAndExitToLeft'>
                  <CheckCircle
                    size={24}
                    color='#02C3F9'
                  />
                  <span className='text-center text-[12px] tablet:text-[16px] text-primary font-[500]'>
                    تم الإضافة للسلة
                  </span>
                </div>
              ) : (
                <div className='w-[200px] min-h-[42px] bg-transparent rounded-lg p-2 flex items-center justify-center gap-2'>
                  <span className=''></span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* product details */}
        <section className='w-full max-w-[860px] flex flex-col gap-8 px-4 mb-8'>
          {/* description */}
          <div className='w-full flex flex-col gap-4'>
            <h2 className='w-full text-right text-lg font-[700] tablet:text-2xl'>
              وصف المنتج
            </h2>
            <RenderMarkdown page={product.description} />
          </div>

          {/* specification */}
          <div className='w-full flex flex-col gap-4'>
            <h2 className='w-full text-right text-lg font-[700] tablet:text-2xl'>
              مواصفات المنتج
            </h2>
            <div className='w-full flex gap-1'>
              <p className='text-[13px] tablet:text-lg font-[600]'>
                العلامة التجارية:
              </p>
              <p className='text-[13px] tablet:text-lg font-[400] opacity-85'>
                {' '}
                {product.brand?.name}
              </p>
            </div>
            <div className='w-full flex gap-1'>
              <p className='text-[13px] tablet:text-lg font-[600]'>الوزن:</p>
              <p className='text-[13px] tablet:text-lg font-[400]'>
                {' '}
                {product.weight.value} {product.weight.unit}
              </p>
            </div>
            {product.color_grade && (
              <div className='w-full flex gap-1'>
                <p className='text-[13px] tablet:text-lg font-[600]'>
                  درجة اللون:
                </p>
                <p className='text-[13px] tablet:text-lg font-[400]'>
                  {' '}
                  {product.color_grade}
                </p>
              </div>
            )}
          </div>

          {/* features */}
          {product.features && (
            <div className='w-full flex flex-col gap-4'>
              <h2 className='w-full text-right text-lg tablet:text-2xl font-[700]'>
                مميزات المنتج
              </h2>
              <RenderMarkdown page={product.features} />
            </div>
          )}

          {/* usage */}
          {product.usage && (
            <div className='w-full flex flex-col gap-4'>
              <h2 className='w-full text-right text-lg font-[700] tablet:text-2xl'>
                طريقة الاستخدام
              </h2>
              <RenderMarkdown page={product.usage} />
            </div>
          )}
        </section>

        {/* product reviews */}
        <section className='w-full max-w-[860px] flex flex-col gap-8 px-4 mb-8 tablet:mb-12 laptop:mb-20'>
          <div className='flex flex-col gap-2'>
            <h2 className='w-full text-right text-lg font-[700] tablet:text-2xl'>
              تقييمات المنتج
            </h2>
            {productReviews.length > 0 ? (
              <div className='w-full flex'>
                <div className='w-fit flex gap-4'>
                  {/* total rate */}
                  <p
                    dir='ltr'
                    className='w-full text-[13px] font-[500]'>
                    {totalRate} / 5.0
                  </p>
                  {/* stars icons */}
                  <ProductRate starsNumber={totalRate} />
                </div>
              </div>
            ) : (
              <div className='w-full flex flex-col p-0 m-0 text-right text-[15px] font-[500]'>
                لا توجد تقييمات لهذا المنتج
              </div>
            )}
          </div>

          {/* review form */}
          <div className='w-full mt-8 flex flex-col gap-6'>
            {/* input */}
            <div className='w-full flex flex-col gap-3 items-center justify-center'>
              {/* should add the stars rating here */}
              <SetProductRates
                setRate={setRate}
                currentRate={rate}
              />
              <textarea
                className='w-full h-[138px] px-6 py-4 text-[13px] font-[400] border-1 border-white rounded-[12px] bg-surface'
                placeholder='شاركينا تجربتك مع المنتج'
                onChange={(e) => setReview(e.target.value)}
                value={review}
                dir='rtl'
              />
            </div>
            {/* submit */}
            <div className='flex flex-col w-full items-center justify-center'>
              <AlertDialogElement
                header='خطأ'
                cancel='إغلاق'
                open={errorOpen}
                body={error}>
                <div></div>
              </AlertDialogElement>
              <ButtonPrimary handleClick={sendReview}>
                شاركي تقييمك
              </ButtonPrimary>
            </div>
          </div>

          {/* users reviews */}
          <div className='w-full mt-8 flex flex-col gap-4 items-center justify-center'>
            {productReviews.map((review) => (
              <ProductReview
                review={review}
                key={review.documentId}
              />
            ))}
          </div>
        </section>

        {/* related products */}
        <section className='w-full flex flex-col items-center justify-center gap-4 mb-8 tablet:mb-12 laptop:mb-20 overflow-auto'>
          <h2 className='w-full  px-3  text-right text-lg font-[700] tablet:text-2xl'>
            منتجات ذات صلة
          </h2>
          <div
            className='w-full relative min-h-[408px] tablet:min-h-[526px] flex laptop:px-[36px] gap-4 mt-6 tablet:mt-10 overflow-hidden'
            dir='ltr'>
            <ProductsCarousel
              productsType='similar'
              productId={product.documentId}
              categories={product.categories.map((cate) => cate.title)}
              brand={product.brand?.name}
            />
          </div>
        </section>
      </div>
    </>
  );
}

export default ProductPageComponent;
