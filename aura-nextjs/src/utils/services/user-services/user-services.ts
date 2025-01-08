// handle and manage the user entity
// it handle all the processes that operated on or by the user (loged-in/annonymous) like login, logout, register, update user info, get user info, and delete user.
// handle the user authentication process
// it make use of the api-client.ts to run those processes in the server side

import { apiClient } from "@/utils/api/api-client";

export const getUserMe = async (jwt: string | undefined) => {
  if (!jwt) {
    console.log("no jwt found");
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
  console.log(`reset password with code: ${code}`);
  return await apiClient.resetPassword(code, password, confirmPassword);
};
