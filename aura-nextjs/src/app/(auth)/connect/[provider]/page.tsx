import { signinProvider } from '@/utils/services/auth-service';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react'

async function ProviderRedirectPage({params, searchParams}: {params: Promise<{provider: string}>, searchParams: Promise<{access_token: string}>}) {

  const { provider } = await params;
  // console.log({provider});
  const {access_token} = await searchParams;
  const {error, data} = await signinProvider(provider, access_token as string);

  if (error) {
    //console.error(JSON.stringify(error, null, 2));
    return <div className='flex flex-col items-center justify-center'>
      <div>حدث خطاء ما, الرجاء المحاولة مرة اخرى</div>
      <Link href={'/login'} className="text-2xl text-primary-dark text-center">تسجيل الدخول</Link>
      </div>
  }
  //console.log('user data', JSON.stringify(data, null, 2));
  redirect(`/connect?data=${JSON.stringify(data)}`);

  return (
    provider === 'google' 
      ? <div>Redirecting to Google...</div>
      : <div>Redirecting to Facebook...</div>
  )
}

export default ProviderRedirectPage