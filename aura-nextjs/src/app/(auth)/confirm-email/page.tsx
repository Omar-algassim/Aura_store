import { ButtonSecondary } from '@/components/common/Buttons'
import React from 'react'

function ConfirmEmailPage() {
  return (
    <div className='flex flex-col w-[364px] tablet:w-full tablet:max-w-[880px] border-none rounded-3xl pt-10 pb-6 px-6 gap-8 mt-20 bg-white justify-center items-center'>
      <div className='w-full flex items-center justify-center'>
        <h1 className='w-full text-center text-lg tablet:text-3xl font-[700]'>تأكيد البريد الإلكتروني</h1>
      </div>

      <div className='w-full flex items-center justify-center'>
        <p className='w-full text-center text-[14px] tablet:text-[24px] font-[500] tablet:font-[400] font-alex'>
          لقد تم إرسال رابط التحقق إلى بريدك الإلكتروني، يرجى النقر على الرابط لتأكيد تسجيلك
        </p>
      </div>

      <div>
        <ButtonSecondary className='bg-white border-none hover:bg-white hover:text-primary-dark active:bg-white active:text-primary-dark focus:outline-none focus:bg-white focus:text-primary-dark'>
          إعادة إرسال الرابط
        </ButtonSecondary>
      </div>
    </div>
  )
}

export default ConfirmEmailPage