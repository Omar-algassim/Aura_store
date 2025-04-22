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
    .regex(/^[1-9][\d]{8,11}$/, "رقم الهاتف غير صحيح")
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

export type signUpSchemaType = z.infer<typeof signUpSchema>;
export type signInSchemaType = z.infer<typeof signInSchema>;
