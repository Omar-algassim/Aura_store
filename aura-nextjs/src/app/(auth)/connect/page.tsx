'use client';
import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import cookie from 'js-cookie';

import { useUserDispatch } from '@/components/context/UserContext';

function Connect() {
  const searchParams = useSearchParams();
  const userDispatcher = useUserDispatch();
  const router = useRouter();
  const data = searchParams.get('data');

  useEffect(() => {
    // I think we need to convert it to async function
    //// /console.log('data ===> ', data)
    if (!data) {
      router.replace('/login');
      return;
    }
    const nextPage = cookie.get('nextPage');
    userDispatcher({ type: 'LOGIN', payload: { userData: JSON.parse(data) } });

    router.replace(nextPage || '/');
  }, [data, router, userDispatcher]);

  return <div></div>;
}

export default Connect;
