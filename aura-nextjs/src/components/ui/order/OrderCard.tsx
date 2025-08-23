import { useState } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import Cookies from 'js-cookie';

import { OrderDTO } from '@/interfaces/dto';
import { OrdersPage } from '@/constants/app-constants/localization';
import { BaseUrl } from '@/constants/api-constants';
import { cancelOrder } from '@/utils/services/order-services';
import { useToast } from '@/hooks/use-toast';
import { Button } from '../shadcn/button';
import { Modal } from '../dashboard/ui/modal';
import Label from '../dashboard/form/Label';
import OrderItems from '../dashboard/form/order-items';

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
  const [cartListOpen, setCartListOpen] = useState(false);
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

  function toggleCartListModal() {
    setCartListOpen((prev) => !prev);
  }
  return (
    <div
      className={`relative w-full flex flex-col items-center group gap-8 bg-surface rounded-xl p-5 overflow-hidden ${props.className}`}
      onClick={() => setCardClicked((prev) => !prev)}>
      {/* order num and order status */}
      <div className='w-full flex justify-between items-center flex-wrap-reverse gap-y-3'>
        <p className='flex-2/3 text-sm font-[500] capitalize text-[#202020]'>
          رقم الطلب: {props.order.documentId}
        </p>
        <div className='relatives flex-1/3 flex flex-col items-end justify-end gap-3'>
          <p
            className={`text-sm text-end font-bold capitalize px-1`}
            style={{
              color: STATUS_COLORS[props.order.order_status],
            }}>
            {OrdersPage.orderStatuses[props.order.order_status]}
          </p>
          <Button
            variant='link'
            onClick={toggleCartListModal}
            className='text-xs text-primary-dark max-w-fit border self-end'>
            تفاصيل الطلب
          </Button>

          {/* cancel button */}
          {props.order.order_status === 'pending' ? (
            <div
              className={clsx(
                `absolute group-hover:bottom-12 group-active:bottom-12 left-4 transition-all duration-300 ease-in-out`,
                cardClicked ? 'bottom-12' : '-bottom-100'
              )}>
              <Button
                variant='link'
                onClick={handleOrderCancel}
                className='text-surface bg-primary-dark hover:bg-primary-dark/90 active:bg-primary-dark/80 px-3 py-1 rounded-md text-sm'
                type='button'
                disabled={props.order.order_status !== 'pending'}>
                إلغاء الطلب
              </Button>
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
      <Modal
        isOpen={cartListOpen}
        onClose={() => toggleCartListModal()}
        className='max-w-[700px] max-h-[600px] mx-2'>
        <div className='p-4 pb-6 mt-18 flex flex-col gap-4 items-start'>
          <div className='flex gap-2'>
            <Label>المبلغ:</Label>
            <p className='ml-6'>{props.order.total_pay} SDG</p>
          </div>
          <Label>عناصر الطلب:</Label>
          {props.order.order_items.map((item) => (
            <OrderItems
              key={item.documentId}
              product={item.product}
              count={item.count}
            />
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default OrderCard;
