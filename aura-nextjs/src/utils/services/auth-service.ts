/* eslint-disable @typescript-eslint/no-explicit-any */
import { signInSchema, signUpSchema } from "@/components/ui/forms/schemas";
import { SignupDTO } from "@/interfaces/dto";

/**
 * signupAction is an async function that takes a form data object and run client side validation on it before sending it to the server endpoint
 * @param formData the form data object from the signup form
 * @returns a promise that resolves to an object `{ok: boolean, message?: string, error?: any}`
 */
export const signupAction = async (_prevState: any, formData: FormData) => {
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
    console.log(JSON.stringify(validation));
    if (!validation.success) {
      return {
        ok: false,
        type: "validation",
        error: validation.error.issues,
      };
    }
    // prepare the data to be sent to the server
    const data: SignupDTO = {
      email: undefined,
      phone_number: undefined,
      password: validation.data.password,
      username: `${validation.data.firstName} ${validation.data.lastName}`,
    };
    // check if the provider is email or phone
    // and call the appropriate API endpoint
    if (rowData.email) {
      // if it's an email, call the email signup API
      data.email = rowData.email;
      console.log("email signup", JSON.stringify(data, null, 2));
    } else {
      // if it's a phone number, call the phone signup API
      data.phone_number = rowData.phone;
      console.log("phone signup", JSON.stringify(data, null, 2));
    }
    return { ok: true, message: "تم التسجيل بنجاح" };
  } catch (error: any) {
    console.error(error);
    return {
      ok: false,
      type: "server",
      error: error.message || "حدث خطأ ما, الرجاء المحاوله مره اخرى",
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
        ok: false,
        type: "validation",
        error: validation.error.errors,
      };
    }
    // check the provider and call the appropriate API endpoint
    if (validation.data.provider.includes("@")) {
      // if it's an email, call the email signin API
      console.log("email signin", JSON.stringify(data, null, 2));
    } else {
      // if it's a phone number, call the phone signin API
      console.log("phone signin", JSON.stringify(data, null, 2));
    }

    return { ok: true, message: "تم تسجيل الدخول بنجاح" };
  } catch (error: any) {
    console.error(error);
    return {
      ok: false,
      type: "server",
      error: error.message || "حدث خطأ ما, الرجاء المحاوله مره اخرى",
    };
  }
};
