'use client';
import { signupAction } from '@/utils/services/auth-service';
import React, { useActionState, useEffect } from 'react';
import Input from '@/components/common/Input';
import { Preloader } from '../Preloader';
import { ButtonPrimary } from '@/components/common/Buttons';
import { useUserDispatch } from '@/components/context';
import { redirect } from 'next/navigation';
import { CountriesDropdown } from '../CountriesDropdown';
import { getFieldError, getFormError } from './handleError';
import { useToast } from '@/hooks/use-toast';

const initialState = {
  message: '',
  type: '',
  data: null,
  error: [],
};

export function SignupForm({ type }: { type: 'phone' | 'email' }) {
  // const user = useUser();
  const { toast } = useToast();
  const [error, setError] = React.useState<string>('');
  const UserDispatcher = useUserDispatch();
  const formRef = React.useRef<HTMLFormElement>(null);
  const [countryKey, setCountryKey] = React.useState('');
  const [formState, formAction, isPending] = useActionState(
    signupAction,
    initialState
  );

  const [formData, setFormData] = React.useState({
    email: '',
    countryCode: '',
    phone: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
  });

  const emailError = getFieldError(formState.error, 'email');
  const phoneError = getFieldError(formState.error, 'phone');
  const firstNameError = getFieldError(formState.error, 'firstName');
  const lastNameError = getFieldError(formState.error, 'lastName');
  const passwordError = getFieldError(formState.error, 'password');
  const confirmPasswordError = getFieldError(
    formState.error,
    'confirmPassword'
  );

  phoneError.concat(getFieldError(formState.error, 'countryCode'));

  const formError = getFormError(formState.error);

  useEffect(() => {
    // I think we need to convert it to async function
    if (formState.data) {
      // dispatch user data to global context
      // // /console.log('user data', JSON.stringify(formState.data, null, 2));
      UserDispatcher({ type: 'LOGIN', payload: { userData: formState.data } });
      // check if the user used phone number or email, and act accordingly
      if (type === 'email') {
        // redirect to email confirmation page
        redirect(
          '/confirm-email?msg=تم التسجيل بنجاح, الرجاء تأكيد بريدك الإلكتروني للمتابعة'
        );
      } else {
        // redirect to phone confirmation page
        redirect(
          '/confirm-phone?msg=تم التسجيل بنجاح, الرجاء تأكيد رقم هاتفك للمتابعة'
        );
      }
    }
    console.log('Form State Data:', formState.data);
  }, [formState.data, UserDispatcher, type]);

  useEffect(() => {
    if (error) {
      toast({
        title: 'خطأ',
        description: error,
        variant: 'destructive',
      });
      setError('');
    }
  }, [error]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && formRef.current) {
        event.preventDefault();
        formRef.current.requestSubmit();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <form
      action={formAction}
      ref={formRef}
      className='flex flex-col space-y-4 mt-6 w-full tablet:flex-row tablet:flex-wrap tablet:gap-x-4 tablet:items-center'>
      {formError && (
        <span className='text-primary-dark text-xs text-center font-[400] font-alex w-full text-wrap'>
          {formError}
        </span>
      )}
      {type === 'email' ? (
        <div className='w-full'>
          <Input
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            type='email'
            name='email'
            placeholder='name@example.com'
          />
          {emailError.map((error, index) => (
            <span
              key={index}
              className='flex-1 text-primary-dark text-xs 
          text-right font-[400] font-alex max-w-[200px] text-wrap'>
              {error.message}
            </span>
          ))}
        </div>
      ) : (
        <div className='w-full flex flex-col items-start justify-start'>
          <div className='w-full flex items-center justify-center gap-2'>
            <Input
              type='text'
              // value
              name='countryCode'
              value={countryKey}
              hidden={true}
              readonly={true}
            />
            <Input
              type='tel'
              value={formData.phone}
              onChange={(e) => {
                const value = e.target.value;
                if (value.startsWith('0')) {
                  setError('الرجاء ادخال رقم الهاتف بدون الصفر');
                  setFormData({ ...formData, phone: value.slice(1) });
                  return;
                } else {
                  setFormData({ ...formData, phone: value });
                }
              }}
              name='phone'
              placeholder='9xxxxxxxxxx'
              customStyles='flex-1'
            />
            <CountriesDropdown
              setCountryKey={setCountryKey}
              small
              triggerStyle='w-fit h-14 bg-surface rounded-2xl border-none self-stretch'
            />
          </div>
          <div className='w-full '>
            {phoneError.map((error, index) => (
              <span
                key={index}
                className='flex-1 text-primary-dark text-xs text-right font-[400] font-alex max-w-[200px] text-wrap'>
                {error.message}
              </span>
            ))}
          </div>
        </div>
      )}
      <div className='w-full tablet:max-w-[290px]'>
        <Input
          name='firstName'
          value={formData.firstName}
          onChange={(e) =>
            setFormData({ ...formData, firstName: e.target.value })
          }
          placeholder='الاسم الاول*'
        />
        {firstNameError.length > 0 ? (
          firstNameError.map((error, index) => (
            <span
              key={index}
              className='flex-1 text-primary-dark text-xs text-right font-[400] font-alex max-w-[200px] '>
              {error.message}
            </span>
          ))
        ) : (
          <span className='flex-1 text-primary-dark text-xs text-right font-[400] font-alex max-w-[200px] h-8 text-wrap'></span>
        )}
      </div>
      <div className='w-full tablet:max-w-[290px]'>
        <Input
          name='lastName'
          value={formData.lastName}
          onChange={(e) =>
            setFormData({ ...formData, lastName: e.target.value })
          }
          placeholder='الاسم الاخير*'
        />
        {lastNameError.length > 0 ? (
          lastNameError.map((error, index) => (
            <span
              key={index}
              className='flex-1 text-primary-dark text-xs text-right font-[400] font-alex max-w-[200px] '>
              {error.message}
            </span>
          ))
        ) : (
          <span className='flex-1 text-primary-dark text-xs text-right font-[400] font-alex max-w-[200px] h-8 text-wrap'></span>
        )}
      </div>
      <div className='w-full tablet:max-w-[290px] flex flex-col items-start justify-start'>
        <Input
          name='password'
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          placeholder='كلمة المرور*'
          type='password'
        />
        {passwordError.length > 0 ? (
          passwordError.map((error, index) => (
            <span
              key={index}
              className='text-primary-dark text-xs text-right font-[400] font-alex max-w-[200px] text-wrap'>
              {error.message}
            </span>
          ))
        ) : (
          <span className='text-primary-dark text-xs text-right font-[400] font-alex max-w-[200px] tablet:h-8 text-wrap tablet:block'></span>
        )}
      </div>
      <div className='w-full tablet:max-w-[290px] flex flex-col items-start justify-start'>
        <Input
          name='confirmPassword'
          value={formData.confirmPassword}
          onChange={(e) =>
            setFormData({ ...formData, confirmPassword: e.target.value })
          }
          placeholder='تأكيد كلمة المرور*'
          type='password'
        />
        {confirmPasswordError.length > 0 ? (
          confirmPasswordError.map((error, index) => (
            <span
              key={index}
              className='text-primary-dark text-xs text-right font-[400] font-alex max-w-[200px] h-8 text-wrap '>
              {error.message}
            </span>
          ))
        ) : (
          <span className='text-primary-dark text-xs text-right font-[400] font-alex max-w-[200px] h-8 text-wrap block'></span>
        )}
      </div>
      <div className='pt-4 w-full flex items-center justify-center'>
        <ButtonPrimary className='self-center w-[318px]'>التالي</ButtonPrimary>
      </div>

      {/* is pending */}

      {isPending && <Preloader />}
    </form>
  );
}
