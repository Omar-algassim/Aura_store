import cookie from "js-cookie";
import Input from '@/components/common/Input';
import { signinAction } from '@/utils/services/auth-service';
import React, { useActionState } from 'react'
import { Preloader } from '../Preloader';
import { ButtonPrimary } from '@/components/common/Buttons';
import { useRouter } from "next/navigation";
import { useUserDispatch } from "@/components/context";

const getError = (error: {message: string, path: string[]}[], key: string) => {
  if (typeof error === 'string') {
    return [];
  }
  return error?.filter((err) => err.path.includes(key)) || [];
}


const initialState = {
  message: '',
  type: '',
  data: null,
  error: [],
};


export function LoginForm() {

  const router = useRouter();
  const userDispatcher = useUserDispatch();
  const [formState, formAction, isPending] = useActionState(signinAction, initialState);
  const providerError = getError(formState.error, 'provider');
  const passwordError = getError(formState.error, 'password');

  const formError = typeof formState.error === 'string' ? formState.error : null;

  if (formState.data) {
    // dispatch user data to global context
    console.log('user data', JSON.stringify(formState.data, null, 2));
    userDispatcher({type: 'LOGIN', payload: {userData: formState.data}});

    //redirect to nextPage
    const nextPage = cookie.get('nextPage') || '/';
    router.replace(nextPage);
  }

  return (
    <form action={formAction} className='w-full flex flex-col space-y-4 mt-6 items-center'>
      {
        formError && <span className='text-primary-dark text-xs text-center font-[400] font-alex w-full text-wrap'>{formError}</span>
      }
      <div className='w-full tablet:max-w-[460px]'>
        <Input name="provider" placeholder='البريد او رقم الهاتف'/>
        {
          providerError.map((error, index) => 
            <span key={index} className='flex-1 text-primary-dark text-xs text-right font-[400] font-alex max-w-[200px] '>{error.message}</span>
            )
        }
      </div>
      <div className='w-full tablet:max-w-[460px]'>
        <Input name="password" type='password' placeholder='كلمة المرور*' />
        {
          passwordError.map((error, index) => 
            <span key={index} className='flex-1 text-primary-dark text-xs text-right font-[400] font-alex max-w-[200px] '>{error.message}</span>
            )
        }
      </div>
      <div className='w-full tablet:max-w-[460px] flex items-center justify-center'>
        <ButtonPrimary className='w-[196px]'>
          تسجيل الدخول
        </ButtonPrimary>
      </div>
      {isPending && <Preloader/>}
    </form>
  )
}
