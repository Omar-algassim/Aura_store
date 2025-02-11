'use client';
import Input from '@/components/common/Input';
import React from 'react';
import getAvailableRegions from '@/utils/services/available-region';
import { CountriesDropdown } from '../CountriesDropdown';
import SelectMenu from '../selectMenu';

function checkout(prevState : any, FormData : any) {
    console.log(FormData.values());
}

export function CartForm() {
    const [countryKey, setCountryKey] = React.useState("");
    const [regions, setRegions] = React.useState([]);
    const [state, action, isPending] = React.useActionState(checkout, null)


    React.useEffect(() => {
        getAvailableRegions().then((data) => {
            setRegions(data.data);
        });
    }, []);

    return (
        <form action={action} className="flex flex-col gap-5">
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
                <Input name="email" type='email' placeholder="Example@gmail.com" />
            </div>
            <div className="w-full tablet:w-[360px] gap-4 flex flex-col py-5">
                <p>رقم الهاتف *</p>
                <Input name="phone" type='tel' placeholder="9xxxxxxxxxx" />
            </div>
            <div className='flex justify-between gap-5 w-[360px]'>
                <div className="w-full tablet:w-[120px] gap-4 flex flex-col ">
                    <p>الدولة *</p>
                    <SelectMenu placeholder='الدولة' items={regions} itemName='country'/>
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
            <button type='submit' className="w-full tablet:w-[360px] h-14 bg-primary text-white rounded-[12px] text-[16px] font-alex font-[400]">إرسال</button>
        </form>
      );
}

