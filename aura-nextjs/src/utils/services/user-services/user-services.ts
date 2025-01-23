// handle and manage the user entity
// it handle all the processes that operated on or by the user (loged-in/annonymous) like login, logout, register, update user info, get user info, and delete user.
// handle the user authentication process
// it make use of the api-client.ts to run those processes in the server side

import { apiClient } from "@/utils/api/api-client";
import { AxiosError } from "axios";

export const getUserMe = async (jwt: string | undefined) => {
  if (!jwt) {
    // /console.log("no jwt found");
    return { ok: false };
  }
  return await apiClient.getMe(jwt);
};

export const requestResetPwdCode = async (
  indicatorType: "email" | "phone_number",
  indicator: string
) => {
  console.log(
    `request reset password code with ${indicatorType}: ${indicator}`
  );
  return await apiClient.requestResetPwdCode(indicatorType, indicator);
};

export const resetPassword = async (
  code: string,
  password: string,
  confirmPassword: string
) => {
  // /console.log(`reset password with code: ${code}`);
  return await apiClient.resetPassword(code, password, confirmPassword);
};

export const requestEmailConfirmationCode = async (email: string) => {
  // /console.log(`request email confirm code with email: ${email}`);
  return await apiClient.requestEmailConfirmationCode(email);
};

export const requestPhoneConfirmCode = async (phone: string) => {
  // /console.log(`request  phone confirm code with phone: ${phone}`);
  const { error, data } = await apiClient.requestPhoneConfirmCode(phone);
  // /console.log(`Error ===> ${error}`);
  if (error === AxiosError.ERR_NETWORK) {
    return { error: "خطاء بالشبكة, تأكد من إتصالك بالإنترنت وحاول مجددا" };
  } else if (error === AxiosError.ERR_BAD_REQUEST) {
    return { error: "رقم الهاتف غير صحيح, او تم تخطي الحد من إعادة الإرسال" };
  } else if (error) {
    return { error: "حدث خطأ ما, الرجاء المحاوله مره اخرى" };
  }
  return { error, data };
};

export const sendPhoneConfirmationCode = async (code: string) => {
  // /console.log(`send phone confirm code with code: ${code}`);
  const { error, data } = await apiClient.sendPhoneConfirmationCode(code);
  if (error === AxiosError.ERR_NETWORK) {
    return { error: "خطاء بالشبكة, تأكد من إتصالك بالإنترنت وحاول مجددا" };
  } else if (error === AxiosError.ERR_BAD_REQUEST) {
    return {
      error: "الرقم السري غير صحيح, الرجاء التأكد ثم المحاولة مرة أخرى",
    };
  } else if (error) {
    return { error: "حدث خطأ ما, الرجاء المحاوله مره اخرى" };
  }
  return { error, data };
};
