'use client';
import React, { useEffect } from 'react'
import { useUserDispatch } from '@/components/context/UserContext';
import { useRouter, useSearchParams } from 'next/navigation';
import  cookie from "js-cookie";

function Connect() {
  const searchParams = useSearchParams();
  const userDispatcher = useUserDispatch();
  const router = useRouter();
  const data = searchParams.get('data');
  
  useEffect(() => {
    //console.log('data ===> ', data);
    if (!data) {
      router.replace('/login');
      return;
    }
    const nextPage = cookie.get('nextPage');
    userDispatcher({type: 'LOGIN', payload: {userData: JSON.parse(data)}});
    router.replace(nextPage || '/');
  });


  return (
    <div></div>
  )
}

export default Connect