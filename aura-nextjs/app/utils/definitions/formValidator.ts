import {z} from 'zod';

export const signUpValidator = z.object({
  email:z.string().email({message: 'الرجاء إدخال بريد إلكتروني صحيح'}).refine((value: string) => {// query the database to check if the email is already taken
    const emailIsTaken = false;
    return !emailIsTaken;
  },{message: 'البريد الإلكتروني مستخدم بالفعل, انتقل إلى صفحة تسجيل الدخول'}),
  phone_number: z.string().regex(/^[1-9]\d{2}[-.\s]?\d{3}[-.\s]?\d{3,4}$/, {message: 'تأكد من إدخال رقم الهاتف بشكل صحيح, بدون الصفر الأول'}),
  full_name: z.string(),
  password: z.string().min(
    8,{message: 'كلمة المرور يجب ان تكون 8 أحرف علي الأقل'})
    // .regex(
    // /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {message: 'كلمة المرور يجب أن تحتوي على حرف كبير وحرف صغير ورقم ورمز'}),
});

export type FormState = | {
  errors?: {
    email?: string[];
    phone_number?: string[];
    full_name?: string[];
    password?: string[];
  },
  signupFailed?: {message: string};
} | undefined;
