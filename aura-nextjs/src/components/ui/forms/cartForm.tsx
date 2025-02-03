'use client';
import Input from '@/components/common/Input';
import React from 'react';
import { CountriesDropdown } from '../CountriesDropdown';

export function CartForm() {
    const [countryKey, setCountryKey] = React.useState("");

    return (
        <form>
            <div className="w-full tablet:w-[360px] gap-4 flex flex-col py-5">
                <p>الأسم الأول *</p>
                <Input name="name" placeholder="الاسم الأول" />
            </div>
            <div className="w-full tablet:w-[360px] gap-4 flex flex-col py-5">
                <p>الأسم الأخير *</p>
                <Input name="name" placeholder="الاسم الأخير" />
            </div>
            <div className="w-full tablet:w-[360px] gap-4 flex flex-col py-5">
                <p>البريد الإلكتروني*</p>
                <Input name="email" placeholder="Example@gmail.com" />
            </div>
            <div className="w-full tablet:w-[360px] gap-4 flex flex-col py-5">
                <p>رقم الهاتف *</p>
                <div className='flex gap-2'>
                    <Input name="phone" placeholder="9xxxxxxxxxx" value={countryKey} />
                    <CountriesDropdown setCountryKey={setCountryKey} />
                </div>
            </div>
            <div className='flex justify-between gap-5 w-[360px]'>
                <div className="w-full tablet:w-[120px] gap-4 flex flex-col ">
                    <p>الدولة *</p>
                    <Input name="name" placeholder="الدولة" />
                </div>
                <div className="w-full tablet:w-[120px] gap-4 flex flex-col">
                    <p>المدينة *</p>
                    <Input name="name" placeholder="المدينة "/>
                </div>
            </div>
            <div className="w-full tablet:w-[360px] gap-4 flex flex-col py-5">
                <p>العنوان *</p>
                <Input name="name" placeholder="الحي, الشارع, رقم المنزل" />
            </div>
        </form>
      );
}

