"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { LockIcon, X } from "lucide-react";
import ForgetPwdForm from "../forms/ForgetPwdForm";
import ConfirmEmailPage from "@/app/(auth)/confirm-email/page";
import ConfirmPhonePage from "@/app/(auth)/confirm-phone/page";

interface ForgetPwdFormProps {
  closeModal: () => void;
}

// RUN SERVER AND TEST IT OUT

function ForgetPwdModal({ closeModal }: ForgetPwdFormProps) {
  const [requested, setRequested] = useState(false);
  const [indicator, setIndicator] = useState("");
  const [indicatorType, setIndicatorType] = useState("");
  const router = useRouter();

  const handleSubmit = (submittedType: string) => {
    setRequested(true);
    setIndicatorType(submittedType);
  };
  return (
    <div
      className="absolute top-0 left-0 w-full h-full bg-[#00000050] flex items-center justify-center"
      id="pwd-reset-modal"
    >
      <div className="w-full max-w-screen-tablet mx-3 border-none rounded-3xl bg-white flex flex-col items-center gap-4">
        <div className="w-full relative">
          <X
            className="relative top-4 right-4 cursor-pointer rounded-full hover:bg-primary hover:text-white active:bg-primary active:text-white focus:outline-none focus:bg-primary focus:text-white transition-colors duration-300"
            onClick={() => closeModal()}
          />
        </div>
        <div className="w-full flex flex-col items-center justify-center gap-8">
          <div className="text-center text-[17px] text-foreground font-[700] font-alex">
            استعادة كلمة المرور
          </div>
        </div>
        {/* forget password form here */}
        {!requested && (
          <div className=" w-full flex flex-col max-w-[520px] px-8 mb-8">
            <div className="flex flex-col gap-2 items-center text-[16px] font-[400] font-alex">
              قم بإدخال بريدك الإلكتروني أو رقم الهاتف لاستعادة كلمة المرور
              <LockIcon opacity={0.75} size={40} color="#8b0e50" />
            </div>
            <ForgetPwdForm
              indicator={indicator}
              setIndicator={setIndicator}
              onSubmit={handleSubmit}
            />
          </div>
        )}
        {/* email type password reset */}
        {indicatorType === "email" && (
          // show that the reset password link had been sent to the email
          <ConfirmEmailPage
            title="تأكيد البريد الإلكتروني"
            description="لقد تم إرسال رابط تغير كلمة السر إلى بريدك الإلكتروني، يرجى التحقق من بريدك الإلكتروني والضغط على الرابط المرسل"
          />
        )}
        {/* submitting the OTP form*/}
        {indicatorType === "phone_number" && (
          <ConfirmPhonePage
            title="تأكيد رقم الهاتف"
            description="لقد تم إرسال رمز تأكيد إلى رقم هاتفك، يرجى إدخال الرمز المرسل"
            buttonTitle="تأكيد"
            onSubmitted={async (code: string) => {
              router.push(`/reset-password?code=${code}`);
            }}
          />
        )}
      </div>
    </div>
  );
}

export default ForgetPwdModal;
