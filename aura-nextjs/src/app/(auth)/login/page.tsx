'use client';
import ProviderSigninButton from '@/components/common/ProviderSigninButton';
import { LoginForm } from '@/components/ui';
import ForgetPwdModal from '@/components/ui/modals/ForgetPwdModal';
import { Preloader } from '@/components/ui/Preloader';
import { Button } from '@/components/ui/shadcn/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/shadcn/tabs';
import { useToast } from '@/hooks/use-toast';
import { Mail, Phone } from 'lucide-react';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { Suspense, useEffect } from 'react';

const URL_MSGS: Record<string, string> = {
  'account-confirmed': 'تم تأكيد الحساب بنجاح يمكنك الآن تسجيل الدخول.',
};

function Login() {
  const searchParams = useSearchParams();
  const msg = searchParams.get('msg');
  const msgType = searchParams.get('msg-type');
  const [isOpen, setIsOpen] = React.useState('phone-signup');
  const [showForgetPwd, setShowForgetPwd] = React.useState(false);
  const { toast } = useToast();

  useEffect(() => {
    window.addEventListener('click', (e) => {
      if (
        showForgetPwd &&
        e.target === document.querySelector('#pwd-reset-modal')
      ) {
        setShowForgetPwd(false);
      }
    });
    window.addEventListener('keydown', (e) => {
      if (showForgetPwd && e.key === 'Escape') {
        setShowForgetPwd(false);
      }
    });

    return () => {
      window.removeEventListener('click', (e) => {
        if (
          showForgetPwd &&
          e.target === document.querySelector('pwd-reset-modal')
        ) {
          setShowForgetPwd(false);
        }
      });
      window.removeEventListener('keydown', (e) => {
        if (showForgetPwd && e.key === 'Escape') {
          setShowForgetPwd(false);
        }
      });
    };
  });

  useEffect(() => {
    if (msg) {
      toast({
        variant: msgType === 'error' ? 'destructive' : 'success',
        title: 'تنبيه',
        description: URL_MSGS[msg] || msg,
      });
    }
  }, [msg, msgType, toast]);

  return (
    <div className='w-full max-w-(--breakpoint-tablet) mx-9 py-10 border-none rounded-3xl bg-white flex flex-col items-center gap-8'>
      <div className='w-full text-center text-[17px] text-foreground font-[700] font-alex'>
        تسجيل الدخول
      </div>
      <div className='w-full text-center text-[16px] font-[400] font-alex'>
        {/* show more options [email/password form] */}
        <Tabs
          defaultValue='phone-signup'
          dir='rtl'
          className='overflow-hidden w-full p-4 flex flex-col items-center justify-center'>
          <TabsList className='flex w-full justify-between tablet:justify-center tablet:gap-4'>
            <TabsTrigger
              className='w-full'
              value='phone-signup'
              asChild>
              <Button
                className={`w-[48%] tablet:w-[320px] h-[56px] py-3 px-6 rounded-[12px] text-[14px] font-[400] font-alex text-foreground hover:scale-105 active:scale-100 focus:outline-none focus:scale-100 transition-all ${
                  isOpen === 'phone-signup' ? 'bg-slate-400' : 'bg-surface'
                }`}
                onClick={() => setIsOpen('phone-signup')}>
                بإستخدام الهاتف
                <Phone
                  size={24}
                  className='mr-1 transition-all'
                />
              </Button>
            </TabsTrigger>
            <TabsTrigger
              value='email-signup'
              asChild>
              <Button
                className={`w-[48%] tablet:w-[320px] h-[56px] py-3 px-6 rounded-[12px] text-[14px] font-[400] font-alex text-foreground hover:scale-105 active:scale-100 focus:outline-none focus:scale-100 transition-all active:bg-slate-600 ${
                  isOpen === 'email-signup' ? 'bg-slate-400' : 'bg-surface'
                }`}
                onClick={() => setIsOpen('email-signup')}>
                بإستخدام الإيميل
                <Mail
                  size={24}
                  className='mr-1 transition-all'
                />
              </Button>
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value='phone-signup'
            className='w-full'>
            <LoginForm type='phone' />
          </TabsContent>
          <TabsContent
            value='email-signup'
            className='w-full'>
            <LoginForm type='email' />
          </TabsContent>
        </Tabs>
        {/* forget password */}
        <div className=''>
          <button
            onClick={() => setShowForgetPwd(true)}
            className='text-foreground text-[14px] font-[400] hover:opacity-75 focus:outline-none transition-colors duration-500'>
            نسيت كلمة المرور
          </button>
        </div>
        {/* doesn't have account */}
        <div className='w-full flex  justify-center gap-2'>
          <div className='flex items-center justify-center pt-[1.2px] m-0 h-[24px]'>
            <p className='text-[12px] text-secondary align-center'>
              {' '}
              ليس لديكي حساب ؟
            </p>
          </div>
          <div className='flex items-center justify-center p-0  m-0 h-[24px]'>
            <Link
              href={'/register'}
              className='text-primary-dark text-[14px] font-[400] hover:text-primary transition-colors duration-500'>
              {' '}
              انشاء حساب
            </Link>
          </div>
        </div>
      </div>

      {/* providers login */}
      <div className='w-full flex flex-col items-center space-y-4'>
        <div>او</div>
        {/* signin with google component */}
        <ProviderSigninButton
          provider='google'
          title='تسجيل الدخول بحساب جوجل'
          handleClick={() => {}}
        />
        {/* signin with facebook component */}
        <ProviderSigninButton
          provider='facebook'
          title='تسجيل الدخول بحساب فيسبوك'
          handleClick={() => {}}
        />
      </div>
      {/* forget password modal */}
      {showForgetPwd && (
        <ForgetPwdModal closeModal={() => setShowForgetPwd(false)} />
      )}
    </div>
  );
}

function LoginPage() {
  return (
    <Suspense fallback={<Preloader />}>
      <Login />
    </Suspense>
  );
}

export default LoginPage;
