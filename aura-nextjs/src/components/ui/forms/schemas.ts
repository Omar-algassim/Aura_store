import { Weight } from "lucide-react";
import { z } from "zod";

export const signUpSchema = z
  .object({
    email: z.undefined().or(z.string().email("البريد الالكتروني غير صحيح")),
    phone: z
      .undefined()
      .or(z.string().regex(/^[0-9][\d]{8,11}$/, "رقم الهاتف غير صحيح")),
    countryCode: z.optional(z.string({ message: "الرجاء اختيار الدولة" })),
    firstName: z.string().min(2, "الاسم يجب ان يحتوي على حرفين على الاقل"),
    lastName: z.string().min(2, "الاسم يجب ان يحتوي على حرفين على الاقل"),
    password: z
      .string()
      .min(8, "كلمة المرور يجب ان تحتوي على 8 احرف على الاقل"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمة المرور غير متطابقة",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => {
      if (data.phone && !data.countryCode) {
        return false;
      }
      return true;
    },
    {
      message: "الرجاء اختيار الدولة",
      path: ["countryCode"],
    }
  );
export const signInSchema = z.object({
  provider: z
    .string()
    .regex(/^\+[1-9][\d]{10,14}$/, "رقم الهاتف غير صحيح")
    .or(z.string().email("البريد الالكتروني غير صحيح")),
  password: z.string().min(8, "كلمة المرور يجب ان تحتوي على 8 احرف على الاقل"),
});

export const checkoutSchema = z.object({
  firstName: z.string().min(2, "الاسم يجب ان يحتوي على حرفين على الاقل"),
  lastName: z.string().min(2, "الاسم يجب ان يحتوي على حرفين على الاقل"),
  email: z.string().email("البريد الالكتروني غير صحيح"),
  phone: z
    .string()
    .regex(/^\+[0-9]{2,3}[1-9][\d]{8,12}$/, "رقم الهاتف غير صحيح"),
  country: z.string({ message: "الرجاء اختيار الدولة" }),
  city: z.string().min(2, "الرجاء اختيار المدينة"),
  address: z.string().min(2, "الرجاء ادخال العنوان"),
  checkoutReceipt: z.custom((value) => value instanceof File, {
    message: "الرجاء إرفاق اشعار الدفع",
  }),
  // .nonempty("الرجاء إرفاق اشعار الدفع"),
});

export const newProductSchema = z.object({
  name: z.string().min(2, "please enter a name"),
  title: z.string().min(2, "please enter a title"),
  price: z.string().min(1, "please enter a price"),
  description: z.string().min(10, "please enter a description or the description is too short"),
  usage: z.string().optional(),
  specifications: z.string().optional(),
  categories: z.array(z.string()).nonempty("please select at least one category"),
  brand: z.string().nonempty("please select a brand"),
  // thumbnail: z.string().nonempty("please upload the main image"),
  images: z
    .array(z.string())
    .optional(),
  color_grade: z.string().optional(),
  discount: z
    .number()
    .optional()
    .refine((value) => value === undefined || (value >= 0 && value <= 100), {
      message: "Discount must be between 0 and 100",
    }),
  stock: z.string().min(1, "please enter quantity of product in stock"),
  Weight: z
    .number()
    .optional(),

  });

  export const newBrandSchema = z.object({
    name: z.string().min(2, "please enter a brand name"),
  });

  export const newCategorySchema = z.object({
    title: z.string().min(2, "please enter a category title"),
    priority: z.string()
  });

export const newCountrySchema = z.object({
  name : z.string().min(2, "please enter a country name"),
  available: z.string(),
  available_cities: z.array(z.string()).optional()
});

export const newCitySchema = z.object({
  name: z.string().min(2, "please enter a city name"),
  available: z.string(),
});


export type newCountrySchemaType = z.infer<typeof newCountrySchema>;
export type newCitySchemaType = z.infer<typeof newCitySchema>;
export type newBrandSchemaType = z.infer<typeof newBrandSchema>;
export type newCategorySchemaType = z.infer<typeof newCategorySchema>;
export type newProductSchemaType = z.infer<typeof newProductSchema>;
export type signUpSchemaType = z.infer<typeof signUpSchema>;
export type signInSchemaType = z.infer<typeof signInSchema>;
