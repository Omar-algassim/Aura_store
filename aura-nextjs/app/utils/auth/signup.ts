'use client';
import { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import axios from 'axios';
import {backendConstants} from '@/app/(constants)/backend-constants';
import {FormState, signUpValidator} from '@/app/utils/definitions/formValidator';
import createSession from './create-session';


/**
 * 
 * @param formState The last state of the form, currently unused
 * @param formData The data of the form, which is a FormData object
 * @returns Promise<{errors: object} The error object if there is an error, or redirect to the home page if the sign up is successful
 */
export default async function signUp (formState: FormState, formData: FormData){
  const baseUrl = backendConstants.baseUrl;
  const signUpUrl = `${baseUrl}/auth/local/register`;

  // alert(`${formData.get('email')}\n ${formData.get('phone_number')}\n ${formData.get('full_name')} \n  ${formData.get('password')}`);

  const validatedForm = signUpValidator.safeParse({
    email: formData.get('email') as string,
    phone_number: formData.get('phone_number') as string,
    full_name: formData.get('full_name') as string,
    password: formData.get('password') as string,
  });

  if (!validatedForm.success) {
    // alert('Validation failed');
    return {errors: validatedForm.error.flatten().fieldErrors};
  }

  try {
    const result = await axios.post(signUpUrl, {
      email: validatedForm.data.email,
      phone_number: validatedForm.data.phone_number,
      username: validatedForm.data.full_name,
      password: validatedForm.data.password,
    });
    if (result.status === 200) {
       createSession(result.data.jwt, result.data.user);
      redirect('/');
    } else {
      throw new Error('An error occurred');
    }
  } catch (error) {
    // alert(`${error.message}\n${error.stack}`);
    
    return {error:
      {signupFailed: 
        { message: 'حدث خطأ ما, الرجاء المحاولة مرة أخرى'}
      }
    };
  }
}

/**
 * 
 */