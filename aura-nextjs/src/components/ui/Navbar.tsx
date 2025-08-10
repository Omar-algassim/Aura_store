'use client';
import React, { useState } from 'react';
import { ButtonPrimary } from '../common/Buttons';
import { ButtonSecondary } from '../common/Buttons';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  useUser,
  useUserDispatch,
  useCartDispatcher,
  useCart,
} from '@/components/context';
import { CartEntity } from '@/entities/cart-entity';
import AlertDialogElement from '../common/alert-dialog';
import { whatsappMessage, whatsappPhone } from '@/constants/app-constants';
import {
  InfoIcon,
  UserCircleIcon,
  CartIcon,
  WhatsAppIcon,
} from '@/components/icons';
import { useSettings } from '../context/SettingsContext';

const ICONS = {
  info: InfoIcon,
  profile: UserCircleIcon,
  products: CartIcon,
  whatsapp: WhatsAppIcon,
};

interface NavElementProps {
  name: string;
  link: string;
  icon?: 'info' | 'profile' | 'products' | 'whatsapp';
}

const alertProps = {
  header: 'تسجيل خروج',
  body: 'هل تريد تسجيل الخروج؟',
  action_text: 'تأكيد',
  cancel: 'إلغاء',
};

/**
 *
 * @param props to take a icon beside the element and name of the element
 * @returns
 */
function NavElement(props: NavElementProps) {
  const IconComponent = props.icon ? ICONS[props.icon] : null;
  return (
    <Link
      href={props.link}
      target={props.icon === 'whatsapp' ? '_blank' : '_self'}
      rel={props.icon === 'whatsapp' ? 'noopener noreferrer' : undefined}
      className='group flex items-center justify-center gap-1 hover:bg-primary-dark hover:text-white active:bg-primary-dark
          active:text-white focus:outline-none focus:bg-primary-dark w-[180px]
          focus:text-white rounded-[12px] py-[12px] px-4 cursor-pointer'>
      {/*the icon beside the element if exist */}
      {IconComponent && (
        <IconComponent className='h-5 w-5 text-foreground group-hover:text-white group-active:text-white' />
      )}
      {/* the link element navigation to  */}
      <h4 className='flex-1'>{props.name}</h4>
    </Link>
  );
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { settings } = useSettings();
  const user = useUser();
  const userDispatcher = useUserDispatch();
  const cartDispatcher = useCartDispatcher();
  const cart = useCart() as CartEntity;
  const router = useRouter();

  function toggleMenu() {
    setIsOpen(!isOpen);
  }

  function logout() {
    if (user.documentId) {
      console.log('logout');
      userDispatcher({ type: 'LOGOUT', payload: {} });
      cartDispatcher({ type: 'DELETE', payload: { cart } });
      router.push('/');
    } else {
      router.push('/login');
    }
  }

  return (
    <div className='flex z-40 flex-col items-start'>
      <div>
        {/* humberger  */}
        <div className='relative z-10 tablet:max-w-[56px] tablet:max-h-[56px] max-w-[32px] max-h-[32px] cursor-pointer hover:rotate-12 focus:outline-none transition-all duration-200 ease-in-out'>
          <Image
            width={32}
            height={32}
            src='/icons/menu.svg'
            alt='navbar menu'
            onClick={toggleMenu}
          />
        </div>
        <div
          className={`items-center max-w-[393px] max-h-[506px] text-xs rounded-xl absolute ${
            isOpen ? 'flex-col animate-scaleIn' : 'hidden animate-scaleOut'
          } ease-in-out duration-300 bg-white z-10`}>
          <div className='flex flex-col w-full justify-between py-[64px] px-[24px] items-center text-center relative rounded-xl'>
            <Image
              src='/icons/close.svg'
              alt='exit'
              onClick={toggleMenu}
              className='w-[32px] h-[32px] cursor-pointer absolute left-[24px] top-[15px]'
              width={32}
              height={32}
            />
            <div
              className={`flex flex-col items-center justify-between w-[158px] text-xs space-y-5`}>
              {user.documentId ? (
                <AlertDialogElement
                  onClick={toggleMenu}
                  action={logout}
                  header={alertProps.header}
                  body={alertProps.body}
                  cancel='إلغاء'
                  action_text={alertProps.action_text}>
                  <button
                    className='button-primary w-full max-w-[320px] h-14 rounded-[12px] flex
                    items-center bg-primary text-white
      justify-center gap-2 hover:bg-primary-dark hover:text-white active:bg-primary-dark active:text-white focus:outline-none focus:bg-primary-dark focus:text-white cursor-pointer transition-all duration-300'>
                    تسجيل خروج
                  </button>
                </AlertDialogElement>
              ) : (
                <>
                  <ButtonPrimary
                    handleClick={() => router.push('/register')}
                    className={`text-xs p-2 tablet:hidden`}>
                    إنشاء حساب
                  </ButtonPrimary>
                  <ButtonSecondary
                    handleClick={logout}
                    className='text-xs p-2'>
                    تسجيل دخول
                  </ButtonSecondary>
                </>
              )}
            </div>
            <ul className='flex flex-col justify-between pt-[40px] px-6'>
              <li>
                <NavElement
                  link='/products'
                  name='جميع المنتجات'
                  icon='products'
                />
              </li>
              <li>
                <NavElement
                  link={`https://wa.me/${
                    settings.whatsapp_phone || whatsappPhone
                  }?text=${settings.whatsapp_message || whatsappMessage}`}
                  name='تواصل معنا'
                  icon='whatsapp'
                />
              </li>
              <li>
                <NavElement
                  link='/aura/about-aura'
                  name='نبذة عن Aura'
                  icon='info'
                />
              </li>
              <li>
                <NavElement
                  link='/profile'
                  name='الملف الشخصي'
                  icon='profile'
                />
              </li>
            </ul>
          </div>
        </div>
      </div>
      {isOpen && (
        <div
          onClick={toggleMenu}
          className='fixed inset-0 bg-black/50 z-0 w-full h-full'></div>
      )}
    </div>
  );
}
