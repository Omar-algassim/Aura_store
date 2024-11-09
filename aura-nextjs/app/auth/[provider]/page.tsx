'use client';
import { useEffect, useState } from 'react';
import { NextRequest } from 'next/server';

import { backendConstants } from '@/app/(constants)/backend-constants';
import axios from 'axios';
import { redirect, useParams } from 'next/navigation';


function LoginProvider(params:Promise<{ slug: string }>) {

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const provider = 'google';
  // const accessToken = req.nextUrl.searchParams.get('id_token');
  // const {id_token} = useParams();
  const callbackUrl = backendConstants.googleCallbackUrl;

  useEffect(() => {
    const loginHandler = async () => {
      const id_token = location.search;
      // console.log(id_token);
      if (provider === 'google' && id_token) {
        // Handle login with Google
        try {
          const result = await axios.get(`${callbackUrl}${id_token}`);
          // alert(result);
          if (result.status === 200) {
            localStorage.setItem('jwt', result.data.jwt);
            localStorage.setItem('user', JSON.stringify(result.data.user));
         } else {
            // console.log(result);
            throw new Error('An error occurred');
         }
        } catch(error: any) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      }
    };
    loginHandler();
  }, []);

  if (!loading && error.length > 0) {
    return <div>{error}</div>;
  } else if (!loading && error.length === 0) {
    redirect('/');
  }
  return <div>Logging in...</div>; // return a loading spinner
}

export default LoginProvider;
