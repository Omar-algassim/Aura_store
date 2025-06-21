'use client';
import { Suspense, useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';

import { CheckSquare, Edit, InfoIcon } from 'lucide-react';
import Cookies from 'js-cookie';

import { useToast } from '@/hooks/use-toast';

import {
  requestEmailConfirmationCode,
  updateUser,
} from '@/utils/services/user-services';
import { User } from '@/entities/user-entity';

import { useUser, useUserDispatch } from '@/components/context';
import InputComponent from '@/components/common/Input';
import { ButtonPrimary } from '@/components/common/Buttons';
import { CountriesDropdown } from '@/components/ui/CountriesDropdown';
import { Preloader } from '@/components/ui/Preloader';

function ProfileInfo() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = useUser() as User;
  const userDispatcher = useUserDispatch();
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone_number);
  const [countryKey, setCountryKey] = useState(user.country_code || '+249');
  const [editing, setEditing] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const jwt = Cookies.get('jwt');
  const oldData = {
    username: user.username,
    email: user.email,
    phone_number: user.phone_number,
    country_code: user.country_code,
    confirmed: user.confirmed,
    emailConfirmed: user.emailConfirmed,
    phoneNumberConfirmed: user.phoneNumberConfirmed,
  };

  const saveChanges = async () => {
    // console.log(
    //   `username: ${username}, email: ${email}, phone: ${phone}, country_code: ${countryKey}`
    // );
    let emailChanged = false;
    let phoneChanged = false;
    let usernameChanged = false;

    if (!jwt) {
      setError('يرجى تسجيل الدخول أولا');
      return;
    }
    setLoading(true);
    if (phone && countryKey.concat(phone) !== user.phone_number) {
      // set the user confirmation to false
      // send otp to the new phone number
      // prompt the user to enter the otp
      // if otp is correct, update the phone number and set the confirmation to true
      // console.log('phone number changed');
      phoneChanged = true;
      user.phone_number = phone;
      user.country_code = countryKey; // update the country code
      user.confirmed = false; // set confirmed to false
      user.phoneNumberConfirmed = false;
    }
    if (email && email !== user.email) {
      // set the user confirmation to false
      // send email confirmation
      // prompt the user with message to check the email
      // console.log('email changing');
      emailChanged = true;
      user.email = email;
      user.confirmed = false; // set confirmed to false
      user.emailConfirmed = false;
    }
    if (username && username !== user.username) {
      // update the username
      // console.log('username changing');
      usernameChanged = true;
      user.username = username;
    }
    if (!emailChanged && !phoneChanged && !usernameChanged) {
      setError('لا توجد تغييرات لحفظها');
      setLoading(false);
      return;
    }
    const { error, data } = await updateUser(jwt, user.documentId, {
      username: user.username,
      email: user.email,
      phone_number: user.phone_number,
      country_code: user.country_code,
      confirmed: user.confirmed,
    });
    setLoading(false);
    if (error || !data) {
      // if (error)
      setError(error || 'حدث خطأ ما, الرجاء المحاوله مره اخرى');
      // reset the user data to the old data
      user.username = oldData.username;
      user.email = oldData.email;
      user.phone_number = oldData.phone_number;
      user.country_code = oldData.country_code;
      user.confirmed = oldData.confirmed;
      user.emailConfirmed = oldData.emailConfirmed;
      user.phoneNumberConfirmed = oldData.phoneNumberConfirmed;

      setEditing('');
      setUsername(user.username);
      setEmail(user.email);
      setPhone(user.phone_number);
      setCountryKey(user.country_code || '+249');
      return;
    }
    if (email && emailChanged) {
      await requestEmailConfirmationCode(email);
    }
    if (phone && phoneChanged) {
      // send otp to the new phone number
      // prompt the user to enter the otp
      // if otp is correct, update the phone number and set the confirmation to true
      toast({
        title: 'تم إرسال رمز التحقق',
        description: 'يرجى التحقق من رقم الهاتف الجديد',
        variant: 'default',
      });
    }

    userDispatcher({ type: 'UPDATE', payload: { userData: user } });
    setError('');
    setEditing('');
    router.replace('/profile/me');
    toast({
      title: 'تم الحفظ',
      description: 'تم حفظ التغييرات بنجاح',
      variant: 'success',
    });
  };

  useEffect(() => {
    const message = searchParams.get('msg');
    if (message) {
      toast({
        title: 'تنبيه',
        description: message,
        variant: 'success',
      });
      // clear the message from the url
      const url = new URL(window.location.href);
      url.searchParams.delete('msg');
      window.history.replaceState({}, '', url.toString());
    }
  }, []);

  useEffect(() => {
    setUsername(user.username);
    setEmail(user.email);
    setCountryKey(user.country_code || '+249');
    const countryKeyPattern = new RegExp(`^${'\\' + user.country_code}`, 'g');
    const phoneWithOutCountryKey = user.phone_number?.replace(
      countryKeyPattern,
      ''
    );
    setPhone(phoneWithOutCountryKey);
  }, [user]);

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
    <>
      {/* Avatar */}
      <section className='w-full flex flex-col items-center justify-center gap-4 mt-12'>
        {/* profile avatar */}
        <div className='w-20 h-20 bg-transparent flex items-center justify-center rounded-full'>
          <Image
            src={user.avatar || '/images/default-avatar.png'}
            alt='profile avatar'
            width={80}
            height={80}
          />
        </div>
      </section>

      {/* User Info */}
      <section className='w-full max-w-[1480px] px-0 laptop:px-[30px] flex flex-col justify-center tablet:items-center gap-4 mt-4'>
        {/* user name */}
        <div className='w-full max-w-[640px] flex flex-col items-start justify-start gap-4'>
          <div className='w-full flex justify-between items-center gap-4'>
            <h3 className='text-sm font-[500]'>الإسم</h3>
          </div>
          {editing === 'username' ? (
            <div className='w-full flex flex-row-reverse justify-between items-center gap-4'>
              <CheckSquare
                size={32}
                color='#8b0e50'
                onClick={() => setEditing('')}
                className='cursor-pointer'
              />
              <InputComponent
                name='username'
                value={username || ''}
                onChange={(e) => setUsername(e.target.value)}
                placeholder='اسم المستخدم'
                type='text'
                customStyles='bg-transparent border-[3px] border-primary'
              />
            </div>
          ) : (
            <div className='w-full flex flex-row-reverse justify-between items-center gap-4'>
              {/* edit */}
              <Edit
                size={32}
                color='#0f0f0f'
                className='opacity-65 hover:scale-105 cursor-pointer'
                onClick={() => setEditing('username')}
              />
              <div
                dir='ltr'
                className={`w-full max-width-[320px] h-14 flex items-center justify-end pr-4 rounded-[12px] text-[16px] text-right text-[#0f0f0f] font-[400] bg-surface border-[3px] border-surface
              }`}>
                {username || (
                  <span
                    className='text-secondary'
                    dir='rtl'>
                    غير محدد ...!
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* email */}
        <div className='w-full max-w-[640px] flex flex-col items-start justify-start gap-4'>
          <div className='w-full flex justify-between items-center gap-4'>
            <h3 className='text-sm font-[500]'>البريد الإلكتروني</h3>
          </div>
          {editing === 'email' ? (
            <div className='w-full flex flex-row-reverse justify-between items-center gap-4'>
              <CheckSquare
                color='#8b0e50'
                size={32}
                onClick={() => setEditing('')}
                className='cursor-pointer'
              />
              <InputComponent
                name='email'
                value={email || ''}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='البريد الإلكتروني'
                type='email'
                customStyles='bg-transparent border-[3px] border-primary'
              />
            </div>
          ) : (
            <div className='w-full flex flex-row-reverse justify-between items-center gap-4'>
              {/* edit */}
              <Edit
                size={32}
                color='#0f0f0f'
                className='opacity-65 hover:scale-105 cursor-pointer'
                onClick={() => setEditing('email')}
              />
              <div
                dir='ltr'
                className={`w-full max-width-[320px] h-14 flex items-center justify-end pr-4 rounded-[12px] text-[16px] text-right text-[#0f0f0f] font-[400] bg-surface border-[3px] border-surface
              }`}>
                {email || (
                  <span
                    className='text-secondary'
                    dir='rtl'>
                    غير محدد ...!
                  </span>
                )}
              </div>
            </div>
          )}
          <p className='flex gap-2 items-center text-xs font-[500] text-right text-slate-500'>
            <InfoIcon
              size={16}
              color='#8b0e50'
            />
            تغير البريد الإلكتروني يتتطلب تأكيد البريد عن طريق ايميل
          </p>
        </div>

        {/* phone number */}
        <div className='w-full max-w-[640px] flex flex-col items-start justify-start gap-4'>
          <div className='w-full flex justify-between items-center gap-4'>
            <h3 className='text-sm font-[500]'>رقم الهاتف</h3>
          </div>
          {editing === 'phone' ? (
            <div className='relative w-full flex flex-row-reverse justify-between items-center gap-4'>
              <CheckSquare
                color='#8b0e50'
                size={32}
                onClick={() => setEditing('')}
                className='cursor-pointer'
              />
              {/* <div className="relative w-full max-w-[460px] flex gap-2"> */}
              <InputComponent
                type='text'
                // value
                name='countryKey'
                value={countryKey}
                hidden={true}
                readonly={true}
              />
              <InputComponent
                type='tel'
                name='provider'
                placeholder='9xxxxxxxxxx'
                customStyles='w-full bg-transparent border-[3px] border-primary'
                value={phone}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.startsWith('0')) {
                    alert('الرجاء ادخال رقم الهاتف بدون الصفر');
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
                triggerStyle='absolute left-[3.2rem] items-center gap-[2px] w-[56px] shadow-none'
              />
            </div>
          ) : (
            <div className='w-full flex flex-row-reverse justify-between items-center gap-4'>
              {/* edit */}
              <Edit
                size={32}
                color='#0f0f0f'
                className='opacity-65 hover:scale-105 cursor-pointer'
                onClick={() => setEditing('phone')}
              />
              <div
                dir='ltr'
                className={`w-full max-width-[320px] h-14 flex items-center justify-end pr-4 rounded-[12px] text-[16px] text-right text-[#0f0f0f] font-[400] bg-surface border-[3px] border-surface
              }`}>
                {phone || (
                  <span
                    className='text-secondary'
                    dir='rtl'>
                    غير محدد ...!
                  </span>
                )}
              </div>
            </div>
          )}
          <p className='flex gap-2 items-center text-xs font-[500] text-right text-slate-500'>
            <InfoIcon
              size={16}
              color='#8b0e50'
            />
            تغير رقم الهاتف يتتطلب تأكيد الرقم عن طريق الواتساب
          </p>
        </div>

        {/* submit */}
        <div className='w-full tablet:max-w-[640px] flex flex-col items-center tablet:items-start justify-start mt-10'>
          <ButtonPrimary
            handleClick={saveChanges}
            disabled={
              username === user.username &&
              email === user.email &&
              countryKey.concat(phone || '') === user.phone_number
            }
            preloader>
            حفظ
          </ButtonPrimary>
        </div>
      </section>

      {/* loading */}
      {loading && <Preloader />}
    </>
  );
}

function ProfileInfoPage() {
  return (
    <Suspense fallback={<Preloader />}>
      <ProfileInfo />
    </Suspense>
  );
}

export default ProfileInfoPage;
