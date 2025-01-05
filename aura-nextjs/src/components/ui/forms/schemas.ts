import { z } from "zod";

export const signUpSchema = z
  .object({
    email: z.undefined().or(z.string().email("البريد الالكتروني غير صحيح")),
    phone: z
      .undefined()
      .or(z.string().regex(/^\+?[\d\s-]{10,}$/, "رقم الهاتف غير صحيح")),
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
  });

export const signInSchema = z.object({
  provider: z
    .string()
    .regex(/^\+?[\d\s-]{10,}$/, "رقم الهاتف غير صحيح")
    .or(z.string().email("البريد الالكتروني او رقم الهاتف غير صحيح")),
  password: z.string().min(8, "كلمة المرور يجب ان تحتوي على 8 احرف على الاقل"),
});

export type signUpSchemaType = z.infer<typeof signUpSchema>;
export type signInSchemaType = z.infer<typeof signInSchema>;
