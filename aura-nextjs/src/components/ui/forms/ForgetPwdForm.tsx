import { ButtonPrimary } from "@/components/common/Buttons";
import Input from "@/components/common/Input";
import { requestResetPwdCode } from "@/utils/services/user-services";
import React from "react";

interface ForgetPwdFormProps {
  onSubmit: (submittedType: string) => void;
  indicator: string;
  setIndicator: (indicator: string) => void;
}

function ForgetPwdForm({
  onSubmit,
  indicator,
  setIndicator,
}: ForgetPwdFormProps) {
  const [error, setError] = React.useState("");

  const requestResetPwd = async () => {
    // /console.log(indicator);
    let indicatorType: "email" | "phone_number";
    if (!indicator.includes("@") && !/^\+?[\d\s-]{10,}$/.test(indicator)) {
      setError("البريد الإلكتروني أو رقم الهاتف غير صحيح");
      setIndicator("");
      return;
    }
    if (indicator.includes("@")) {
      // /console.log("Email");
      indicatorType = "email";
    } else {
      // /console.log("Phone");
      indicatorType = "phone_number";
    }
    const { error } = await requestResetPwdCode(indicatorType, indicator);
    if (error) {
      // /console.log(error);
      setError(error);
      return;
    }
    onSubmit(indicatorType);
  };
  return (
    <form className="w-full flex flex-col space-y-8 mt-6 items-center">
      {error.length > 0 && (
        <div className="w-full text-red-500 text-[14px] font-alex text-center -mb-5">
          {error}
        </div>
      )}
      <Input
        name="indicator"
        type="text"
        placeholder="البريد الإلكتروني او رقم الهاتف"
        onChange={(e) => setIndicator(e.target.value)}
        customStyles={`${error.length > 0 ? "border-2 border-red-500" : ""}`}
        value={indicator}
      />
      <ButtonPrimary
        disabled={indicator.length === 0}
        type="button"
        handleClick={requestResetPwd}
        className="w-full max-w-[200px]"
        preloader={true}
      >
        تغيير كلمة المرور
      </ButtonPrimary>
    </form>
  );
}

export default ForgetPwdForm;
