"use client";
import React, { useEffect, useState } from "react";
import { ButtonPrimary, ButtonSecondary } from "@/components/common/Buttons";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/shadcn/input-otp";
import { useUser } from "@/components/context";
import {
  requestPhoneConfirmCode,
  requestResetPwdCode,
  sendPhoneConfirmationCode,
} from "@/utils/services/user-services";
import { useSearchParams } from "next/navigation";

interface ConfirmPhonePageProps {
  title?: string;
  description?: string;
  indicator?: string;
  buttonTitle?: string;
  onSubmitted?: (code: string) => Promise<void>;
}

function ConfirmPhonePage(props: ConfirmPhonePageProps) {
  const { title, description, indicator, buttonTitle, onSubmitted } = props;
  const searchParams = useSearchParams();
  const message = searchParams.get("message");
  const user = useUser();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [canResend, setCanResend] = useState(false);
  const [remainingTime, setRemainingTime] = useState(45);

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
    let error: string = "";
    if (indicator) {
      console.log(`request reset password code with phone: ${indicator}`);
      const data = await requestResetPwdCode("phone_number", indicator);
      error = data.error;
    } else {
      console.log(
        `request phone confirm code with phone: ${user.phone_number}`
      );
      const data = await requestPhoneConfirmCode(user.phone_number as string);
      error = data.error;
    }
    if (error) {
      setError(error);
      console.log(error);
    }
    setCanResend(false);
    setRemainingTime(45);
  };

  const handleSubmit = async () => {
    if (onSubmitted) {
      await onSubmitted(code);
      return;
    }
    console.log(
      `submitting code ${code}for user ${user.username} with ${user.documentId}`
    );
    const { error } = await sendPhoneConfirmationCode(code);
    if (error) {
      setError(error);
    }

    setCanResend(false);
    setRemainingTime(45);
    setCode("");
  };

  return (
    <div className="flex flex-col w-[364px] tablet:w-full tablet:max-w-[880px] border-none rounded-3xl pt-10 pb-6 px-6 gap-8 tablet:mt-20 bg-white justify-center items-center">
      {message && (
        <div className="absolute top-20 left-0 w-full h-[120px] bg-transparent flex flex-col items-center justify-center">
          <span className="relative w-full max-w-[460px] p-3 text-primary-dark text-lg text-center font-[400] font-alex text-wrap bg-white border-none rounded-lg ">
            {message}
          </span>
        </div>
      )}
      <div className="w-full flex items-center justify-center">
        <h1 className="w-full text-center text-lg tablet:text-3xl font-[700]">
          {title || "تأكيد رقم الهاتف"}
        </h1>
      </div>

      <div className="w-full flex flex-col gap-3 items-center justify-center">
        <p className="w-full text-center text-[14px] tablet:text-[24px] font-[500] tablet:font-[400] font-alex">
          {error.length > 0
            ? error
            : description ||
              "لقد تم إرسال رمز تأكيد إلى رقم هاتفك، يرجى إدخال الرمز المرسل"}
        </p>

        <InputOTP
          dir="ltr"
          maxLength={4}
          value={code}
          onChange={(value) => setCode(value)}
        >
          <InputOTPGroup dir="ltr" className="w-full gap-4">
            <InputOTPSlot
              className="w-[52px] h-[52px] rounded-[3px] bg-surface border-none text-2xl  "
              index={0}
            />
            <InputOTPSlot
              className="w-[52px] h-[52px] rounded-[3px] bg-surface border-none text-2xl  "
              index={1}
            />
            <InputOTPSlot
              className="w-[52px] h-[52px] rounded-[3px] bg-surface border-none text-2xl  "
              index={2}
            />
            <InputOTPSlot
              className="w-[52px] h-[52px] rounded-[3px] bg-surface border-none text-2xl  "
              index={3}
            />
          </InputOTPGroup>
        </InputOTP>
      </div>

      <div className="w-full flex flex-col items-center justify-center space-y-2">
        <ButtonSecondary
          disabled={!canResend}
          className="bg-white text-primary-dark border-none hover:bg-white hover:text-primary-dark active:bg-white active:text-primary-dark focus:outline-none focus:bg-white focus:text-primary-dark flex flex-col gap-1"
          handleClick={resendCode}
        >
          إعادة إرسال الرمز
          <p
            className={`text-center text-[14px] font-[400] font-alex text-secondary ${
              canResend ? "hidden" : "block"
            }`}
          >
            إعادة إرسال الرابط بعد {remainingTime} ثانية
          </p>
        </ButtonSecondary>
        <ButtonPrimary disabled={code.length !== 4} handleClick={handleSubmit}>
          {buttonTitle || "إنشاء الحساب"}
        </ButtonPrimary>
      </div>
    </div>
  );
}

export default ConfirmPhonePage;
