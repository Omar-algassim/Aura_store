import {
  facebook,
  instagram,
  whatsapp,
  whatsappMessage,
} from "@/constants/app-constants";
import { Copyright, HeartHandshake } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative bottom-0 mt-12 p-12 tablet:p-14 w-full min-w-full h-[476px] tablet:h-[336px] flex flex-col items-center justify-center bg-foreground text-white gap-10">
      <div className="w-full flex flex-col tablet:flex-row tablet:gap-x-4 items-center justify-center mt-16 tablet:mt-0 space-y-10 tablet:space-y-0">
        <Link
          href={`https://wa.me/201507023464?text=${whatsappMessage}`}
          className="text-white text-center text-[16px] font-[500]"
        >
          تواصل معنا
        </Link>

        <Link
          href="/aura/exchange-return"
          className="text-white text-center text-[16px] font-[500]"
        >
          سياسة الاستبدال والاسترجاع
        </Link>

        <Link
          href="/aura/privacy-policy"
          className="text-white text-center text-[16px] font-[500]"
        >
          سياسة الخصوصية
        </Link>

        <Link
          href="/aura/about-aura"
          className="text-white text-center text-[16px] font-[500]"
        >
          الشروط والاحكام
        </Link>
      </div>
      {/* social media icons */}
      <div className="w-full flex items-center justify-center gap-8">
        <Link href="#" className="w-10 h-10 flex items-center justify-center">
          <Image
            src={instagram}
            alt="Aura Instagram Link"
            width={32}
            height={32}
            className="object-contain"
          />
        </Link>

        <Link href="#" className="w-10 h-10 flex items-center justify-center">
          <Image
            src={facebook}
            alt="Aura facebook Link"
            width={32}
            height={32}
            className="object-contain"
          />
        </Link>

        <Link
          href={`https://wa.me/201507023464?text=${whatsappMessage}`}
          className="w-10 h-10 flex items-center justify-center"
        >
          <Image
            src={whatsapp}
            alt="Aura Whatsapp Link"
            width={32}
            height={32}
            className="object-contain cursor-pointer"
          />
        </Link>
      </div>
      {/* trade mark */}
      <div className="w-full flex items-center justify-center gap-2">
        <p className="text-white text-center text-[16px] font-[500] flex">
          جميع الحقوق محفوظة لشركة اورا 2024
          <Copyright color="#f2f2f2" width={14} height={14} />
        </p>
      </div>

      {/* our mark */}
      <div className="w-full flex gap-2">
        <p className="text-xs opacity-65 w-full flex">
          made with love by Dongol-la
          <HeartHandshake color="#f3f3f3" width={16} height={16} />
        </p>
      </div>
    </footer>
  );
}
