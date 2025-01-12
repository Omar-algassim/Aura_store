"use client";
import React, { useEffect, useState } from "react";
import { ButtonSecondary } from "@/components/common/Buttons";
import { useUser } from "@/components/context";
import {
  requestEmailConfirmationCode,
  requestResetPwdCode,
} from "@/utils/services/user-services";
import { useSearchParams } from "next/navigation";
import { AlertError } from "@/components/common/Alerts";

interface ConfirmEmailPageProps {
  title?: string;
  description?: string;
  resendLinkText?: string;
  indicator?: string;
}

function ConfirmEmailPage(params: ConfirmEmailPageProps) {
  const { title, description, resendLinkText, indicator } = params;
  const user = useUser();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("");
  const [canResend, setCanResend] = useState(false);
  const [remainingTime, setRemainingTime] = useState(20);

  useEffect(() => {
    setMessage(searchParams.get("message") || "");
    window.history.pushState({}, "", "/confirm-email");
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
    let error: string = "";
    if (indicator) {
      const data = await requestResetPwdCode("email", indicator as string);
      error = data.error;
    } else {
      const data = await requestEmailConfirmationCode(user.email as string);
      error = data.error;
    }
    if (error) {
      console.log(error);
    }
    setCanResend(false);
    setRemainingTime(20);
  };
  return (
    <div className="flex flex-col w-[364px] tablet:w-full tablet:max-w-[880px] border-none rounded-3xl pt-20 pb-6 px-6 gap-8 mt-20 bg-white justify-center items-center">
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
          {title || "تأكيد البريد الإلكتروني"}
        </h1>
      </div>

      <div className="w-full flex items-center justify-center">
        <p className="w-full text-center text-[14px] tablet:text-[24px] font-[500] tablet:font-[400] font-alex">
          {description ||
            "لقد تم إرسال رابط تأكيد البريد الإلكتروني إلى بريدك الإلكتروني، يرجى التحقق من بريدك الإلكتروني والضغط على الرابط المرسل"}
        </p>
      </div>

      <div>
        <ButtonSecondary
          disabled={!canResend}
          handleClick={resendCode}
          preloader={true}
          className="bg-white text-primary-dark border-none hover:bg-white hover:text-primary-dark active:bg-white active:text-primary-dark focus:outline-none focus:bg-white focus:text-primary-dark flex flex-col gap-1"
        >
          {resendLinkText || "إعادة إرسال الرابط"}
        </ButtonSecondary>
        <p
          className={`text-center text-[14px] font-[400] font-alex text-secondary ${
            remainingTime <= 0 ? "hidden" : "block"
          }`}
        >
          إعادة إرسال الرابط بعد {remainingTime} ثانية
        </p>
      </div>
    </div>
  );
}

export default ConfirmEmailPage;
