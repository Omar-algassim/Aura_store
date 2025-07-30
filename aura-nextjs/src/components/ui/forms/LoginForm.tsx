'use client';
import cookie from 'js-cookie';
import Input from '@/components/common/Input';
import { signinAction } from '@/utils/services/auth-service';
import React, { useActionState, useEffect } from 'react';
import { Preloader } from '../Preloader';
import { ButtonPrimary } from '@/components/common/Buttons';
import { useRouter } from 'next/navigation';
import {
  useCart,
  useCartDispatcher,
  useUserDispatch,
} from '@/components/context';
import { CartEntity } from '@/entities/cart-entity';
import { CountriesDropdown } from '../CountriesDropdown';
import { useToast } from '@/hooks/use-toast';

const getError = (
  error: { message: string; path: string[] }[],
  key: string
) => {
  if (typeof error === 'string') {
    return [];
  }
  return error?.filter((err) => err.path.includes(key)) || [];
};

const initialState = {
  message: '',
  type: '',
  data: null,
  error: [],
};

export function LoginForm({ type = 'phone' }: { type?: 'phone' | 'email' }) {
  const router = useRouter();
  const userDispatcher = useUserDispatch();
  const CartDispatcher = useCartDispatcher();
  const cart = useCart() as CartEntity;
  const [formState, formAction, isPending] = useActionState(
    signinAction,
    initialState
  );
  const { toast } = useToast();
  const [error, setError] = React.useState<string>('');
  const formRef = React.useRef<HTMLFormElement>(null);
  const [phone, setPhone] = React.useState('');
  const [countryKey, setCountryKey] = React.useState('+249');
  const providerError = getError(formState.error, 'provider');
  const passwordError = getError(formState.error, 'password');

  const formError =
    typeof formState.error === 'string' ? formState.error : null;

  useEffect(() => {
    // I think we need to convert it to async function
    if (formState.data) {
      // dispatch user data to global context
      // /console.log("user data", JSON.stringify(formState.data, null, 2));
      userDispatcher({ type: 'LOGIN', payload: { userData: formState.data } });
      // sync the cart with the user
      // cart.sync(formState.data.user.documentId).then(() => {
      //   CartDispatcher({ type: "UPDATE", payload: { cart: cart } });
      // });
      //redirect to nextPage
      const nextPage = cookie.get('nextPage') || '/';
      console.log('From Login', nextPage);
      cookie.remove('nextPage');
      return router.replace(nextPage);
    }
  }, [CartDispatcher, cart, formState.data, router, userDispatcher]);

  // submit form on enter key press
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

  return (
    <form
      action={formAction}
      ref={formRef}
      className='w-full flex flex-col space-y-4 mt-6 items-center'>
      {formError && (
        <span className='text-primary-dark text-xs text-center font-[400] font-alex w-full text-wrap'>
          {formError}
        </span>
      )}
      {/* <div className="w-full tablet:max-w-[460px]">
        <Input name="provider" placeholder="البريد او رقم الهاتف" />
        {providerError.map((error, index) => (
          <span
            key={index}
            className="flex-1 text-primary-dark text-xs text-right font-[400] font-alex max-w-[200px] "
          >
            {error.message}
          </span>
        ))}
      </div> */}
      {type === 'email' ? (
        <div className='w-full flex items-center justify-center gap-2'>
          <Input
            type='email'
            name='provider'
            placeholder='name@example.com'
            customStyles='w-full max-w-[460px] bg-surface'
          />
          {providerError.map((error, index) => (
            <span
              key={index}
              className='flex-1 text-primary-dark text-xs 
                text-right font-[400] font-alex max-w-[200px] text-wrap'>
              {error.message}
            </span>
          ))}
        </div>
      ) : (
        <div className='w-full flex flex-col items-center justify-center'>
          <div className='relative w-full max-w-[460px] flex gap-2'>
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
              name='provider'
              placeholder='9xxxxxxxxxx'
              customStyles='w-full bg-surface'
              value={phone}
              onChange={(e) => {
                const value = e.target.value;
                if (value.startsWith('0')) {
                  setError('الرجاء ادخال رقم الهاتف بدون الصفر');
                  setPhone(value.slice(1));
                  return;
                }
                if (!value.startsWith('+')) {
                  setPhone(countryKey + value);
                } else {
                  setPhone(value);
                }
              }}
            />
            <CountriesDropdown
              defaultValue={countryKey}
              setCountryKey={(code) => {
                setCountryKey(code);
                setPhone('');
              }}
              small
              triggerStyle='w-fit h-14 bg-surface rounded-xl border-none self-stretch absolute left-0'
            />
          </div>
          <div className='w-full '>
            {providerError.map((error, index) => (
              <span
                key={index}
                className='flex-1 text-primary-dark text-xs text-right font-[400] font-alex max-w-[200px] text-wrap'>
                {error.message}
              </span>
            ))}
          </div>
        </div>
      )}
      <div className='w-full flex items-center justify-center gap-2'>
        <Input
          name='password'
          type='password'
          placeholder='كلمة المرور*'
          customStyles='w-full max-w-[460px] bg-surface'
        />
        {passwordError.map((error, index) => (
          <span
            key={index}
            className='flex-1 text-primary-dark text-xs text-right font-[400] font-alex max-w-[200px] '>
            {error.message}
          </span>
        ))}
      </div>
      <div className='w-full tablet:max-w-[460px] flex items-center justify-center'>
        <ButtonPrimary
          type='submit'
          className='w-[196px]'>
          تسجيل الدخول
        </ButtonPrimary>
      </div>
      {isPending && <Preloader />}
    </form>
  );
}
