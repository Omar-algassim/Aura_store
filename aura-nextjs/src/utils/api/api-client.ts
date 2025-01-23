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
      // // /console.log(JSON.stringify(result.data));
      if (result.status === 200 || result.status === 201) {
        return { data: result.data };
      }
      // return { error: "حدث خطأ ما, الرجاء المحاوله مره اخرى" };
      throw new Error("حدث خطأ ما, الرجاء المحاوله مره اخرى");
    } catch (error: any) {
      console.error(error);
      return {
        error,
      };
    }
  }

  async signin(identifier: string, password: string) {
    try {
      const result = await this.api.post("/auth/local", {
        identifier,
        password,
      });
      if (result.status === 200) {
        return { data: result.data };
      }
      return { error: "كلمة المرور او البريد الالكتروني غير صحيح" };
    } catch (error: any) {
      console.error(error);
      return {
        error: "كلمة المرور او البريد الالكتروني غير صحيح",
      };
    }
  }

  async signinProvider(provider: string, access_token: string) {
    try {
      const result = await this.api.get(
        `/auth/${provider}/callback?access_token=${access_token}`
      );
      // // /console.log(JSON.stringify(result.data));
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
    // /console.log(`API => reset password with code: ${code}`);
    try {
      const result = await this.api.post("/auth/reset-password", {
        code,
        password,
        passwordConfirmation: confirmPassword,
      });
      // /console.log(JSON.stringify(result.data, null, 2));
      if (result.status === 200 || result.status === 201) {
        return { data: result.data };
      }
      return { error: "حدث خطأ ما, الرجاء المحاوله مره اخرى" };
    } catch (error: any) {
      return { error: error.message || "حدث خطأ ما, الرجاء المحاوله مره اخرى" };
    }
  }

  async requestPhoneConfirmCode(phone: string) {
    try {
      const result = await this.api.post("/auth/send-email-confirmation", {
        phone_number: phone,
      });
      if (result.status === 200 || result.status === 201) {
        return { data: result.data };
      }
      return { error: "حدث خطأ ما, الرجاء المحاوله مره اخرى" };
    } catch (error: any) {
      // /console.log(error);
      return { error: error.code || "UNKNOWN" };
    }
  }

  async sendPhoneConfirmationCode(code: string) {
    try {
      const result = await this.api.get(
        `/auth/email-confirmation?confirmation=${code}`
      );
      if (
        result.status === 200 ||
        result.status === 201 ||
        result.status === 302
      ) {
        return { data: result.data };
      }
      return { error: "UNKNOWN" };
    } catch (error: any) {
      // /console.log(error);
      return { error: error.code || "UNKNOWN" };
    }
  }

  async requestEmailConfirmationCode(email: string) {
    try {
      const result = await this.api.post("/auth/send-email-confirmation", {
        indicator: email,
      });
      if (result.status === 200 || result.status === 201) {
        return { data: result.data };
      }
      return { error: "حدث خطأ ما, الرجاء المحاوله مره اخرى" };
    } catch (error: any) {
      // /console.log(error);
      return { error: error.message || "حدث خطأ ما, الرجاء المحاوله مره اخرى" };
    }
  }

  async fetchPage(slug: string) {
    try {
      const result = await this.api.get(`/${slug}`);
      // /console.log(JSON.stringify(result.data, null, 2));
      if (result.status === 200) {
        return { data: result.data };
      }
      return { error: "حدث خطأ ما, الرجاء المحاوله مره اخرى" };
    } catch (error: any) {
      return {
        error:
          error?.response?.data?.error?.message ||
          "حدث خطأ ما, الرجاء المحاوله مره اخرى",
      };
    }
  }

  async fetchProducts(query: string) {
    // /console.log(query);
    try {
      const fetchedProducts = await this.api.get(`/products?${query}`);

      if (fetchedProducts.status !== 200) {
        // /console.log(JSON.stringify(fetchedProducts.data, null, 2));
        throw new Error("حدث خطأ ما, الرجاء المحاوله مره اخرى");
      }
      // /console.log(JSON.stringify(fetchedProducts.data, null, 2));
      return { data: fetchedProducts.data.data };
    } catch (error: any) {
      console.error(JSON.stringify(error, null, 2));
      return { error: error.message };
    }
  }

  /**
   * Fetch a single product from the api using the provided id
   * @param id the product id to fetch
   * @param query determines the fields to populate
   * @returns a Promise which resolved to the fetched product data or an error
   */
  async fetchProduct(id: string, query: string) {
    try {
      const fetchedProduct = await this.api.get(`/products/${id}?${query}`);
      if (fetchedProduct.status !== 200) {
        throw new Error("حدث خطأ ما, الرجاء المحاوله مره اخرى");
      }
      return { data: fetchedProduct.data };
    } catch (error: any) {
      return { error: error.message };
    }
  }

  /**
   * Create a new review for a product
   * @param data the review data to be created
   * @returns a Promise which resolved to the created review data or an error
   */
  async createProductReview(data: any, jwt: string, query?: string) {
    try {
      const result = await this.api.post(`/reviews?${query}`, data, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      if (result.status === 200 || result.status === 201) {
        // /console.log(JSON.stringify(result.data, null, 2));
        return { data: result.data.data };
      }
      return { error: "حدث خطأ ما, الرجاء المحاوله مره اخرى" };
    } catch (error: any) {
      // /console.log(error, null, 2);
      return { error: error.message };
    }
  }

  async updateProductReview(id: string, data: any, jwt: string) {
    try {
      const result = await this.api.put(`/reviews/${id}`, data, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      if (result.status === 200 || result.status === 201) {
        // /console.log(JSON.stringify(result.data, null, 2));
        return { data: result.data.data };
      }
      return { error: "حدث خطأ ما, الرجاء المحاوله مره اخرى" };
    } catch (error: any) {
      // /console.log(error, null, 2);
      return { error: error.message };
    }
  }

  /**
   * Fetch categories from the api
   * @returns a Promise which resolved to the fetched categories data or an error
   */
  async fetchCategories() {
    try {
      const fetchedCategories = await this.api.get("/categories");
      if (fetchedCategories.status !== 200) {
        // /console.log(JSON.stringify(fetchedCategories.data, null, 2));
        throw new Error("حدث خطأ ما, الرجاء المحاوله مره اخرى");
      }
      // // /console.log(JSON.stringify(fetchedCategories, null, 2));
      return { data: fetchedCategories.data };
    } catch (error: any) {
      console.error(JSON.stringify(error, null, 2));
      return { error: error.message };
    }
  }

  /**
   * Fetch brands from the api
   * @returns a Promise which resolved to the fetched brands data or an error
   */
  async fetchBrands() {
    try {
      const fetchedBrands = await this.api.get("/brands");
      if (fetchedBrands.status !== 200) {
        // /console.log(JSON.stringify(fetchedBrands.data, null, 2));
        throw new Error("حدث خطأ ما, الرجاء المحاوله مره اخرى");
      }
      return { data: fetchedBrands.data };
    } catch (error: any) {
      console.error(JSON.stringify(error, null, 2));
      return { error: error.message };
    }
  }
  async search(query: string) {
    try {
      const response = await this.api.get(`/products?${query}`);
      if (response.status === 200 || response.status === 201) {
        return { data: response.data };
      } else {
        return {
          error: "حدث خطأ ما, الرجاء المحاوله مره اخرى",
          code: response.status,
        };
      }
    } catch (error: any) {
      return { error: error.message };
    }
  }
}

export const apiClient = new APIClient();
