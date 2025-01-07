'use client';
import React from 'react'
import { ButtonPrimary, ButtonSecondary } from '@/components/common/Buttons'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/shadcn/input-otp';

function ConfirmPhonePage() {

  const [code, setCode] = React.useState('')


  const handleSubmit = () => {
    //console.log('submitting code', code);
    setCode('');
  }

  return (
    <div className='flex flex-col w-[364px] tablet:w-full tablet:max-w-[880px] border-none rounded-3xl pt-10 pb-6 px-6 gap-8 tablet:mt-20 bg-white justify-center items-center'>
      <div className='w-full flex items-center justify-center'>
        <h1 className='w-full text-center text-lg tablet:text-3xl font-[700]'>تأكيد رقم الهاتف</h1>
      </div>

      <div className='w-full flex flex-col gap-3 items-center justify-center'>
        <p className='w-full text-center text-[14px] tablet:text-[24px] font-[500] tablet:font-[400] font-alex'>
          لقد تم إرسال رمز مكون من 4 أرقام إلى رقمك  <span className='font-[700]'>249xxxxxxxxx+</span> يرجى إدخال الرمز ادناه
        </p>

        <InputOTP
          dir='ltr'
          maxLength={4}
          value={code}
          onChange={(value) => setCode(value)}
        >
          <InputOTPGroup dir='ltr' className='w-full gap-4'>
            <InputOTPSlot className='w-[52px] h-[52px] rounded-[3px] bg-surface border-none text-2xl  ' index={0} />
            <InputOTPSlot className='w-[52px] h-[52px] rounded-[3px] bg-surface border-none text-2xl  ' index={1} />
            <InputOTPSlot className='w-[52px] h-[52px] rounded-[3px] bg-surface border-none text-2xl  ' index={2} />
            <InputOTPSlot className='w-[52px] h-[52px] rounded-[3px] bg-surface border-none text-2xl  ' index={3} />
          </InputOTPGroup>
        </InputOTP>

      </div>

      <div className='w-full flex flex-col items-center justify-center space-y-2'>
        <ButtonSecondary className='bg-white border-none hover:bg-white hover:text-primary-dark active:bg-white active:text-primary-dark focus:outline-none focus:bg-white focus:text-primary-dark'>
          إعادة إرسال الرمز
        </ButtonSecondary>

        <ButtonPrimary disabled={code.length !== 4} handleClick={handleSubmit}>
          إنشاء الحساب
        </ButtonPrimary>
      </div>
    </div>
  )
}

export default ConfirmPhonePage