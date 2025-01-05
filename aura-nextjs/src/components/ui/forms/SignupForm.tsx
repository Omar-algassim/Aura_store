import { signupAction } from '@/utils/services/auth-service'
import React, { useActionState } from 'react'
import Input from '@/components/common/Input';
import {Preloader} from '../Preloader';
import { ButtonPrimary } from '@/components/common/Buttons';

const initialState = {
  ok: true,
  message: '',
};

const getError = (error: {message: string, path: string[]}[], key: string) => {
  if (typeof error === 'string') {
    return [];
  }
  return error?.filter((err) => err.path.includes(key)) || [];
}

export function SignupForm({type}: {type: 'phone' | 'email'}) {

  const [formState, formAction, isPending] = useActionState(signupAction, initialState);
  const emailError = getError(formState.error, 'email');
  const phoneError = getError(formState.error, 'phone');
  const firstNameError = getError(formState.error, 'firstName');
  const lastNameError = getError(formState.error, 'lastName');
  const passwordError = getError(formState.error, 'password');
  const confirmPasswordError = getError(formState.error, 'confirmPassword');

  const error = typeof formState.error === 'string' ? formState.error : null;
  return (
    <form action={formAction} className='flex flex-col space-y-4 mt-6 w-full tablet:flex-row tablet:flex-wrap tablet:gap-x-4 tablet:items-center'>
      {
        error && <span className='text-primary-dark text-xs text-right font-[400] font-alex max-w-[200px] text-wrap'>{error}</span>
      }
      {type === 'email'
        ? <div className='w-full'>
        <Input type='email' name="email"
                  placeholder='name@example.com' />
        {
          emailError.map((error, index) => 
            <span key={index} className='flex-1 text-primary-dark text-xs 
          text-right font-[400] font-alex max-w-[200px] text-wrap'>{error.
            message}
          </span>
          )
        }
          </div>
        : <div className='w-full'>
          <Input type='tel' name="phone" placeholder='+249xxxxxxxxxx'/>
          {
            phoneError.map((error, index) => 
              <span key={index} className='flex-1 text-primary-dark text-xs text-right font-[400] font-alex max-w-[200px] text-wrap'>{error.message}</span>
              )
          }
        </div>
      }
      <div className='w-full tablet:max-w-[290px]'>
        <Input name="firstName" placeholder='الاسم الاول*'/>
        {
          firstNameError.map((error, index) => 
            <span key={index} className='flex-1 text-primary-dark text-xs text-right font-[400] font-alex max-w-[200px] '>{error.message}</span>
            )
        }
      </div>
      <div className='w-full tablet:max-w-[290px]'>
        <Input name="lastName" placeholder='الاسم الاخير*' />
        {
          lastNameError.map((error, index) => 
            <span key={index} className='flex-1 text-primary-dark text-xs text-right font-[400] font-alex max-w-[200px] '>{error.message}</span>
            )
        }
      </div>
      <div className='w-full tablet:max-w-[290px]'>
        <Input name="password" placeholder='كلمة المرور*' type="password" />
        {
          passwordError.map((error, index) => 
            <span key={index} className='text-primary-dark text-xs text-right font-[400] font-alex max-w-[200px] text-wrap'>{error.message}</span>)
        }
      </div>
      <div className='w-full tablet:max-w-[290px]'>
        <Input name="confirmPassword" placeholder='تأكيد كلمة المرور*' type='password' />
        {
          confirmPasswordError.map((error, index) => 
            <span key={index} className='text-primary-dark text-xs text-right font-[400] font-alex max-w-[200px] text-wrap'>{error.message}</span>)
        }
      </div>
      <div className='pt-4 w-full flex items-center justify-center'>
        <ButtonPrimary className='self-center w-[318px]'>التالي</ButtonPrimary>
      </div>

      {/* is pending */}
      
      {isPending && <Preloader/>}
    </form>
  )
}
