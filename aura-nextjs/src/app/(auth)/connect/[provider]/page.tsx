import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { signinProvider } from '@/utils/services/auth-service';
import { ButtonPrimary, ButtonSecondary } from '@/components/common/Buttons';

const ERROR_MESSAGES: Record<string, string> = {
  default: 'حدث خطأ ما, الرجاء المحاوله مره اخرى',
  unauthorized: 'غير مصرح للوصول لهذه الصفحة',
  email_taken:
    'البريد الإلكتروني مستخدم بالفعل, الرجاء تسجيل الدخول او استخدام بريد إلكتروني آخر',
};

async function ProviderRedirectPage({
  params,
  searchParams,
}: {
  params: Promise<{ provider: string }>;
  searchParams: Promise<{ access_token: string }>;
}) {
  const { provider } = await params;
  // console.log({ provider });
  const { access_token } = await searchParams;
  const { error, data } = await signinProvider(
    provider,
    access_token as string
  );

  if (error) {
    // console.log('Error from ProviderRedirectPage:', error);
    const errorData = error.error;
    return (
      <div className='w-full min-h-full flex flex-col items-center justify-center'>
        <div className='w-full max-w-[460px] min-h-[320px] rounded-2xl py-10 px-4 flex flex-col items-center justify-center gap-4 drop-shadow-lg bg-white'>
          <p className='text-2xl text-foreground/80 text-center mb-4'>
            {ERROR_MESSAGES[errorData.message] || ERROR_MESSAGES.default}
          </p>
          {errorData.status >= 500 ? (
            <>
              <Link
                href={'/login'}
                className='text-xl text-background/80 text-center'>
                <ButtonSecondary>المحاولة مرة أخرى</ButtonSecondary>
              </Link>
              <span>أو</span>
            </>
          ) : null}
          <Link
            href={'/login'}
            className='text-xl text-background/80 text-center'>
            <ButtonPrimary>تسجيل الدخول</ButtonPrimary>
          </Link>
        </div>
      </div>
    );
  }
  // console.log('\nuser data', JSON.stringify(data, null, 2));
  redirect(`/connect?data=${JSON.stringify(data)}`);
}

export default ProviderRedirectPage;
