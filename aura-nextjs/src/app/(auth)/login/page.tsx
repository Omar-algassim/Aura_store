"use client";
import ProviderSigninButton from "@/components/common/ProviderSigninButton";
import { LoginForm } from "@/components/ui";
import ForgetPwdModal from "@/components/ui/modals/ForgetPwdModal";

import Link from "next/link";
import React, { useEffect } from "react";

function LoginPage() {
  const [showForgetPwd, setShowForgetPwd] = React.useState(false);

  useEffect(() => {
    window.addEventListener("click", (e) => {
      if (
        showForgetPwd &&
        e.target === document.querySelector("#pwd-reset-modal")
      ) {
        setShowForgetPwd(false);
      }
    });
    window.addEventListener("keydown", (e) => {
      if (showForgetPwd && e.key === "Escape") {
        setShowForgetPwd(false);
      }
    });

    return () => {
      window.removeEventListener("click", (e) => {
        if (
          showForgetPwd &&
          e.target === document.querySelector("pwd-reset-modal")
        ) {
          setShowForgetPwd(false);
        }
      });
      window.removeEventListener("keydown", (e) => {
        if (showForgetPwd && e.key === "Escape") {
          setShowForgetPwd(false);
        }
      });
    };
  });

  return (
    <div className="w-full max-w-screen-tablet mx-9 py-10 border-none rounded-3xl bg-white flex flex-col items-center gap-8">
      <div className="w-full text-center text-[17px] text-foreground font-[700] font-alex">
        تسجيل الدخول
      </div>
      <div className="w-full text-center text-[16px] font-[400] font-alex">
        {/* show more options [email/password form] */}
        <div
          dir="rtl"
          className="overflow-hidden w-full px-4 pb-4 flex flex-col items-center justify-center"
        >
          <LoginForm />
        </div>
        {/* forget password */}
        <div className="">
          <button
            onClick={() => setShowForgetPwd(true)}
            className="text-foreground text-[14px] font-[400] hover:opacity-75 focus:outline-none transition-colors duration-500"
          >
            نسيت كلمة المرور
          </button>
        </div>
        {/* doesn't have account */}
        <div className="w-full flex  justify-center gap-2">
          <div className="flex items-center justify-center pt-[1.2px] m-0 h-[24px]">
            <p className="text-[12px] text-secondary align-center">
              {" "}
              ليس لديكي حساب ؟
            </p>
          </div>
          <div className="flex items-center justify-center p-0  m-0 h-[24px]">
            <Link
              href={"/register"}
              className="text-primary-dark text-[14px] font-[400] hover:text-primary transition-colors duration-500"
            >
              {" "}
              انشاء حساب
            </Link>
          </div>
        </div>
      </div>

      {/* providers login */}
      <div className="w-full flex flex-col items-center space-y-4">
        <div>او</div>
        {/* signin with google component */}
        <ProviderSigninButton
          provider="google"
          title="تسجيل الدخول بحساب جوجل"
          handleClick={() => {}}
        />
        {/* signin with facebook component */}
        <ProviderSigninButton
          provider="facebook"
          title="تسجيل الدخول بحساب فيسبوك"
          handleClick={() => {}}
        />
      </div>
      {/* forget password modal */}
      {showForgetPwd && (
        <ForgetPwdModal closeModal={() => setShowForgetPwd(false)} />
      )}
    </div>
  );
}

export default LoginPage;
