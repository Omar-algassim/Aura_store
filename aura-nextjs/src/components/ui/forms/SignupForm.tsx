"use client";
import { signupAction } from "@/utils/services/auth-service";
import React, { useActionState, useEffect } from "react";
import Input from "@/components/common/Input";
import { Preloader } from "../Preloader";
import { ButtonPrimary } from "@/components/common/Buttons";
import {
  useCart,
  useCartDispatcher,
  useUserDispatch,
} from "@/components/context";
import { redirect } from "next/navigation";
import { CartEntity } from "@/entities/cart-entity";
import { CountriesDropdown } from "../CountriesDropdown";

const initialState = {
  message: "",
  type: "",
  data: null,
  error: [],
};

const getFieldError = (
  error: { message: string; path: string[] }[],
  key: string
) => {
  if (Array.isArray(error)) {
    return error?.filter((err) => err.path.includes(key)) || [];
  }
  return [];
};

const getFormError = (
  error: { message: string; path: string[] }[] | string
) => {
  if (typeof error === "string") return error;
  return null;
};

export function SignupForm({ type }: { type: "phone" | "email" }) {
  // const user = useUser();
  const UserDispatcher = useUserDispatch();
  const CartDispatcher = useCartDispatcher();
  const cart = useCart() as CartEntity;
  const [countryKey, setCountryKey] = React.useState("");
  const [formState, formAction, isPending] = useActionState(
    signupAction,
    initialState
  );

  const emailError = getFieldError(formState.error, "email");
  const phoneError = getFieldError(formState.error, "phone");
  const firstNameError = getFieldError(formState.error, "firstName");
  const lastNameError = getFieldError(formState.error, "lastName");
  const passwordError = getFieldError(formState.error, "password");
  const confirmPasswordError = getFieldError(
    formState.error,
    "confirmPassword"
  );

  phoneError.concat(getFieldError(formState.error, "countryCode"));

  const formError = getFormError(formState.error);

  useEffect(() => {
    // I think we need to convert it to async function
    if (formState.data) {
      // dispatch user data to global context
      // // /console.log('user data', JSON.stringify(formState.data, null, 2));
      UserDispatcher({ type: "LOGIN", payload: { userData: formState.data } });
      // sync the cart with the user
      cart.sync(formState.data.user.documentId).then(() => {
        CartDispatcher({ type: "UPDATE", payload: { cart: cart } });
      });

      // check if the user used phone number or email, and act accordingly
      if (type === "email") {
        // redirect to email confirmation page
        redirect("/confirm-email");
      } else {
        // redirect to phone confirmation page
        redirect("/confirm-phone");
      }
    }
  });

  return (
    <form
      action={formAction}
      className="flex flex-col space-y-4 mt-6 w-full tablet:flex-row tablet:flex-wrap tablet:gap-x-4 tablet:items-center"
    >
      {formError && (
        <span className="text-primary-dark text-xs text-center font-[400] font-alex w-full text-wrap">
          {formError}
        </span>
      )}
      {type === "email" ? (
        <div className="w-full">
          <Input type="email" name="email" placeholder="name@example.com" />
          {emailError.map((error, index) => (
            <span
              key={index}
              className="flex-1 text-primary-dark text-xs 
          text-right font-[400] font-alex max-w-[200px] text-wrap"
            >
              {error.message}
            </span>
          ))}
        </div>
      ) : (
        <div className="w-full flex flex-col items-start justify-start">
          <div className="w-full flex items-center justify-center gap-2">
            <Input
              type="text"
              name="countryCode"
              value={countryKey}
              hidden={true}
              readonly={true}
            />
            <Input
              customStyles="flex-1"
              type="tel"
              name="phone"
              placeholder="9xxxxxxxxxx"
            />
            <CountriesDropdown setCountryKey={setCountryKey} />
          </div>
          <div className="w-full ">
            {phoneError.map((error, index) => (
              <span
                key={index}
                className="flex-1 text-primary-dark text-xs text-right font-[400] font-alex max-w-[200px] text-wrap"
              >
                {error.message}
              </span>
            ))}
          </div>
        </div>
      )}
      <div className="w-full tablet:max-w-[290px]">
        <Input name="firstName" placeholder="الاسم الاول*" />
        {firstNameError.length > 0 ? (
          firstNameError.map((error, index) => (
            <span
              key={index}
              className="flex-1 text-primary-dark text-xs text-right font-[400] font-alex max-w-[200px] "
            >
              {error.message}
            </span>
          ))
        ) : (
          <span className="flex-1 text-primary-dark text-xs text-right font-[400] font-alex max-w-[200px] h-8 text-wrap"></span>
        )}
      </div>
      <div className="w-full tablet:max-w-[290px]">
        <Input name="lastName" placeholder="الاسم الاخير*" />
        {lastNameError.length > 0 ? (
          lastNameError.map((error, index) => (
            <span
              key={index}
              className="flex-1 text-primary-dark text-xs text-right font-[400] font-alex max-w-[200px] "
            >
              {error.message}
            </span>
          ))
        ) : (
          <span className="flex-1 text-primary-dark text-xs text-right font-[400] font-alex max-w-[200px] h-8 text-wrap"></span>
        )}
      </div>
      <div className="w-full tablet:max-w-[290px] flex flex-col items-start justify-start">
        <Input name="password" placeholder="كلمة المرور*" type="password" />
        {passwordError.length > 0 ? (
          passwordError.map((error, index) => (
            <span
              key={index}
              className="text-primary-dark text-xs text-right font-[400] font-alex max-w-[200px] text-wrap"
            >
              {error.message}
            </span>
          ))
        ) : (
          <span className="text-primary-dark text-xs text-right font-[400] font-alex max-w-[200px] tablet:h-8 text-wrap tablet:block"></span>
        )}
      </div>
      <div className="w-full tablet:max-w-[290px] flex flex-col items-start justify-start">
        <Input
          name="confirmPassword"
          placeholder="تأكيد كلمة المرور*"
          type="password"
        />
        {confirmPasswordError.length > 0 ? (
          confirmPasswordError.map((error, index) => (
            <span
              key={index}
              className="text-primary-dark text-xs text-right font-[400] font-alex max-w-[200px] h-8 text-wrap "
            >
              {error.message}
            </span>
          ))
        ) : (
          <span className="text-primary-dark text-xs text-right font-[400] font-alex max-w-[200px] h-8 text-wrap block"></span>
        )}
      </div>
      <div className="pt-4 w-full flex items-center justify-center">
        <ButtonPrimary className="self-center w-[318px]">التالي</ButtonPrimary>
      </div>

      {/* is pending */}

      {isPending && <Preloader />}
    </form>
  );
}
