'use client';
import Cookies from 'js-cookie';
import Image from 'next/image';
import { ButtonPrimary, ButtonSecondary } from '@/components/common/Buttons';
import React, { useEffect } from 'react';
import { OrdersPage as OrdersPageLo } from '@/constants/app-constants/localization';
import { OrderCard, OrdersSkelton } from '@/components/ui/order';
import { OrderDTO } from '@/interfaces/dto';
import { useRouter } from 'next/navigation';
import { useUser } from '@/components/context';
import { getUserOrders } from '@/utils/services/order-services';
import AlertDialogElement from '@/components/common/alert-dialog';

const orderStatuses = OrdersPageLo.orderStatuses;

function OrdersPage() {
  const router = useRouter();
  const user = useUser();
  const [orders, setOrders] = React.useState<OrderDTO[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [visibleStatus, setVisibleStatus] = React.useState('الكل');
  const [userOrderStatuses, setUserOrderStatuses] = React.useState<string[]>(
    []
  );
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    // fetch user orders
    const fetchOrders = async () => {
      const jwt = Cookies.get('jwt');
      if (!jwt) {
        setLoading(false);
        return;
      }
      const { error, data } = await getUserOrders(jwt, user.documentId);
      if (error || !data) {
        setError(error || 'حدث خطاء, الرجاء المحاولة مرة اخرى');
        setLoading(false);
        return;
      }
      console.log(data);
      setOrders(data);
      setUserOrderStatuses([
        'الكل',
        ...new Set(data.map((order) => orderStatuses[order.order_status])),
      ]);
      setLoading(false);
    };
    fetchOrders();
  }, [user.documentId]);

  if (!loading && orders.length === 0) {
    // return <EmptyCart />;
    return (
      <div className='flex flex-col items-center justify-center mt-8'>
        <div className='flex flex-col items-center justify-center'>
          <Image
            src='/icons/cart-empty.svg'
            alt='Empty Cart'
            width={64}
            height={64}
          />
          <div className='text-center pt-[24px]'>
            <p>
              <strong>لم يتم تقديم أي طلب حتى الان </strong>
            </p>
            <p className='pt-[16px]'>اكتشفي منتجاتنا وابدئي التسوق الان</p>
          </div>
        </div>
        <ButtonPrimary
          className='w-full max-w-[354px] mt-[50px]'
          handleClick={() => router.push('/products')}>
          إبدئي التسوق
        </ButtonPrimary>
      </div>
    );
  }

  return (
    <section className='w-full max-w-[1480px] px-0 laptop:px-[30px] flex flex-col justify-center tablet:items-center gap-4 mt-20'>
      {/* filters */}
      <div className='w-full self-start tablet:self-center max-w-[680px] flex overflow-x-scroll scroll-m-0 py-3 px-4 items-center gap-4  rounded-xl'>
        {userOrderStatuses.map((status, index) => (
          <ButtonSecondary
            key={index}
            handleClick={() => setVisibleStatus(status)}
            variant='link'
            className={`text-xs max-w-fit h-8 text-foreground px-2 py-2  ${
              visibleStatus === status
                ? 'bg-primary-dark font-semibold text-white'
                : 'bg-surface'
            }`}>
            {status}
          </ButtonSecondary>
        ))}
      </div>
      {/* user orders */}
      <div className='w-full flex flex-col gap-6 justify-center'>
        {loading ? (
          <OrdersSkelton />
        ) : (
          orders
            .filter((order) => {
              if (visibleStatus === 'الكل') {
                return true;
              }
              return orderStatuses[order.order_status] === visibleStatus;
            })
            .map((order, index) => (
              <OrderCard
                key={index}
                order={order}
                className='max-w-[640px] tablet:self-center'
              />
            ))
        )}
      </div>
      {error && (
        <AlertDialogElement
          header='خطاء'
          body={error}
          open={true}>
          <></>
        </AlertDialogElement>
      )}
    </section>
  );
}

export default OrdersPage;
