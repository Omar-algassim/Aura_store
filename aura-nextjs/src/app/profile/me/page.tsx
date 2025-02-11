"use client";
import { useUser, useUserDispatch } from "@/components/context";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { User } from "@/entities/user-entity";
import { CheckSquare, Edit, InfoIcon } from "lucide-react";
import InputComponent from "@/components/common/Input";
import { ButtonPrimary } from "@/components/common/Buttons";
import { CountriesDropdown } from "@/components/ui/CountriesDropdown";

function ProfileInfo() {
  const user = useUser() as User;
  const userDispatcher = useUserDispatch();
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone_number);
  const [countryCode, setCountryCode] = useState(user.country_code || "+249");
  const [editing, setEditing] = useState("");

  useEffect(() => {
    setUsername(user.username);
    setEmail(user.email);
    setCountryCode(user.country_code || "+249");
    const countryCodePattern = new RegExp(`^${"\\" + user.country_code}`, "g");
    const phoneWithOutCountryCode = user.phone_number?.replace(
      countryCodePattern,
      ""
    );
    setPhone(phoneWithOutCountryCode);
  }, [user]);

  const saveChanges = async () => {
    console.log(
      `username: ${username}, email: ${email}, phone: ${phone}, country_code: ${countryCode}`
    );
    if (phone && countryCode.concat(phone) !== user.phone_number) {
      // set the user confirmation to false
      // send otp to the new phone number
      // prompt the user to enter the otp
      // if otp is correct, update the phone number and set the confirmation to true
      console.log("phone number changed");
    }
    if (email && email !== user.email) {
      // set the user confirmation to false
      // send email confirmation
      // prompt the user with message to check the email
      console.log("email changing");
    }
    if (username && username !== user.username) {
      // update the username
      console.log("username changing");
    }
    setEditing("");
  };

  return (
    <>
      {/* Avatar */}
      <section className="w-full flex flex-col items-center justify-center gap-4 mt-12">
        {/* profile avatar */}
        <div className="w-20 h-20 bg-transparent flex items-center justify-center rounded-full">
          <Image
            src={user.avatar || "/images/default-avatar.png"}
            alt="profile avatar"
            width={80}
            height={80}
          />
        </div>
      </section>

      {/* User Info */}
      <section className="w-full max-w-[1480px] px-0 laptop:px-[30px] flex flex-col justify-center tablet:items-center gap-4 mt-4">
        {/* user name */}
        <div className="w-full max-w-[640px] flex flex-col items-start justify-start gap-4">
          <div className="w-full flex justify-between items-center gap-4">
            <h3 className="text-sm font-[500]">الإسم</h3>
          </div>
          {editing === "username" ? (
            <div className="w-full flex flex-row-reverse justify-between items-center gap-4">
              <CheckSquare
                size={32}
                color="#8b0e50"
                onClick={() => setEditing("")}
                className="cursor-pointer"
              />
              <InputComponent
                name="username"
                value={username || ""}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="اسم المستخدم"
                type="text"
                customStyles="bg-transparent border-[3px] border-primary"
              />
            </div>
          ) : (
            <div className="w-full flex flex-row-reverse justify-between items-center gap-4">
              {/* edit */}
              <Edit
                size={32}
                color="#0f0f0f"
                className="opacity-65 hover:scale-105 cursor-pointer"
                onClick={() => setEditing("username")}
              />
              <div
                dir="ltr"
                className={`w-full max-width-[320px] h-14 flex items-center justify-end pr-4 rounded-[12px] text-[16px] text-right text-[#0f0f0f] font-[400] bg-surface border-[3px] border-surface
              }`}
              >
                {username || (
                  <span className="text-secondary" dir="rtl">
                    غير محدد ...!
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* email */}
        <div className="w-full max-w-[640px] flex flex-col items-start justify-start gap-4">
          <div className="w-full flex justify-between items-center gap-4">
            <h3 className="text-sm font-[500]">البريد الإلكتروني</h3>
          </div>
          {editing === "email" ? (
            <div className="w-full flex flex-row-reverse justify-between items-center gap-4">
              <CheckSquare
                color="#8b0e50"
                size={32}
                onClick={() => setEditing("")}
                className="cursor-pointer"
              />
              <InputComponent
                name="email"
                value={email || ""}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="البريد الإلكتروني"
                type="email"
                customStyles="bg-transparent border-[3px] border-primary"
              />
            </div>
          ) : (
            <div className="w-full flex flex-row-reverse justify-between items-center gap-4">
              {/* edit */}
              <Edit
                size={32}
                color="#0f0f0f"
                className="opacity-65 hover:scale-105 cursor-pointer"
                onClick={() => setEditing("email")}
              />
              <div
                dir="ltr"
                className={`w-full max-width-[320px] h-14 flex items-center justify-end pr-4 rounded-[12px] text-[16px] text-right text-[#0f0f0f] font-[400] bg-surface border-[3px] border-surface
              }`}
              >
                {email || (
                  <span className="text-secondary" dir="rtl">
                    غير محدد ...!
                  </span>
                )}
              </div>
            </div>
          )}
          <p className="flex gap-2 items-center text-xs font-[500] text-right text-slate-500">
            <InfoIcon size={16} color="#8b0e50" />
            تغير البريد الإلكتروني يتتطلب تأكيد البريد عن طريق ايميل
          </p>
        </div>

        {/* phone number */}
        <div className="w-full max-w-[640px] flex flex-col items-start justify-start gap-4">
          <div className="w-full flex justify-between items-center gap-4">
            <h3 className="text-sm font-[500]">رقم الهاتف</h3>
          </div>
          {editing === "phone" ? (
            <div className="relative w-full flex flex-row-reverse justify-between items-center gap-4">
              <CheckSquare
                color="#8b0e50"
                size={32}
                onClick={() => setEditing("")}
                className="cursor-pointer"
              />
              <CountriesDropdown
                setCountryKey={setCountryCode}
                className="w-[56px] shadow-none"
                triggerStyle="absolute left-[3.2rem] items-center gap-[2px] w-[56px] shadow-none"
                defaultValue={countryCode}
                small
              />
              <InputComponent
                name="phone"
                value={(phone && `0${phone}`) || ""}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="رقم الهاتف"
                type="tel"
                customStyles="bg-transparent border-[3px] border-primary"
              />
            </div>
          ) : (
            <div className="w-full flex flex-row-reverse justify-between items-center gap-4">
              {/* edit */}
              <Edit
                size={32}
                color="#0f0f0f"
                className="opacity-65 hover:scale-105 cursor-pointer"
                onClick={() => setEditing("phone")}
              />
              <div
                dir="ltr"
                className={`w-full max-width-[320px] h-14 flex items-center justify-end pr-4 rounded-[12px] text-[16px] text-right text-[#0f0f0f] font-[400] bg-surface border-[3px] border-surface
              }`}
              >
                {(phone && countryCode.concat(phone)) || (
                  <span className="text-secondary" dir="rtl">
                    غير محدد ...!
                  </span>
                )}
              </div>
            </div>
          )}
          <p className="flex gap-2 items-center text-xs font-[500] text-right text-slate-500">
            <InfoIcon size={16} color="#8b0e50" />
            تغير رقم الهاتف يتتطلب تأكيد الرقم عن طريق الواتساب
          </p>
        </div>

        {/* submit */}
        <div className="w-full tablet:max-w-[640px] flex flex-col items-center tablet:items-start justify-start mt-10">
          <ButtonPrimary
            handleClick={saveChanges}
            disabled={
              username === user.username &&
              email === user.email &&
              countryCode.concat(phone || "") === user.phone_number
            }
            preloader
          >
            حفظ
          </ButtonPrimary>
        </div>
      </section>
    </>
  );
}

export default ProfileInfo;
