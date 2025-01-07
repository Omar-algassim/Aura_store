/* eslint-disable @typescript-eslint/no-explicit-any */
import { signInSchema, signUpSchema } from "@/components/ui/forms/schemas";
import { SignupDTO } from "@/interfaces/dto";
import { apiClient } from "../api/api-client";

/**
 * signupAction is an async function that takes a form data object and run client side validation on it before sending it to the server endpoint
 * @param formData the form data object from the signup form
 * @returns a promise that resolves to an object `{ok: boolean, message?: string, error?: any}`
 */
export const signupAction = async (
  _prevState: any,
  formData: FormData
): Promise<{ message: string; type?: string; data?: any; error?: any }> => {
  try {
    // extract the data from the form data object
    const rowData = {
      email: formData.get("email")?.toString(),
      phone: formData.get("phone")?.toString(),
      firstName: formData.get("firstName")?.toString(),
      lastName: formData.get("lastName")?.toString(),
      password: formData.get("password")?.toString(),
      confirmPassword: formData.get("confirmPassword")?.toString(),
    };

    // validate the data using zod
    const validation = signUpSchema.safeParse(rowData);
    // console.log(JSON.stringify(validation));
    if (!validation.success) {
      return {
        type: "validation",
        message: "الرجاء التأكد من البيانات المدخله",
        error: validation.error.issues,
        data: null,
      };
    }
    // prepare the data to be sent to the server
    const data: SignupDTO = {
      email: undefined,
      phone_number: undefined,
      password: validation.data.password,
      username: `${validation.data.firstName} ${validation.data.lastName}`,
    };

    let error: string | undefined;
    let userData: any;
    // check if the provider is email or phone
    // and call the appropriate API endpoint
    if (rowData.email) {
      // if it's an email, call the email signup API
      data.email = rowData.email;
      // console.log("email signup", JSON.stringify(data, null, 2));
      const response = await apiClient.signup(data);
      userData = response.data;
      error = response.error;
      // if we enabled the email confirmation, strapi will redirect the user automatically
      // so we don't need to do anything here
      // otherwise, strapi will return the user data and the jwt token
      // and we can save the token in the local storage and redirect the user to the dashboard
      // console.log("user data", JSON.stringify(userData, null, 2));
    } else {
      // if it's a phone number, call the phone signup API
      data.phone_number = rowData.phone;
      // console.log("phone signup", JSON.stringify(data, null, 2));
      const response = await apiClient.signup(data);
      userData = response.data;
      error = response.error;
      // console.log("userData: ", JSON.stringify(userData, null, 2));
    }

    if (error) {
      return { message: error, type: "server", error, data: null };
    }
    return { message: "تم التسجيل بنجاح", data: userData };
  } catch (error: any) {
    console.error(error);
    return {
      type: "server",
      message: "حدث خطأ ما, الرجاء المحاوله مره اخرى",
      error: error.message || "حدث خطأ ما, الرجاء المحاوله مره اخرى",
      data: null,
    };
  }
};

/**
 * signinAction is an async function that takes a form data object and run client side validation on it before sending it to the server endpoint
 * @param formData the form data object from the signin form
 * @returns a promise that resolves to an object `{ok: boolean, message?: string, error?: any}`
 */
export const signinAction = async (_prevState: any, formData: FormData) => {
  try {
    const data = {
      provider: formData.get("provider")?.toString(),
      password: formData.get("password")?.toString(),
    };

    const validation = signInSchema.safeParse(data);
    if (!validation.success) {
      return {
        type: "validation",
        message: "الرجاء التأكد من البيانات المدخله",
        error: validation.error.issues,
        data: null,
      };
    }

    let error: string | undefined;
    let userData: any;
    // prepare the data to be sent to the server

    // check the provider and call the appropriate API endpoint
    if (validation.data.provider.includes("@")) {
      // if it's an email, call the email signin API
      console.log("email signin", JSON.stringify(data, null, 2));
      // const response = await apiClient.signin(data);
      // userData = response.data;
      // error = response.error;
    } else {
      // if it's a phone number, call the phone signin API
      console.log("phone signin", JSON.stringify(data, null, 2));
      // const response = await apiClient.signin(data);
      // userData = response.data;
      // error = response.error;
    }
    if (error) {
      return { message: error, type: "server", error, data: null };
    }

    return { message: "تم تسجيل الدخول بنجاح", data: userData };
  } catch (error: any) {
    console.error(error);
    return {
      type: "server",
      message: "حدث خطأ ما, الرجاء المحاوله مره اخرى",
      error: error.message || "حدث خطأ ما, الرجاء المحاوله مره اخرى",
      data: null,
    };
  }
};

export const signinProvider = async (
  provider: string,
  access_token: string
) => {
  try {
    const { error, data } = await apiClient.signinProvider(
      provider,
      access_token
    );

    if (error) {
      return { ok: false, error: error };
    }

    return { ok: true, data };
  } catch (error: any) {
    console.error(error);
    return {
      ok: false,
      error: error.message || "حدث خطأ ما, الرجاء المحاوله مره اخرى",
    };
  }
};
