'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import cookies from 'js-cookie';

import { useToast } from '@/hooks/use-toast';
import { ButtonSecondary } from '@/components/common/Buttons';
import {
  requestEmailConfirmationCode,
  requestResetPwdCode,
} from '@/utils/services/user-services';
import { useUser } from '@/components/context';

interface ConfirmEmailPageProps {
  title?: string;
  description?: string;
  resendLinkText?: string;
  indicator?: string;
}

export function ConfirmEmailPage(params: ConfirmEmailPageProps) {
  const { title, description, resendLinkText, indicator } = params;
  const searchParams = useSearchParams();
  const router = useRouter();
  const user = useUser();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState(searchParams.get('msg') || '');
  const [canResend, setCanResend] = useState(false);
  const [remainingTime, setRemainingTime] = useState(20);

  useEffect(() => {
    if (user.confirmed) {
      const nextPage = cookies.get('nextPage') || '/';
      router.replace(`${nextPage}?msg=تم تأكيد الحساب بنجاح`);
    }
    // console.log('user confirmed:', user.confirmed);
  }, [user, user.confirmed, router]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setRemainingTime((prev) => prev - 1);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  });

  useEffect(() => {
    if (remainingTime <= 0) {
      setCanResend(true);
    }
  }, [remainingTime]);

  useEffect(() => {
    if (message || error) {
      if (message) {
        router.refresh();
      }
      toast({
        title: 'تنبيه',
        description: message || error,
        variant: 'destructive',
      });
      setMessage('');
      setError(null);
    }
  }, [message, error, toast]);

  useEffect(() => {
    window.history.pushState({}, '', '/confirm-email');
  }, []);

  const resendCode = async () => {
    setCanResend(false);
    let error: string = '';
    if (indicator) {
      const data = await requestResetPwdCode('email', indicator as string);
      error = data.error;
    } else {
      const data = await requestEmailConfirmationCode(user.email as string);
      error = data.error;
    }
    if (error) {
      // /console.log(error);
      setError(error);
    }
    setCanResend(false);
    setRemainingTime(20);
  };

  return (
    <div className='flex flex-col w-[364px] tablet:w-full tablet:max-w-[880px] border-none rounded-3xl pt-20 pb-6 px-6 gap-8 mt-20 bg-white justify-center items-center'>
      <div className='w-full flex items-center justify-center'>
        <h1 className='w-full text-center text-lg tablet:text-3xl font-[700]'>
          {title || 'تأكيد البريد الإلكتروني'}
        </h1>
      </div>

      <div className='w-full flex items-center justify-center'>
        <p className='w-full text-center text-[14px] tablet:text-[24px] font-[500] tablet:font-[400] font-alex'>
          {description ||
            'لقد تم إرسال رابط تأكيد البريد الإلكتروني إلى بريدك الإلكتروني، يرجى التحقق من بريدك الإلكتروني والضغط على الرابط المرسل'}
        </p>
      </div>

      <div>
        <ButtonSecondary
          disabled={!canResend}
          handleClick={resendCode}
          preloader={true}
          className='bg-white text-primary-dark border-none hover:bg-white hover:text-primary-dark active:bg-white active:text-primary-dark focus:outline-none focus:bg-white focus:text-primary-dark flex flex-col gap-1'>
          {resendLinkText || 'إعادة إرسال الرابط'}
        </ButtonSecondary>
        <p
          className={`text-center text-[14px] font-[400] font-alex text-secondary ${
            remainingTime <= 0 ? 'hidden' : 'block'
          }`}>
          إعادة إرسال الرابط بعد {remainingTime} ثانية
        </p>
      </div>
    </div>
  );
}
