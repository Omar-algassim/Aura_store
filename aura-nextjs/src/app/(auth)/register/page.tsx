'use client';
import ProviderSigninButton from '@/components/common/ProviderSigninButton'
import { SignupForm } from '@/components/ui';
import { Button } from '@/components/ui/shadcn/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import { ArrowDownCircle } from 'lucide-react';
import Link from 'next/link';
import React from 'react'

function SignupPage() {
  const [isOpen, setIsOpen] = React.useState('');

  return (
    <div className='w-full max-w-screen-tablet mx-9 py-10 border-none rounded-3xl bg-white flex flex-col items-center gap-8'>
      <div className='w-full text-center text-[17px] text-foreground font-[700] font-alex'>
        إنشاء حساب جديد
      </div>

      {/* providers login */}
      <div className='w-full flex flex-col items-center gap-4'>
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
        
        {/* already have account */}
        <div className='w-full flex  justify-center gap-2'>
          <div className='flex items-center justify-center pt-[1.2px] m-0 h-[24px]'>
            <p className='text-[12px] text-secondary align-center'>لديكي حساب بالفعل ؟</p>
          </div>
          <div className='flex items-center justify-center p-0  m-0 h-[24px]'>
            <Link href={'/login'}
            className='text-primary-dark text-[14px] font-[400] hover:text-primary transition-colors duration-500'>سجلي دخول</Link>
          </div>
        </div>
      </div>
      
      {/* or */}
      <div className='w-full text-center text-[16px] font-[400] font-alex'>
        او سجلي
      {/* show more options [email/password form] */}
      <Tabs dir='rtl' className='overflow-hidden w-full p-4 flex flex-col items-center justify-center'>
        <TabsList className='flex w-full justify-between tablet:justify-center tablet:gap-4'>
          <TabsTrigger className='w-full' value='phone-signup' asChild>
            <Button className='w-[48%] tablet:w-[320px] h-[56px] py-3 px-6 rounded-[12px] bg-surface text-[14px] font-[400] font-alex text-foreground hover:scale-105 active:scale-100 focus:outline-none focus:scale-100 transition-all' onClick={() => setIsOpen('phone-signup')}>
               بإستخدام الهاتف
              {isOpen === 'phone-signup'
                ?<ArrowDownCircle size={24} className='mr-1 transition-all' />
                : <ArrowDownCircle size={24} className='mr-1 transform rotate-180 transition-all' />
              }
            </Button>
          </TabsTrigger>
          <TabsTrigger value='email-signup' asChild>
            <Button className='w-[48%] tablet:w-[320px] h-[56px] py-3 px-6 rounded-[12px] bg-surface text-[14px] font-[400] font-alex text-foreground hover:scale-105 active:scale-100 focus:outline-none focus:scale-100 transition-all' onClick={() => setIsOpen('email-signup')}>
               بإستخدام الإيميل
              {isOpen === 'email-signup'
                ?<ArrowDownCircle size={24} className='mr-1 transition-all' />
                : <ArrowDownCircle size={24} className='mr-1 transform rotate-180 transition-all' />
              }
            </Button>
          </TabsTrigger>
        </TabsList>
        <TabsContent value='phone-signup' className='w-full'>
          <SignupForm type="phone"/>
        </TabsContent>
        <TabsContent value='email-signup' className='w-full'>
          <SignupForm type="email" />
        </TabsContent>
      </Tabs>
      </div>

    </div>
  )
}

export default SignupPage;