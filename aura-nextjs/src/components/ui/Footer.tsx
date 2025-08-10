'use client';
import {
  facebook,
  instagram,
  whatsapp,
  whatsappMessage,
  whatsappPhone,
} from '@/constants/app-constants';
import { Copyright } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSettings } from '../context/SettingsContext';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { settings } = useSettings();
  return (
    <footer className='relative bottom-0 mt-12 p-12 tablet:p-14 w-full min-w-full h-[476px] tablet:h-[336px] flex flex-col items-center justify-center bg-foreground text-white gap-10'>
      <div className='w-full flex flex-col tablet:flex-row tablet:gap-x-4 items-center justify-center mt-16 tablet:mt-0 space-y-10 tablet:space-y-0'>
        <Link
          href={`https://wa.me/${
            settings.whatsapp_phone || whatsappPhone
          }?text=${settings.whatsapp_message || whatsappMessage}`}
          className='text-white text-center text-[16px] font-[500]'>
          تواصل معنا
        </Link>

        <Link
          href='/aura/exchange-return'
          className='text-white text-center text-[16px] font-[500]'>
          سياسة الاستبدال والاسترجاع
        </Link>

        <Link
          href='/aura/privacy-policy'
          className='text-white text-center text-[16px] font-[500]'>
          سياسة الخصوصية
        </Link>

        <Link
          href='/aura/about-aura'
          className='text-white text-center text-[16px] font-[500]'>
          الشروط والاحكام
        </Link>
      </div>
      {/* social media icons */}
      <div className='w-full flex items-center justify-center gap-8'>
        <Link
          href={
            settings.social_links?.instagram ||
            'https://www.instagram.com/auraglowups/'
          }
          className='w-10 h-10 flex items-center justify-center'>
          <Image
            src={instagram}
            alt='Aura Instagram Link'
            width={32}
            height={32}
            className='object-contain'
          />
        </Link>

        <Link
          href={
            settings.social_links?.facebook ||
            'https://www.facebook.com/AuraGlowUps'
          }
          className='w-10 h-10 flex items-center justify-center'>
          <Image
            src={facebook}
            alt='Aura facebook Link'
            width={32}
            height={32}
            className='object-contain'
          />
        </Link>

        <Link
          href={`https://wa.me/${
            settings.whatsapp_phone || whatsappPhone
          }?text=${settings.whatsapp_message || whatsappMessage}`}
          className='w-10 h-10 flex items-center justify-center'>
          <Image
            src={whatsapp}
            alt='Aura Whatsapp Link'
            width={32}
            height={32}
            className='object-contain cursor-pointer'
          />
        </Link>
      </div>
      {/* trade mark */}
      <div className='w-full flex items-center justify-center gap-2'>
        <p className='text-white text-center text-[16px] font-[500] flex'>
          جميع الحقوق محفوظة لشركة اورا {currentYear}
          <Copyright
            color='#f2f2f2'
            width={14}
            height={14}
          />
        </p>
      </div>
    </footer>
  );
}
