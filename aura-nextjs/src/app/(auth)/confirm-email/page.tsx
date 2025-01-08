"use client";
import React, { useEffect, useState } from "react";
import { ButtonSecondary } from "@/components/common/Buttons";
import { useUser } from "@/components/context";
import { requestResetPwdCode } from "@/utils/services/user-services";

interface ConfirmEmailPageProps {
  title?: string;
  description?: string;
  resendLinkText?: string;
  indicator?: string;
}

function ConfirmEmailPage(params: ConfirmEmailPageProps) {
  const { title, description, resendLinkText, indicator } = params;
  const user = useUser();
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
    const { error } = await requestResetPwdCode(
      "email",
      user.email || (indicator as string)
    );
    if (error) {
      console.log(error);
    }
    setCanResend(false);
    setRemainingTime(45);
  };
  return (
    <div className="flex flex-col w-[364px] tablet:w-full tablet:max-w-[880px] border-none rounded-3xl pt-10 pb-6 px-6 gap-8 mt-20 bg-white justify-center items-center">
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
          className="bg-white  ring-1 ring-primary-light hover:bg-white text-primary-dark hover:text-primary-dark active:bg-white active:text-primary-dark focus:outline-none focus:bg-white focus:text-primary-dark"
        >
          {resendLinkText || "إعادة إرسال الرابط"}
        </ButtonSecondary>
        <p
          className={`text-center text-[14px] font-[400] font-alex text-secondary ${
            canResend ? "hidden" : "block"
          }`}
        >
          إعادة إرسال الرابط بعد {remainingTime} ثانية
        </p>
      </div>
    </div>
  );
}

export default ConfirmEmailPage;
