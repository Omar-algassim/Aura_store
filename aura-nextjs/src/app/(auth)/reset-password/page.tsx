"use client";
import { ButtonPrimary } from "@/components/common/Buttons";
import Input from "@/components/common/Input";
import { resetPassword } from "@/utils/services/user-services";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const urlParams = useSearchParams();
  const code = urlParams.get("code");

  useEffect(() => {
    // /console.log("code", code);
    if (!code) {
      router.back();
    }
  }, [router, code]);

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      setError("كلمة المرور غير متطابقة");
      return;
    }
    // send the password reset request to the server
    const { error } = await resetPassword(
      code as string,
      password,
      confirmPassword
    );
    if (error) {
      setError(error);
      return;
    }
    // and redirect to the login page
    router.replace("/login");
  };

  return (
    <div className="w-full max-w-screen-tablet mx-9 py-10 border-none rounded-3xl bg-white flex flex-col items-center gap-8">
      <div className="w-full flex flex-col items-center justify-center gap-3">
        <div className="text-[19px] text-foreground font-[700] font-alex">
          تغير كلمة السر
        </div>
        <p className="w-full max-w-[360px] text-[16px] text-center text-primary-dark font-[400] font-alex">
          قم بإدخال كلمة المرور الجديدة وتأكيدها لتغير كلمة السر الخاصة بك
        </p>
      </div>
      <div className="w-full text-center text-[16px] font-[400] font-alex">
        {/* show more options [email/password form] */}
        <div
          dir="rtl"
          className="overflow-hidden w-full px-4 pb-4 flex flex-col items-center justify-center"
        >
          <form className="w-full flex flex-col space-y-4 mt-6 items-center">
            {error && (
              <span className="text-primary-dark text-xs text-center font-[400] font-alex w-full text-wrap">
                {error}
              </span>
            )}
            <div className="w-full tablet:max-w-[460px]">
              <Input
                name="password"
                type="password"
                placeholder="كلمة المرور*"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="w-full tablet:max-w-[460px]">
              <Input
                name="confirmPassword"
                type="password"
                placeholder="تأكيد كلمة المرور*"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <div className="w-full tablet:max-w-[460px] flex items-center justify-center">
              <ButtonPrimary
                type="button"
                handleClick={handleSubmit}
                className="w-[196px]"
              >
                تغير كلمة السر
              </ButtonPrimary>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
