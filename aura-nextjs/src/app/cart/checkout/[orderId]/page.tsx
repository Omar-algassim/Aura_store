import Image from "next/image";
import React from "react";

async function ConfirmPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  return (
    <div className=" w-full max-w-[760px] flex flex-col items-center justify-center gap-5 mt-8 overflow-x-hidden">
      <Image
        src={"/images/checked.png"}
        alt="order confirmed"
        width={100}
        height={100}
        className="w-[72px] h-[72px] tablet:w-[120px] tablet:h-[120px]"
      />
      <h3 className="w-full max-w-[182px] text-lg font-[700] text-center">
        تم استلام طلبك بنجاح
      </h3>
      <p className="text-sm w-full max-w-[360px] text-center font-[500]">
        سيقوم فريقنا بالتواصل معك عبر الواتساب لإتمام عملية التوصيل
      </p>
      <div className="w-full max-w-[360px] flex items-center justify-center gap-3">
        <p className="text-sm font-bold">رقم الطلب</p>
        <p className="text-sm font-bold">{orderId}</p>
      </div>
    </div>
  );
}

export default ConfirmPage;
