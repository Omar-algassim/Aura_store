/* eslint-disable @typescript-eslint/no-explicit-any */
// hold all the api calls, and base logic
// uses axios for http requests
// export a class instance of the api client, which contains all the api calls
import { User } from '@/entities/user-entity';
import { OrderDTO, OrderItem, SignupDTO } from '@/interfaces/dto';
import axios, { AxiosError } from 'axios';
import { string } from 'zod';
class APIClient {
  private baseUrl =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337/api';
  private api = axios.create({
    baseURL: this.baseUrl,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  async getUsers(jwt: string) {
    try {
      const result = await this.api.get('/users?populate=*', {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      if (result.status === 200) {
        return { data: result.data };
      }
      return { error: 'حدث خطأ ما, الرجاء المحاوله مره اخرى' };
    } catch (error: any) {
      return { error: error.message };
    }
  }

  async getMe(jwt: string) {
    try {
      const result = await this.api.get('/users/me?populate=*', {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      if (result.status === 200) {
        return { ok: true, data: result.data };
      }
      return { ok: false, error: 'حدث خطأ ما, الرجاء المحاوله مره اخرى' };
    } catch (error: any) {
      return { ok: false, error: error.message };
    }
  }

  async updateUser(jwt: string, id: string, data: Partial<User>) {
    try {
      delete data.id;
      delete data.createdAt;
      delete data.updatedAt;
      delete data.publishedAt;

      const result = await this.api.put(`/users-permissions/users/me`, data, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      if (result.status === 200 || result.status === 201) {
        return { data: result.data };
      }
      return { error: 'حدث خطأ ما, الرجاء المحاوله مره اخرى' };
    } catch (error: any) {
      //console.error(error);
      if (error instanceof AxiosError) {
        switch (error.code) {
          case AxiosError.ERR_BAD_REQUEST:
            return { error: 'البيانات المدخلة غير صحيحة' };
          case AxiosError.ERR_NETWORK:
            return {
              error: 'خطاء بالشبكة, تأكد من إتصالك بالإنترنت وحاول مجددا',
            };
          default:
            return { error: 'حدث خطأ ما, الرجاء المحاوله مره اخرى' };
        }
      }
      return { error: error.message };
    }
  }

  async blockUser(jwt: string, id: number) {
    try {
      const result = await this.api.put(
        `/users/${id}`,
        { blocked: true },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      if (result.status === 200 || result.status === 201) {
        return { data: result.data };
      }
      return { error: 'حدث خطأ ما, الرجاء المحاوله مره اخرى' };
    } catch (error: any) {
      //console.error(error);
      return { error: error.message };
    }
  }
  async unblockUser(jwt: string, id: number) {
    try {
      const result = await this.api.put(
        `/users/${id}`,
        { blocked: false },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      if (result.status === 200 || result.status === 201) {
        return { data: result.data };
      }
      return { error: 'حدث خطأ ما, الرجاء المحاوله مره اخرى' };
    } catch (error: any) {
      //console.error(error);
      return { error: error.message };
    }
  }

  async signup(data: SignupDTO): Promise<{ data?: any; error?: string }> {
    //console.log("API => signup", JSON.stringify(data, null, 2));
    try {
      const result = await this.api.post('/auth/local/register', data);
      // // /console.log(JSON.stringify(result.data));
      if (result.status === 200 || result.status === 201) {
        return { data: result.data };
      }
      // return { error: "حدث خطأ ما, الرجاء المحاوله مره اخرى" };
      throw new Error('حدث خطأ ما, الرجاء المحاوله مره اخرى');
    } catch (error: any) {
      //console.error(error);
      return {
        error,
      };
    }
  }

  async signin(identifier: string, password: string) {
    //console.log("Login with", identifier, " ", password);
    try {
      const result = await this.api.post('/auth/local', {
        identifier,
        password,
      });
      if (result.status === 200) {
        return { data: result.data };
      }
      return { error: 'كلمة المرور او البريد الالكتروني غير صحيح' };
    } catch {
      //console.error(error);
      return {
        error: 'كلمة المرور او البريد الالكتروني غير صحيح',
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
      return { error: 'حدث خطأ ما, الرجاء المحاوله مره اخرى' };
    } catch (error: any) {
      //console.error(error);
      return {
        error: error.message || 'حدث خطأ ما, الرجاء المحاوله مره اخرى',
      };
    }
  }

  async requestResetPwdCode(
    indicatorType: 'email' | 'phone_number',
    indicator: string
  ) {
    // console.log(
    //   `API => request reset password code with ${indicatorType}: ${indicator}`
    // );
    try {
      const result = await this.api.post('/auth/forgot-password', {
        [indicatorType]: indicator,
      });
      if (result.status === 200 || result.status === 201) {
        return { data: result.data };
      }
      return { error: 'حدث خطأ ما, الرجاء المحاوله مره اخرى' };
    } catch (error: any) {
      return {
        error: error.message || 'حدث خطأ ما, الرجاء المحاوله مره اخرى',
      };
    }
  }

  async resetPassword(
    code: string,
    password: string,
    confirmPassword: string
  ) {
    // /console.log(`API => reset password with code: ${code}`);
    try {
      const result = await this.api.post('/auth/reset-password', {
        code,
        password,
        passwordConfirmation: confirmPassword,
      });
      // /console.log(JSON.stringify(result.data, null, 2));
      if (result.status === 200 || result.status === 201) {
        return { data: result.data };
      }
      return { error: 'حدث خطأ ما, الرجاء المحاوله مره اخرى' };
    } catch (error: any) {
      return {
        error: error.message || 'حدث خطأ ما, الرجاء المحاوله مره اخرى',
      };
    }
  }

  async requestPhoneConfirmCode(phone: string) {
    try {
      const result = await this.api.post('/auth/send-email-confirmation', {
        phone_number: phone,
      });
      if (result.status === 200 || result.status === 201) {
        return { data: result.data };
      }
      return { error: 'حدث خطأ ما, الرجاء المحاوله مره اخرى' };
    } catch (error: any) {
      // /console.log(error);
      return { error: error.code || 'UNKNOWN' };
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
      return { error: 'UNKNOWN' };
    } catch (error: any) {
      // /console.log(error);
      return { error: error.code || 'UNKNOWN' };
    }
  }

  async requestEmailConfirmationCode(email: string) {
    try {
      const result = await this.api.post('/auth/send-email-confirmation', {
        email,
      });
      if (result.status === 200 || result.status === 201) {
        return { data: result.data };
      }
      return { error: 'حدث خطأ ما, الرجاء المحاوله مره اخرى' };
    } catch (error: any) {
      // /console.log(error);
      return {
        error: error.message || 'حدث خطأ ما, الرجاء المحاوله مره اخرى',
      };
    }
  }

  async fetchPage(slug: string) {
    try {
      const result = await this.api.get(`/${slug}`);
      // /console.log(JSON.stringify(result.data, null, 2));
      if (result.status === 200) {
        return { data: result.data };
      }
      return { error: 'حدث خطأ ما, الرجاء المحاوله مره اخرى' };
    } catch (error: any) {
      return {
        error:
          error?.response?.data?.error?.message ||
          'حدث خطأ ما, الرجاء المحاوله مره اخرى',
      };
    }
  }

  async fetchProducts(query: string) {
    // /console.log(query);
    try {
      const fetchedProducts = await this.api.get(`/products?${query}`);

      // console.log("fetched data", JSON.stringify(fetchedProducts.data.meta, null, 2));
      if (fetchedProducts.status !== 200) {
        throw new Error('حدث خطأ ما, الرجاء المحاوله مره اخرى');
      }
      // /console.log(JSON.stringify(fetchedProducts.data, null, 2));
      return {
        data: fetchedProducts.data.data,
        meta: fetchedProducts.data.meta,
      };
    } catch (error: any) {
      //console.error(JSON.stringify(error, null, 2));
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
        throw new Error('حدث خطأ ما, الرجاء المحاوله مره اخرى');
      }
      return { data: fetchedProduct.data };
    } catch (error: any) {
      return { error: error.message };
    }
  }

  /**
   * Create a new product
   * @param data the product data to be created
   * @returns a Promise which resolved to the created product data or an error
   */
  async createProduct(data: any, jwt: string) {
    try {
      const result = await this.api.post(
        '/products',
        { data },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      if (result.status === 200 || result.status === 201) {
        // /console.log(JSON.stringify(result.data, null, 2));
        return { data: result.data.data };
      }
      return { error: 'حدث خطأ ما, الرجاء المحاوله مره اخرى' };
    } catch (error: any) {
      console.log(error, null, 2);
      return { error: error.message };
    }
  }

  /**
   * update a product
   * @param id the product id to be updated
   * @param data the product data to be updated
   * @returns a Promise which resolved to the updated product data or an error
   */
  async updateProduct(id: string, data: any, jwt: string) {
    delete data.id;
    delete data.createdAt;
    delete data.updatedAt;
    delete data.publishedAt;
    delete data.documentId;
    const brandId = data.brand?.documentId;
    if (brandId) {
      data.brand = {
        set: brandId,
      };
    }
    const categoryId = data.categories?.documentId;
    console.log('categoryId', categoryId);
    if (categoryId) {
      data.categories = {
        set: categoryId,
      };
    }
    try {
      const result = await this.api.put(
        `/products/${id}`,
        { data },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      if (result.status === 200 || result.status === 201) {
        // /console.log(JSON.stringify(result.data, null, 2));
        return { data: result.data.data };
      }
      return { error: 'حدث خطأ ما, الرجاء المحاوله مره اخرى' };
    } catch (error: any) {
      console.log(error, null, 2);
      return { error: error.message };
    }
  }

  /**
   * delete a product
   * @param id the product id to be deleted
   * @returns a Promise which resolved to the deleted product data or an error
   */
  async deleteProduct(id: string, jwt: string) {
    try {
      const result = await this.api.delete(`/products/${id}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      if (result.status === 200 || result.status === 204) {
        // /console.log(JSON.stringify(result.data, null, 2));
        return { data: result.data.data };
      }
      return { error: 'حدث خطأ ما, الرجاء المحاوله مره اخرى' };
    } catch (error: any) {
      // console.log(error, null, 2);
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
      return { error: 'حدث خطأ ما, الرجاء المحاوله مره اخرى' };
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
      return { error: 'حدث خطأ ما, الرجاء المحاوله مره اخرى' };
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
      const fetchedCategories = await this.api.get(
        '/categories?sort=priority:desc'
      );
      if (fetchedCategories.status !== 200) {
        // /console.log(JSON.stringify(fetchedCategories.data, null, 2));
        throw new Error('حدث خطأ ما, الرجاء المحاوله مره اخرى');
      }
      // // /console.log(JSON.stringify(fetchedCategories, null, 2));
      return { data: fetchedCategories.data };
    } catch (error: any) {
      //console.error(JSON.stringify(error, null, 2));
      return { error: error.message };
    }
  }

  async updateCategory(id: string, data: any, jwt: string) {
    try {
      const result = await this.api.put(
        `/categories/${id}`,
        { data },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      // console.log(JSON.stringify(result, null, 2));
      if (result.status === 200 || result.status === 201) {
        return { data: result.data.data };
      }
      return { error: 'حدث خطأ ما, الرجاء المحاوله مره اخرى' };
    } catch (error: any) {
      console.log(error, null, 2);
      return { error: error.message };
    }
  }

  async createCategory(jwt: string, data: any) {
    try {
      const result = await this.api.post(
        '/categories',
        { data },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      if (result.status === 200 || result.status === 201) {
        // /console.log(JSON.stringify(result.data, null, 2));
        return { data: result.data.data };
      }
      return { error: 'حدث خطأ ما, الرجاء المحاوله مره اخرى' };
    } catch (error: any) {
      console.log(error, null, 2);
      return { error: error.message };
    }
  }

  async deleteCategory(id: string, jwt: string) {
    try {
      const result = await this.api.delete(`/categories/${id}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      if (result.status === 200 || result.status === 204) {
        // /console.log(JSON.stringify(result.data, null, 2));
        return { data: result.data.data };
      }
      return { error: 'حدث خطأ ما, الرجاء المحاوله مره اخرى' };
    } catch (error: any) {
      // console.log(error, null, 2);
      return { error: error.message };
    }
  }

  /**
   * Fetch brands from the api
   * @returns a Promise which resolved to the fetched brands data or an error
   */
  async fetchBrands() {
    try {
      const fetchedBrands = await this.api.get('/brands');
      if (fetchedBrands.status !== 200) {
        // /console.log(JSON.stringify(fetchedBrands.data, null, 2));
        throw new Error('حدث خطأ ما, الرجاء المحاوله مره اخرى');
      }
      return { data: fetchedBrands.data };
    } catch (error: any) {
      //console.error(JSON.stringify(error, null, 2));
      return { error: error.message };
    }
  }
  async updateBrand(id: string, data: any, jwt: string) {
    try {
      const result = await this.api.put(
        `/brands/${id}`,
        { data },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      console.log('updateBrand result', JSON.stringify(result, null, 2));
      if (result.status === 200 || result.status === 201) {
        // /console.log(JSON.stringify(result.data, null, 2));
        return { data: result.data.data };
      }
      return { error: 'حدث خطأ ما, الرجاء المحاوله مره اخرى' };
    } catch (error: any) {
      console.log(error, null, 2);

      return { error: error.message };
    }
  }
  async createBrand(data: any, jwt: string) {
    try {
      const result = await this.api.post(
        '/brands',
        { data },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      if (result.status === 200 || result.status === 201) {
        // /console.log(JSON.stringify(result.data, null, 2));
        return { data: result.data.data };
      }
      return { error: 'حدث خطأ ما, الرجاء المحاوله مره اخرى' };
    } catch (error: any) {
      // console.log(error, null, 2);
      return { error: error.message };
    }
  }
  async deleteBrand(id: string, jwt: string) {
    try {
      const result = await this.api.delete(`/brands/${id}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      if (result.status === 200 || result.status === 204) {
        // /console.log(JSON.stringify(result.data, null, 2));
        return { data: result.data.data };
      }
      return { error: 'حدث خطأ ما, الرجاء المحاوله مره اخرى' };
    } catch (error: any) {
      // console.log(error, null, 2);
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
          error: 'حدث خطأ ما, الرجاء المحاوله مره اخرى',
          code: response.status,
        };
      }
    } catch (error: any) {
      return { error: error.message };
    }
  }

  async availableRegions(query: string, jwt: string | undefined) {
    try {
      const response = await this.api.get(`/available-countries?${query}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      if (response.status === 200 || response.status === 201) {
        return { data: response.data };
      } else {
        return {
          error: 'حدث خطأ ما, الرجاء المحاوله مره اخرى',
          code: response.status,
        };
      }
    } catch (error: any) {
      return { error: error.message };
    }
  }

  async updateAvailableRegions(
    id: string,
    jwt: string | undefined,
    data: any
  ) {
    try {
      const response = await this.api.put(
        `/available-countries/${id}`,
        { data },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      if (response.status === 200 || response.status === 201) {
        return { data: response.data };
      } else {
        return {
          error: 'حدث خطأ ما, الرجاء المحاوله مره اخرى',
          code: response.status,
        };
      }
    } catch (error: any) {
      return { error: error.message };
    }
  }

  async createAvailableRegion(data: any, jwt: string | undefined) {
    try {
      const response = await this.api.post(
        '/available-countries',
        { data },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      console.log(
        'createAvailableRegion response',
        JSON.stringify(response, null, 2)
      );
      if (response.status === 200 || response.status === 201) {
        return { data: response.data };
      } else {
        return {
          error: 'حدث خطأ ما, الرجاء المحاوله مره اخرى',
          code: response.status,
        };
      }
    } catch (error: any) {
      return { error: error.message };
    }
  }

  async deleteAvailableRegion(id: string, jwt: string | undefined) {
    try {
      const response = await this.api.delete(`/available-countries/${id}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      if (response.status === 200 || response.status === 204) {
        return { data: response.data };
      } else {
        return {
          error: 'حدث خطأ ما, الرجاء المحاوله مره اخرى',
          code: response.status,
        };
      }
    } catch (error: any) {
      return { error: error.message };
    }
  }

  async availableCities(query: string, jwt: string | undefined) {
    try {
      const response = await this.api.get(`/available-cities?${query}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      if (response.status === 200 || response.status === 201) {
        return { data: response.data };
      } else {
        return {
          error: 'حدث خطأ ما, الرجاء المحاوله مره اخرى',
          code: response.status,
        };
      }
    } catch (error: any) {
      return { error: error.message };
    }
  }

  async updateAvailableCities(id: string, data: any, jwt: string | undefined) {
    try {
      const response = await this.api.put(
        `/available-cities/${id}`,
        { data },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      if (response.status === 200 || response.status === 201) {
        return { data: response.data };
      } else {
        return {
          error: 'حدث خطأ ما, الرجاء المحاوله مره اخرى',
          code: response.status,
        };
      }
    } catch (error: any) {
      return { error: error.message };
    }
  }

  async createAvailableCity(data: any, jwt: string | undefined) {
    try {
      const response = await this.api.post(
        '/available-cities',
        { data },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      if (response.status === 200 || response.status === 201) {
        return { data: response.data };
      } else {
        return {
          error: 'حدث خطأ ما, الرجاء المحاوله مره اخرى',
          code: response.status,
        };
      }
    } catch (error: any) {
      return { error: error.message };
    }
  }

  async deleteAvailableCity(id: string, jwt: string | undefined) {
    try {
      const response = await this.api.delete(`/available-cities/${id}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      if (response.status === 200 || response.status === 204) {
        return { data: response.data };
      } else {
        return {
          error: 'حدث خطأ ما, الرجاء المحاوله مره اخرى',
          code: response.status,
        };
      }
    } catch (error: any) {
      return { error: error.message };
    }
  }

  async uploadFile(data: FormData, jwt: string) {
    try {
      const response = await this.api.post('/upload', data, {
        headers: {
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 200 || response.status === 201) {
        return { data: response.data };
      } else {
        return {
          error: 'حدث خطأ ما, الرجاء المحاوله مره اخرى',
          code: response.status,
        };
      }
    } catch (error: any) {
      return { error: error };
    }
  }

  async createOrder(jwt: string, orderData: Omit<OrderDTO, 'user'>) {
    const { order_items, ...data } = orderData;
    //console.log("Order data: ", JSON.stringify(data, null, 2));
    //console.log("Order items: ", JSON.stringify(order_items, null, 2));
    try {
      const response = await this.api.post(
        '/orders',
        {
          data: {
            region: data.region,
            total_pay: data.total_pay,
            order_status: data.order_status,
            delivery_address: data.delivery_address,
            user: {
              connect: data.user_id,
            },
            checkout_image: data.checkout_image,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      if (response.status === 200 || response.status === 201) {
        const order_id = response.data.data.documentId;
        const { error, data, totalCreated } = await this.createOrderItems(
          jwt,
          order_id,
          order_items
        );
        if (totalCreated === 0) {
          console.error('No order items created, deleting order...');
          // delete the order
          await this.api.delete(`/orders/${order_id}`, {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          });
          return { error: 'حدث خطأ ما, الرجاء المحاوله مره اخرى' };
        }
        if (error || !data) {
          return { error };
        }
        return { data: order_id };
      } else {
        return {
          error: 'حدث خطأ ما, الرجاء المحاوله مره اخرى',
          code: response.status,
        };
      }
    } catch (error: any) {
      return { error: error };
    }
  }

  async createOrderItems(
    jwt: string,
    order_id: string,
    orderItems: OrderItem[]
  ) {
    const ordersData = orderItems.map((item) => {
      return {
        count: item.quantity,
        product: {
          connect: item.product.documentId,
        },
        order: {
          connect: order_id,
        },
      };
    });

    let totalCreated = 0;
    try {
      for (const data of ordersData) {
        console.log('Creating order item...', JSON.stringify(data, null, 2));
        try {
          await this.api.post(
            '/order-items',
            { data },
            {
              headers: {
                Authorization: `Bearer ${jwt}`,
              },
            }
          );
          console.log(`Order item created: ${data.product.connect}`);
          totalCreated++;
        } catch (error: any) {
          console.error(
            `Failed to create order item: ${data.product.connect}`,
            error
          );
          // return { error: error.response?.data || error.message };
        }
      }
      return { data: 'Order items created', totalCreated };
    } catch (error: any) {
      return { error: error.response?.data || error.message, totalCreated };
    }
  }

  async updateOrder(
    jwt: string,
    id: string,
    orderData: Omit<OrderDTO, 'user'>
  ) {
    const { order_items, ...data } = orderData;
    try {
      const response = await this.api.put(
        `/orders/${id}`,
        {
          data: {
            region: data.region,
            total_pay: data.total_pay,
            order_status: data.order_status,
            delivery_address: data.delivery_address,
            user: {
              connect: data.user_id,
            },
            checkout_image: data.checkout_image,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      if (response.status === 200 || response.status === 201) {
        return { data: response.data.data };
      } else {
        return {
          error: 'حدث خطأ ما, الرجاء المحاوله مره اخرى',
          code: response.status,
        };
      }
    } catch (error: any) {
      return { error: error.response?.data || error.message };
    }
  }

  async updateOrderStatus(jwt: string, id: string, orderStatus: string) {
    try {
      const response = await this.api.put(
        `/orders/${id}`,
        {
          data: {
            order_status: orderStatus,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      if (response.status === 200 || response.status === 201) {
        return { data: response.data.data };
      } else {
        return {
          error: 'حدث خطأ ما, الرجاء المحاوله مره اخرى',
          code: response.status,
        };
      }
    } catch (error: any) {
      return { error: error.response?.data || error.message };
    }
  }

  async getUserOrders(jwt: string, query: string) {
    try {
      const response = await this.api.get(`/orders?${query}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      if (response.status === 200 || response.status === 201) {
        return { data: response.data.data };
      } else {
        return {
          error: 'حدث خطأ ما, الرجاء المحاوله مره اخرى',
          code: response.status,
        };
      }
    } catch (error: any) {
      console.log(error);
      return { error: error.response?.data || error.message };
    }
  }

  async fetchOrder(jwt: string) {
    try {
      const response = await this.api.get(
        `/orders?populate[order_items][populate]=*&populate=user&sort=createdAt:asc`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      if (response.status === 200 || response.status === 201) {
        return { data: response.data.data };
      } else {
        return {
          error: 'حدث خطأ ما, الرجاء المحاوله مره اخرى',
          code: response.status,
        };
      }
    } catch (error: any) {
      // console.log(error);
      return { error: error.response?.data || error.message };
    }
  }

  async cancelOrder(jwt: string, id: string) {
    try {
      const response = await this.api.put(
        `/orders/${id}`,
        {
          data: {
            order_status: 'cancelled',
          },
        },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      if (response.status === 200 || response.status === 201) {
        return { data: response.data.data };
      } else {
        return {
          error: 'حدث خطأ ما, الرجاء المحاوله مره اخرى',
          code: response.status,
        };
      }
    } catch (error: any) {
      return { error: error.response?.data || error.message };
    }
  }

  async getCities(country: string) {
    const data = {
      country: country,
    };
    try {
      const response = await axios.post(
        'https://countriesnow.space/api/v0.1/countries/cities',
        data,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.status === 200 || response.status === 201) {
        return { data: response.data.data };
      } else {
        return {
          error: 'حدث خطأ ما, الرجاء المحاوله مره اخرى',
          code: response.status,
        };
      }
    } catch (error: any) {
      return { error: error.response?.data || error.message };
    }
  }

  async uploadImage(formData: FormData, jwt: string) {
    try {
      const response = await this.api.post('/upload', formData, {
        headers: {
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 200 || response.status === 201) {
        return { data: response.data };
      } else {
        return {
          error: 'حدث خطأ ما, الرجاء المحاوله مره اخرى',
          code: response.status,
        };
      }
    } catch (error: any) {
      return { error: error.response?.data || error.message };
    }
  }

  async deleteImage(id: string, jwt: string) {
    try {
      const response = await this.api.delete(`/upload/files/${id}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      if (response.status === 200 || response.status === 201) {
        return { data: response.data };
      }
      return {
        error: 'حدث خطأ ما, الرجاء المحاوله مره اخرى',
        code: response.status,
      };
    } catch (error: any) {
      return { error: error.response?.data || error.message };
    }
  }
}

export const apiClient = new APIClient();
