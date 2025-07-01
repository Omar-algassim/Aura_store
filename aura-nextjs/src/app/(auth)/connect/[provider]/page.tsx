import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { signinProvider } from '@/utils/services/auth-service';
import { ButtonPrimary } from '@/components/common/Buttons';

const ERROR_MESSAGE: Record<string, string> = {
  timeout: 'حصل خطأ في الاتصال, الرجاء المحاولة مرة أخرى لاحقاً',
  email_taken:
    'البريد الإلكتروني مستخدم بالفعل, يمكنك تسجيل الدخول أو استخدام بريد إلكتروني آخر',
  server: 'حدث خطأ ما, الرجاء المحاولة مرة أخرى لاحقاً',
};
async function ProviderRedirectPage({
  params,
  searchParams,
}: {
  params: Promise<{ provider: string }>;
  searchParams: Promise<{ access_token: string }>;
}) {
  const { provider } = await params;
  // // /console.log({provider});
  const { access_token } = await searchParams;
  const { error, data } = await signinProvider(
    provider,
    access_token as string
  );

  if (error) {
    console.error(error);
    return (
      <div className='w-full min-h-full flex flex-col items-center justify-center'>
        <div className='w-full max-w-[460px] min-h-[320px] rounded-2xl py-10 px-4 flex flex-col items-center justify-center gap-4 drop-shadow-lg bg-white'>
          <p className='text-2xl text-foreground/80 text-center mb-4'>
            {ERROR_MESSAGE[error.message] || ERROR_MESSAGE.server}
          </p>
          او
          <ButtonPrimary>
            <Link
              href={'/login'}
              className='text-xl text-background/80 text-center'>
              تسجيل الدخول
            </Link>
          </ButtonPrimary>
        </div>
      </div>
    );
  }
  console.log('\nuser data', JSON.stringify(data, null, 2));
  redirect(`/connect?data=${JSON.stringify(data)}`);

  return provider === 'google' ? (
    <div>Redirecting to Google...</div>
  ) : (
    <div>Redirecting to Facebook...</div>
  );
}

export default ProviderRedirectPage;
