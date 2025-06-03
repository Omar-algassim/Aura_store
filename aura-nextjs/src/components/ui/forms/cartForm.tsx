"use client";
import Cookies from "js-cookie";
import Image from "next/image";
import Input from "@/components/common/Input";

import getAvailableRegions from "@/utils/services/available-region";
import { CountriesDropdown } from "../CountriesDropdown";
// import SelectMenu from "../selectMenu";
import Dropdown from "../Dropdown";
import { ArrowDownIcon, CheckCircle, CloudUpload } from "lucide-react";
import { City, Region, Regions } from "@/interfaces/dto";
import { checkoutAction } from "@/utils/services/cart-services/checkoutAction";
import { getFieldError } from "./handleError";
import { ButtonPrimary } from "@/components/common/Buttons";
import { useActionState, useEffect, useRef, useState } from "react";
import { Preloader } from "../Preloader";
import { useCart, useCartDispatcher, useUser } from "@/components/context";
import { CartEntity } from "@/entities/cart-entity";
import { User } from "@/entities/user-entity";
import { useRouter } from "next/navigation";

type Props = {
  //   orderId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onError: (error: any) => void;
  children?: React.ReactNode;
};

export function CartForm(props: Props) {
  const { onError, children } = props;
  const router = useRouter();
  const user = useUser() as User;
  const cart = useCart() as CartEntity;
  const cartDispatcher = useCartDispatcher();
  const [formState, action, isPending] = useActionState(checkoutAction, null);
  const [countryCode, setCountryCode] = useState("+249");
  const [phone, setPhone] = useState("");
  const [availableRegions, setAvailableRegions] = useState<Region[]>([]);
  const [region, setRegion] = useState("");
  const [availableCities, setAvailableCities] = useState<City[]>([]);
  const [city, setCity] = useState("");
  const [receiptImage, setReceiptImage] = useState<File | null>(null);

  const [loading, setLoading] = useState(true);
  //   const
  const firstNameError = getFieldError(formState?.error, "firstName");
  const lastNameError = getFieldError(formState?.error, "lastName");
  const emailError = getFieldError(formState?.error, "email");
  const phoneError = getFieldError(formState?.error, "phone");
  const countryError = getFieldError(formState?.error, "country");
  const cityError = getFieldError(formState?.error, "city");
  const addressError = getFieldError(formState?.error, "address");

  const cartCheckedOut = useRef<boolean>(false);

  useEffect(() => {
    const fetchAvailableRegions = async () => {
      const response = await getAvailableRegions();
      setAvailableRegions(response.data);
      setLoading(false);
    };
    fetchAvailableRegions();
  }, []);

  useEffect(() => {
    setCity("");
    setLoading(true);
    if (region) {
      const cities = availableRegions.find(
        (r) => r.name === region
      )?.available_cities;
      const availableCities = cities || [];
      setAvailableCities(availableCities || []);
    }
    setLoading(false);
  }, [region, availableRegions]);

  useEffect(() => {
    const checkout = async () => {
      const jwt = Cookies.get("jwt");
      if (!jwt) {
        onError("الرجاء تسجيل الدخول");
        setLoading(false);
        return;
      }
      if (!formState?.data) {
        setLoading(false);
        return;
      }
      console.log("\n\nCalled Once ?\n");
      setLoading(true);
      const { error, data } = await cart.checkout(
        jwt,
        user.documentId,
        formState.data.country as Regions,
        {
          region: formState.data.country as Regions,
          city: formState.data.city,
          address: formState.data.address,
          recipient_phone: formState.data.phone,
          recipient_email: formState.data.email,
          recipient_name: formState.data.username,
        },
        formState.data.checkoutReceipt,
        "pending"
      );
      if (error || !data) {
        console.log(JSON.stringify(error, null, 2));
        onError(error);
        setLoading(false);
        return;
      }
      setLoading(false);
      console.log("checkout data", data);
      cartDispatcher({ type: "DELETE", payload: { cart } });
      router.push(`/cart/checkout/${data}`);
    };
    if (formState?.data && !cartCheckedOut.current) {
      cartCheckedOut.current = true;
      checkout();
    }
  });
  return (
    <form
      action={action}
      className="w-full flex flex-col gap-5 px-4 overflow-x-hidden"
    >
      <div className="w-full flex flex-wrap justify-between gap-5">
        <div className="w-full flex-1 min-w-[120px] max-w-[320px] gap-4 flex flex-col tablet:py-5">
          <p>الأسم الأول *</p>
          <Input
            name="firstName"
            placeholder="الاسم الأول"
            customStyles={`${
              firstNameError.length > 0 && "border-primary border"
            }`}
          />
          {firstNameError.length > 0 ? (
            firstNameError.map((error, index) => (
              <span
                key={index}
                className="flex-1 text-primary-dark text-xs text-right font-[400] font-alex max-w-[200px] "
              >
                {error.message}
              </span>
            ))
          ) : (
            <span className="flex-1 text-primary-dark text-xs text-right font-[400] font-alex max-w-[200px] h-8 text-wrap"></span>
          )}
        </div>
        <div className="w-full flex-1 min-w-[120px] max-w-[320px] gap-4 flex flex-col tablet:py-5">
          <p>الأسم الأخير *</p>
          <Input
            name="lastName"
            placeholder="الاسم الأخير"
            customStyles={`${
              lastNameError.length > 0 && "border-primary border"
            }`}
          />
          {lastNameError.length > 0 ? (
            lastNameError.map((error, index) => (
              <span
                key={index}
                className="flex-1 text-primary-dark text-xs text-right font-[400] font-alex max-w-[200px] "
              >
                {error.message}
              </span>
            ))
          ) : (
            <span className="flex-1 text-primary-dark text-xs text-right font-[400] font-alex max-w-[200px] h-8 text-wrap"></span>
          )}
        </div>
      </div>

      <div className="w-full flex flex-wrap justify-between gap-5">
        <div className="w-full flex-1 min-w-[220px] max-w-[320px] gap-4 flex flex-col tablet:py-5">
          <p>البريد الإلكتروني*</p>
          <Input
            name="email"
            type="email"
            placeholder="Example@gmail.com"
            customStyles={`${emailError.length > 0 && "border-primary border"}`}
          />
          {emailError.length > 0 ? (
            emailError.map((error, index) => (
              <span
                key={index}
                className="flex-1 text-primary-dark text-xs text-right font-[400] font-alex max-w-[200px] "
              >
                {error.message}
              </span>
            ))
          ) : (
            <span className="flex-1 text-primary-dark text-xs text-right font-[400] font-alex max-w-[200px] h-8 text-wrap"></span>
          )}
        </div>
        <div className="w-full flex-1 min-w-[220px] max-w-[320px] gap-4 flex flex-col tablet:py-5">
          <p>رقم الهاتف *</p>
          <Input
            name="phone"
            hidden
            readonly
            value={`${countryCode}${phone.replace(/^0/, "")}`}
            placeholder="9xxxxxxxxxx"
          />
          <div className="relative w-full flex flex-row-reverse justify-between items-center gap-4">
            <CountriesDropdown
              setCountryKey={setCountryCode}
              className="w-[56px] shadow-none border-0"
              triggerStyle="absolute left-3 border-0 items-center gap-[2px] w-[56px] shadow-none"
              defaultValue={countryCode}
              small
            />
            <Input
              name="phoneNumber"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="رقم الهاتف"
              type="tel"
              customStyles={`${
                phoneError.length > 0 && "border-primary border"
              } bg-transparent bg-surface`}
            />
          </div>
          {phoneError.length > 0 ? (
            phoneError.map((error, index) => (
              <span
                key={index}
                className="flex-1 text-primary-dark text-xs text-right font-[400] font-alex max-w-[200px] "
              >
                {error.message}
              </span>
            ))
          ) : (
            <span className="flex-1 text-primary-dark text-xs text-right font-[400] font-alex max-w-[200px] h-8 text-wrap"></span>
          )}
        </div>
      </div>

      <div className="w-full flex flex-wrap items-center gap-5">
        <div className="w-[120px] gap-4 flex flex-col ">
          <p>الدولة *</p>
          {/* <SelectMenu placeholder="الدولة" items={regions} itemName="country" /> */}
          <Input name="country" hidden readonly value={region} />
          <Dropdown
            data={availableRegions.map((region) => ({
              name: region.name,
              available: region.available,
            }))}
            disabled={availableRegions.length <= 1}
            onSelect={(selected) => setRegion(selected)}
            value={region}
            className="w-full"
          >
            <button
              className={`flex items-center justify-between w-[134px] h-[54px] bg-surface border-none rounded-[12px] px-6 py-3 ${
                countryError.length > 0 && "border-primary border"
              }`}
              disabled={availableRegions.length <= 1}
            >
              <div className="flex items-center justify-center text-sm text-right font-[400]">
                {region || "إختار..."}
              </div>
              <ArrowDownIcon
                className=""
                width={16}
                height={16}
                color="#3f3f3f"
                strokeWidth={3}
              />
            </button>
          </Dropdown>
          {countryError.length > 0 ? (
            countryError.map((error, index) => (
              <span
                key={index}
                className="flex-1 text-primary-dark text-xs text-right font-[400] font-alex max-w-[200px] "
              >
                {error.message}
              </span>
            ))
          ) : (
            <span className="flex-1 text-primary-dark text-xs text-right font-[400] font-alex max-w-[200px] h-8 text-wrap"></span>
          )}
        </div>
        <div className="w-[120px] gap-4 flex flex-col">
          <p>المدينة *</p>
          <Input
            name="city"
            hidden
            readonly
            value={city}
            placeholder="المدينة "
          />
          <Dropdown
            data={availableCities.map((city) => ({
              name: city.name,
              available: city.available,
            }))}
            disabled={availableCities.length <= 0}
            onSelect={(selected) => setCity(selected)}
            value={city}
            className="w-full"
          >
            <button
              className={`flex items-center justify-between w-[134px] h-[54px] bg-surface border-none rounded-[12px] px-6 py-3 ${
                cityError.length > 0 && "border-primary border"
              }`}
              disabled={availableCities.length <= 0}
            >
              <div className="flex items-center justify-center text-sm text-right">
                {city || "إختار..."}
              </div>
              <ArrowDownIcon
                className="group-disabled:hidden"
                width={16}
                height={16}
                color="#3f3f3f"
                strokeWidth={3}
              />
            </button>
          </Dropdown>
          {cityError.length > 0 ? (
            cityError.map((error, index) => (
              <span
                key={index}
                className="flex-1 text-primary-dark text-xs text-right font-[400] font-alex max-w-[200px] "
              >
                {error.message}
              </span>
            ))
          ) : (
            <span className="flex-1 text-primary-dark text-xs text-right font-[400] font-alex max-w-[200px] h-8 text-wrap"></span>
          )}
        </div>
        <div className="flex-1 min-w-[220px] gap-4 flex flex-col">
          <p>العنوان *</p>
          <Input
            name="address"
            placeholder="الحي, الشارع, رقم المنزل"
            customStyles={`${
              addressError.length > 0 && "border-primary border"
            }`}
          />
          {addressError.length > 0 ? (
            addressError.map((error, index) => (
              <span
                key={index}
                className="flex-1 text-primary-dark text-xs text-right font-[400] font-alex max-w-[200px] "
              >
                {error.message}
              </span>
            ))
          ) : (
            <span className="flex-1 text-primary-dark text-xs text-right font-[400] font-alex max-w-[200px] h-8 text-wrap"></span>
          )}
        </div>
      </div>

      {/* children goes here */}
      {children}

      <ButtonPrimary
        type="button"
        className="mt-6 max-w-[190px] self-center flex items-center gap-3 pointer-events-nones"
      >
        <span className="block">{receiptImage ? "" : "تحميل الاشعار"}</span>
        {receiptImage !== null ? (
          <CheckCircle width={48} height={48} strokeWidth={3} />
        ) : (
          <CloudUpload width={48} height={48} strokeWidth={3} color="#f8f8f8" />
        )}
        <input
          type="file"
          accept="image/*"
          name="checkoutReceipt"
          id="checkoutReceipt"
          className="absolute opacity-0 not-sr-only cursor-pointer"
          onChange={(e) => setReceiptImage(e.target.files?.[0] || null)}
        />
      </ButtonPrimary>
      {receiptImage !== null && (
        <Image
          src={URL.createObjectURL(receiptImage)}
          alt="receipt"
          width={200}
          height={200}
          className="self-center w-full max-w-[72px] h-auto tablet:max-w-[200px] rounded-lg"
        />
      )}

      <ButtonPrimary
        type="submit"
        className="w-full justify-self-end self-center mt-32 max-w-[360px] h-14 bg-primary text-white rounded-[12px] text-[16px] font-alex font-[400]"
        preloader={isPending}
        disabled={isPending || receiptImage === null}
      >
        تأكيد الدفع
      </ButtonPrimary>
      {loading && <Preloader />}
    </form>
  );
}
