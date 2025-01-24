"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import cookie from "js-cookie";
import {
  requestPhoneConfirmCode,
  requestResetPwdCode,
  sendPhoneConfirmationCode,
} from "@/utils/services/user-services";

import { useUser, useUserDispatch } from "@/components/context";
import { ButtonPrimary, ButtonSecondary } from "@/components/common/Buttons";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/shadcn/input-otp";
import { AlertError } from "@/components/common/Alerts";
import { BadgeAlert } from "lucide-react";

interface ConfirmPhonePageProps {
  title?: string;
  description?: string;
  indicator?: string;
  buttonTitle?: string;
  onSubmitted?: (code: string) => Promise<void>;
}

function ConfirmPhonePage(props: ConfirmPhonePageProps) {
  const { title, description, indicator, buttonTitle, onSubmitted } = props;
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("");
  const user = useUser();
  const userDispatcher = useUserDispatch();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [canResend, setCanResend] = useState(false);
  const [remainingTime, setRemainingTime] = useState(20);

  const nextPage = cookie.get("nextPage") || "/profile";

  useEffect(() => {
    setMessage(searchParams.get("message") || "");
    window.history.pushState({}, "", "/confirm-phone");
  }, [searchParams]);

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
  const resendCode = async () => {
    setCanResend(false);
    setError("");
    let error: string = "";
    if (indicator) {
      const data = await requestResetPwdCode("phone_number", indicator);
      error = data.error;
    } else {
      const data = await requestPhoneConfirmCode(user.phone_number as string);
      error = data.error;
    }
    if (error) {
      setError(error);
      // /console.log(error);
    }
    setCanResend(false);
    setRemainingTime(20);
  };

  const handleSubmit = async () => {
    if (onSubmitted) {
      await onSubmitted(code);
      return;
    }
    const { error, data } = await sendPhoneConfirmationCode(code);
    if (error) {
      setError(error);
    } else if (data) {
      userDispatcher({ type: "LOGIN", payload: { userData: data } });
      router.replace(nextPage);
    }

    setCanResend(false);
    setRemainingTime(20);
    setCode("");
  };

  return (
    <div
      className={`flex flex-col w-[364px] tablet:w-full tablet:max-w-[880px] rounded-3xl pt-10 pb-6 px-6 gap-8 tablet:mt-20 bg-white justify-center items-center`}
    >
      {message && (
        <div className="absolute top-20 left-0 w-full h-[120px] bg-transparent flex flex-col items-center justify-center">
          <AlertError
            description={message}
            className="w-full max-w-screen-tablet"
          />
        </div>
      )}
      <div className="w-full flex items-center justify-center">
        <h1 className="w-full text-center text-lg tablet:text-3xl font-[700]">
          {title || "تأكيد رقم الهاتف"}
        </h1>
      </div>

      <div className="w-full flex flex-col gap-8 items-center justify-center">
        <p
          className={`w-full text-center text-[14px] tablet:text-[24px] font-[500] tablet:font-[400] font-alex ${
            error.length > 0 ? "text-red-700" : "text-foreground"
          }`}
        >
          {error.length > 0 ? (
            <span className="flex items-center justify-center gap-2">
              <BadgeAlert className="w-[28px] h-[28px]" />
              {error}
            </span>
          ) : (
            description ||
            "لقد تم إرسال رمز تأكيد إلى رقم هاتفك، يرجى إدخال الرمز المرسل"
          )}
        </p>

        <InputOTP
          dir="ltr"
          maxLength={6}
          value={code}
          onChange={(value) => setCode(value)}
          autoCorrect="off"
          spellCheck="false"
        >
          <InputOTPGroup
            dir="ltr"
            className="w-full space-x-1 flex flex-wrap tablet:gap-4"
          >
            <InputOTPSlot
              className="w-[42px] h-[42px] tablet:w-[52px] tablet:h-[52px] rounded-[3px] bg-surface border-none text-2xl  "
              index={0}
            />
            <InputOTPSlot
              className="w-[42px] h-[42px] tablet:w-[52px] tablet:h-[52px] rounded-[3px] bg-surface border-none text-2xl  "
              index={1}
            />
            <InputOTPSlot
              className="w-[42px] h-[42px] tablet:w-[52px] tablet:h-[52px] rounded-[3px] bg-surface border-none text-2xl  "
              index={2}
            />
            <InputOTPSeparator className="" />
            <InputOTPSlot
              className="w-[42px] h-[42px] tablet:w-[52px] tablet:h-[52px]  rounded-[3px] bg-surface border-none text-2xl  "
              index={3}
            />
            <InputOTPSlot
              className="w-[42px] h-[42px] tablet:w-[52px] tablet:h-[52px]  rounded-[3px] bg-surface border-none text-2xl  "
              index={4}
            />
            <InputOTPSlot
              className="w-[42px] h-[42px] tablet:w-[52px] tablet:h-[52px] rounded-[3px] bg-surface border-none text-2xl  "
              index={5}
            />
          </InputOTPGroup>
        </InputOTP>
      </div>

      <div className="w-full flex flex-col items-center justify-center space-y-2">
        <ButtonSecondary
          disabled={!canResend}
          className="bg-white text-primary-dark border-none hover:bg-white hover:text-primary-dark active:bg-white active:text-primary-dark focus:outline-none focus:bg-white focus:text-primary-dark flex flex-col gap-1"
          handleClick={resendCode}
          preloader={true}
        >
          إعادة إرسال الرمز
          <p
            className={`text-center text-[14px] font-[400] font-alex text-secondary ${
              remainingTime <= 0 ? "hidden" : "block"
            }`}
          >
            إعادة إرسال الرابط بعد {remainingTime} ثانية
          </p>
        </ButtonSecondary>
        <ButtonPrimary disabled={code.length !== 6} handleClick={handleSubmit}>
          {buttonTitle || "إنشاء الحساب"}
        </ButtonPrimary>
      </div>
    </div>
  );
}

export default ConfirmPhonePage;
