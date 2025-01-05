/* eslint-disable @typescript-eslint/no-explicit-any */
// hold all the api calls, and base logic
// uses axios for http requests
// export a class instance of the api client, which contains all the api calls
import { SignupDTO } from "@/interfaces/dto";
import axios from "axios";
class APIClient {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";
  private api = axios.create({
    baseURL: this.baseUrl,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  async signup(data: SignupDTO): Promise<{ data?: any; error?: string }> {
    try {
      const result = await this.api.post("/auth/local/register", data);
      console.log(JSON.stringify(result.data));
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
}

export const apiClient = new APIClient();
