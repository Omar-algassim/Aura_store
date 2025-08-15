import { useState } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import Cookies from 'js-cookie';

import { OrderDTO } from '@/interfaces/dto';
import { OrdersPage } from '@/constants/app-constants/localization';
import { BaseUrl } from '@/constants/api-constants';
import { ButtonPrimary } from '@/components/common/Buttons';
import { cancelOrder } from '@/utils/services/order-services';
import { useToast } from '@/hooks/use-toast';

const STATUS_COLORS = {
  pending: '#FFA500',
  confirmed: '#05CA',
  preparing: '#8A2BE2',
  onDelivery: '#008080',
  delivered: '#24A148',
  cancelled: '#DC3545',
};

type Props = {
  order: OrderDTO;
  className?: string;
};

const OrderCard = (props: Props) => {
  const [cardClicked, setCardClicked] = useState(false);
  const { toast } = useToast();

  const handleOrderCancel = async () => {
    // Logic to cancel the order
    const jwt = Cookies.get('jwt');
    // console.log('Cancel order clicked');
    if (!jwt || !props.order.documentId) {
      // console.error('JWT token not found or order ID is missing');
      // toast.error('Unauthorized');
      toast({
        variant: 'destructive',
        title: 'Unauthorized',
        description: 'You are not authorized to perform this action.',
      });
      return;
    }
    const { error } = await cancelOrder(jwt, props.order.documentId);
    if (error) {
      // console.error(error);
      // toast.error(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error,
      });
    } else {
      props.order.order_status = 'cancelled'; // Update the order status locally
      // toast.success('تم إلغاء الطلب بنجاح');
      toast({
        variant: 'success',
        title: 'Order updated',
        description: `Order ${props.order.documentId} cancelled successfully.`,
      });
    }
    setCardClicked(false); // Reset the card clicked state
  };
  return (
    <div
      className={`w-full flex flex-col items-center group gap-8 bg-surface rounded-xl p-5 overflow-hidden ${props.className}`}
      onClick={() => setCardClicked((prev) => !prev)}>
      {/* order num and order status */}
      <div className='w-full flex justify-between'>
        <p className='text-sm font-[500] capitalize text-[#202020]'>
          رقم الطلب: {props.order.id}
        </p>
        <div className='relative'>
          <p
            className={`text-sm font-bold capitalize`}
            style={{
              color: STATUS_COLORS[props.order.order_status],
            }}>
            {OrdersPage.orderStatuses[props.order.order_status]}
          </p>
          {/* cancel button */}
          {props.order.order_status === 'pending' ? (
            <div
              className={clsx(
                `absolute group-hover:top-0 group-active:top-0 left-0 transition-all duration-300 ease-in-out`,
                cardClicked ? 'top-0' : '-top-100'
              )}>
              <ButtonPrimary
                handleClick={handleOrderCancel}
                // className='text-sm text-red-500'
                type='button'
                disabled={props.order.order_status !== 'pending'}>
                إلغاء الطلب
              </ButtonPrimary>
            </div>
          ) : null}
        </div>
      </div>

      {/* order items thumbnails and total price */}
      <div className='w-full flex justify-between items-end'>
        {/* first three orders thumbnails */}
        <div className='flex gap-2'>
          {props.order.order_items.slice(0, 3).map((order, index) => (
            <Image
              key={index}
              src={`${BaseUrl}${order.product.thumbnail}`}
              width={80}
              height={120}
              className='w-auto rounded-md tablet:rounded-lg max-h-16 tablet:max-h-20 object-cover object-center text-xs'
              alt={order.product.title}
            />
          ))}
        </div>
        {/* total price */}
        <p className='text-sm capitalize font-[500] text-[#202020]'>
          {props.order.total_pay} SDG
        </p>
      </div>
    </div>
  );
};

export default OrderCard;
