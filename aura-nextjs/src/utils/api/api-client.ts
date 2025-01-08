/* eslint-disable @typescript-eslint/no-explicit-any */
// hold all the api calls, and base logic
// uses axios for http requests
// export a class instance of the api client, which contains all the api calls
import { SignupDTO } from "@/interfaces/dto";
import axios from "axios";
class APIClient {
  private baseUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337/api";
  private api = axios.create({
    baseURL: this.baseUrl,
    headers: {
      "Content-Type": "application/json",
    },
  });

  async getMe(jwt: string) {
    try {
      const result = await this.api.get("/users/me", {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      if (result.status === 200) {
        return { ok: true, data: result.data };
      }
      return { ok: false, error: "حدث خطأ ما, الرجاء المحاوله مره اخرى" };
    } catch (error: any) {
      return { ok: false, error: error.message };
    }
  }

  async signup(data: SignupDTO): Promise<{ data?: any; error?: string }> {
    try {
      const result = await this.api.post("/auth/local/register", data);
      // console.log(JSON.stringify(result.data));
      if (result.status === 200) {
        return { data: result.data };
      }
      return { error: "حدث خطأ ما, الرجاء المحاوله مره اخرى" };
    } catch (error: any) {
      console.error(error);
      return {
        error: error.message || "حدث خطأ ما, الرجاء المحاوله مره اخرى",
      };
    }
  }

  async signinProvider(provider: string, access_token: string) {
    try {
      const result = await this.api.get(
        `/auth/${provider}/callback?access_token=${access_token}`
      );
      // console.log(JSON.stringify(result.data));
      if (result.status === 200) {
        return { data: result.data };
      }
      return { error: "حدث خطأ ما, الرجاء المحاوله مره اخرى" };
    } catch (error: any) {
      console.error(error);
      return {
        error: error.message || "حدث خطأ ما, الرجاء المحاوله مره اخرى",
      };
    }
  }

  async requestResetPwdCode(
    indicatorType: "email" | "phone_number",
    indicator: string
  ) {
    console.log(
      `API => request reset password code with ${indicatorType}: ${indicator}`
    );
    try {
      const result = await this.api.post("/auth/forgot-password", {
        [indicatorType]: indicator,
      });
      if (result.status === 200 || result.status === 201) {
        return { data: result.data };
      }
      return { error: "حدث خطأ ما, الرجاء المحاوله مره اخرى" };
    } catch (error: any) {
      return { error: error.message || "حدث خطأ ما, الرجاء المحاوله مره اخرى" };
    }
  }

  async resetPassword(code: string, password: string, confirmPassword: string) {
    console.log(`API => reset password with code: ${code}`);
    try {
      const result = await this.api.post("/auth/reset-password", {
        code,
        password,
        passwordConfirmation: confirmPassword,
      });
      console.log(JSON.stringify(result.data, null, 2));
      if (result.status === 200 || result.status === 201) {
        return { data: result.data };
      }
      return { error: "حدث خطأ ما, الرجاء المحاوله مره اخرى" };
    } catch (error: any) {
      return { error: error.message || "حدث خطأ ما, الرجاء المحاوله مره اخرى" };
    }
  }
}

export const apiClient = new APIClient();
