'use client';

import React, { useActionState, useState } from 'react';
import Image from 'next/image';
import signUp from '@/app/utils/auth/signup';
import loginWithGoogle  from '@/app/utils/auth/login-with-google';

import { ButtonSolid } from '@/app/ui/buttons';

import style from '@/app/auth/signup/page.module.css';
import { backendConstants } from '@/app/(constants)/backend-constants';

function SignUp() {
  const [state, action, isPending] = useActionState(signUp, undefined);
  
  
  return (
    <>
    {state?.error?.signupFailed && <span className={[style.error, style.notifyError].join(' ')}>{state.error.signupFailed.message}</span>}
    <form action={action} className={style.form}>
      <div className={style.rowTitle}>
        <h1>إنشاء حساب جديد</h1>
      </div>

      <div className={style.row}>
        <label className={style.label} htmlFor="email">البريد الإلكتروني</label>
        <input className={style.input} type="email" id="email" name="email" placeholder='Example@example.com' required />
        {state?.errors?.email && <span className={style.error}>{
        state.errors.email}</span>}
      </div>

      <div className={[style.row, style.telInputRow].join(' ')}>
        <div className={style.row}>
        <label className={style.label} htmlFor="country-key"> </label>
        <select className={style.select} name="country_key" id="country-key">
          <option value={"00249"} defaultChecked>+249</option>
          <option value={"0020"}>+20</option>
          <option value={"00996"}>+996</option>
        </select>
        </div>
        <div className={style.row}>
          <label className={style.label} htmlFor="phone-number">رقم الهاتف</label>
          <input className={style.input} type="tel" id="phone-number" name="phone_number" placeholder='9xxxxxxxx' required />
      </div>
          {state?.errors?.phone_number && <span className={style.error}>
          {state.errors.phone_number}</span>}
        </div>

      <div className={style.row}>
        <label className={style.label} htmlFor="full-name">الاسم الكامل</label>
        <input className={style.input} type="text" id="full-name" name="full_name" placeholder='الاسم الكامل' required />
        {state?.errors?.full_name && <span className={style.error}>
          {state.errors.full_name}</span>}
      </div>


      <div className={style.row}>
        <label className={style.label} htmlFor="password">كلمة المرور</label>
        <input className={style.input} type="password" id="password" name="password" placeholder='كلمة المرور' required />
        {state?.errors?.password && <span className={style.error}>
          {state.errors.password}</span>}
      </div>

      <div className={style.row}>
        {/* <button type="submit" >إنشاء حساب</button> */}
      </div>

      <div className={[style.row, style.submitRow].join(' ')}>
        <ButtonSolid styles={style.googleBtn} href={backendConstants.googleLoginUrl}>
          <Image src={'/signin-with-google.png'} alt='Continue With Google' width={120} height={30}></Image>
        </ButtonSolid>
        <ButtonSolid type="submit" styles={style.button}>إنشاء حساب</ButtonSolid>
      </div>


    </form>
    </>
  )
}

export default SignUp