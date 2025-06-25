"use client";
import { CartForm } from "@/components/ui";
import { useCart } from "@/components/context";
import { CartEntity } from "@/entities/cart-entity";
import AlertDialogElement from "@/components/common/alert-dialog";
import { CopyCheck, CopyIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function CheckoutPage() {
  const cart = useCart() as CartEntity;
  const router = useRouter();
   
  const [error, setError] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const total = cart?.total_pay ? 3000 + cart?.total_pay : 3000;

  const copyBankNum = async () => {
    try {
      await navigator.clipboard.writeText("2006899");
      setCopied(true);
    } catch {
      // setCopied(false);
      setError("حدث خطأ أثناء نسخ رقم الحساب");
    }
  };

  useEffect(() => {
    if (!cart || cart?.total_items === 0) {
      router.push("/cart");
    }
  }, []);

  return (
    <div className=" w-full max-w-[760px] flex flex-col items-center justify-center gap-5 mt-8 overflow-x-hidden">
      {/* cart form */}
      <strong className="self-start px-4">عنوان التوصيل</strong>
      <CartForm onError={setError}>
        <div className="w-full  flex flex-col items-start justify-between gap-5">
          <strong>تفاصيل الفاتورة</strong>
          {/* container of prices and titles */}
          <div className="flex flex-col justify-between max-w-[500px]">
            {/* title of price */}
            <div className="flex gap-3 tablet:gap-5">
              <p className="flex-1 text-sm tablet:text-lg">{`المجموع الفرعي ( ${cart?.total_items} منتجات)`}</p>
              <strong className="p-0 text-sm tablet:text-lg text-left">
                {`${Math.floor(cart?.total_pay)}`} SDG
              </strong>
            </div>
            {/* prices */}
            <div className="flex gap-3 tablet:gap-5">
              <p className="flex-1 text-sm tablet:text-lg">رسوم التوصيل</p>
              <strong className="p-0 text-sm tablet:text-lg text-left">
                SDG 3000
              </strong>
            </div>
            <div className="flex gap-3 tablet:gap-5">
              <p className="flex-1 text-sm tablet:text-lg">المجموع</p>
              <strong className="p-0 text-sm tablet:text-lg text-left">
                {Math.round(total)} SDG
              </strong>
            </div>
          </div>
        </div>
        <div className="w-full  bg-surface rounded-xl flex flex-col items-start justify-between px-4 py-12 gap-5">
          <strong>إتمام الدفع</strong>
          <p className="text-sm md:text-xl font-[500] capitalize">
            يمكنكي اتمام عملية الدفع عبر تطبيق بنكك ورفع الاشعار المالي في
            الموقع
          </p>
          <p className="text-sm md:text-xl font-[500] capitalize">
            او راسلينا على واتساب لمساعدتك في إتمام عملية الدفع +2499Xxxxxxx
          </p>
        </div>
        <div className="flex  flex-col tablet:mx-2 bg-white rounded-lg items-center justify-center gap-12 w-full max-w-[640px] ">
          <div className="w-full max-w-[640px] flex flex-col items-center justify-center gap-3 tablet:gap-4">
            <p className="text-center text-lg md:text-xl">رقم الحساب</p>
            <div className="w-full max-w-[220px] flex items-center justify-between">
              {copied ? (
                <CopyCheck size={24} color="#24A148" />
              ) : (
                <CopyIcon
                  className="cursor-pointer"
                  size={24}
                  color="#202020"
                  onClick={copyBankNum}
                />
              )}
              <span className="text-sm md:text-lg text-[#202020] font-[500] uppercase">
                2006899
              </span>
            </div>
          </div>
        </div>
      </CartForm>

      {error && (
        <AlertDialogElement open>
          <div className="" >
            <h2 className="text-lg font-semibold">خطأ</h2>
            <p className="text-sm text-red-600">{error}</p> 
          </div>
        </AlertDialogElement>
      )}
    </div>
  );
}

export default CheckoutPage;
