 
import { signInSchema, signUpSchema } from "@/components/ui/forms/schemas";
import { SignupDTO } from "@/interfaces/dto";
import { apiClient } from "@/utils/api/api-client";
import { AxiosError } from "axios";

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
      countryCode: formData.get("countryCode")?.toString(),
      phone: formData.get("phone")?.toString(),
      firstName: formData.get("firstName")?.toString(),
      lastName: formData.get("lastName")?.toString(),
      password: formData.get("password")?.toString(),
      confirmPassword: formData.get("confirmPassword")?.toString(),
    };

    console.log("Attempt to sign up", JSON.stringify(rowData));
    // validate the data using zod
    const validation = signUpSchema.safeParse(rowData);
    // // /console.log(JSON.stringify(validation));
    if (!validation.success) {
      console.log("Validation error", validation.error.issues);
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
      country_code: undefined,
      password: validation.data.password,
      username: `${validation.data.firstName} ${validation.data.lastName}`,
    };

    let error: string | undefined;
    let userData: any;
    // check if the provider is email or phone
    // and call the appropriate API endpoint
    console.log("rowData", JSON.stringify(rowData, null, 2));
    if (rowData.email) {
      // if it's an email, call the email signup API
      data.email = rowData.email;
      console.log("email signup", JSON.stringify(data, null, 2));
      const response = await apiClient.signup(data);
      userData = response.data;
      error = response.error;
      // if we enabled the email confirmation, strapi will redirect the user automatically
      // so we don't need to do anything here
      // otherwise, strapi will return the user data and the jwt token
      // and we can save the token in the local storage and redirect the user to the dashboard
      // // /console.log("user data", JSON.stringify(userData, null, 2));
    } else {
      // if it's a phone number, call the phone signup API
      const phone = validation.data.phone?.startsWith("0")
        ? validation.data.phone?.slice(1)
        : validation.data.phone;
      data.phone_number = `${validation.data.countryCode}${phone}`;
      data.country_code = validation.data.countryCode;
      // /console.log("phone signup", JSON.stringify(data, null, 2));
      // return { message: "تم التسجيل بنجاح", error: data };

      const response = await apiClient.signup(data);
      userData = response.data;
      error = response.error;
      // // /console.log("userData: ", JSON.stringify(userData, null, 2));
    }

    if (error) {
      // return { message: error, type: "server", error, data: null };
      return handleError(error);
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
      countryCode: formData.get("countryCode")?.toString(),
      password: formData.get("password")?.toString(),
    };

    // console.log("Attempt to sign in", JSON.stringify(data));
    const validation = signInSchema.safeParse(data);
    if (!validation.success) {
      return {
        type: "validation",
        message: "الرجاء التأكد من البيانات المدخله",
        error: validation.error.issues,
        data: null,
      };
    }

    const { error, data: userData } = await apiClient.signin(
      validation.data.provider,
      validation.data.password
    );
    if (error) {
      // /console.log("API ==> error", error);
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

const handleError = (error: any) => {
  const errorType = error?.response?.data?.error?.name;
  // /console.log("Error Message: ", errorType);
  if (error.code === AxiosError.ERR_NETWORK) {
    return {
      message: error.code,
      type: "server",
      error: "خطاء بالشبكة, تأكد من إتصالك بالإنترنت وحاول مجددا",
      data: null,
    };
  } else if (errorType === "ApplicationError") {
    return {
      message: errorType,
      type: "server",
      error: "اسم المستخدم, رقم الهاتف, او البريد الالكتروني مستعمل بالفعل",
      data: null,
    };
  }
  return {
    message: error,
    type: "server",
    error: "حدث خطأ ما, الرجاء المحاوله مره اخرى",
    data: null,
  };
};
