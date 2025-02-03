'use client';
import React from 'react'
import  { CartForm }  from '@/components/ui';
import { useCart } from '@/components/context';

function CheckoutPage() {
  const cart = useCart();
  const total = cart?.total_pay ? 3000 + cart?.total_pay : 3000;
  return (
    <div>
      <strong>عنوان التوصيل</strong>
      <CartForm></CartForm>
      <div className="flex flex-col items-start justify-between p-5 gap-5">
          <strong>تفاصيل الفاتورة</strong>
        {/* container of prices and titles */}
        <div className="flex justify-between w-[500px]">
          {/* title of price */}
          <div className="flex flex-col justify-center gap-5">
            <p>{`المجموع الفرعي ( ${cart?.total_items} منتجات)`  }</p>
            <p>رسوم التوصيل</p>
            <p>المجموع</p>
          </div>
          {/* prices */}
          <div className="flex flex-col justify-center gap-5">
            <strong>{`${Math.floor(cart?.total_pay)}`} SDG</strong>
            <strong>SDG 3000</strong>
            <strong>{total} SDG</strong>
          </div>
        </div>
    </div>
    </div>
  )
}

export default CheckoutPage