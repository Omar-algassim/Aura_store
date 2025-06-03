"use client";
import React from "react";
import cookie from "js-cookie";
import { ArrowDownIcon } from "lucide-react";
import { ButtonPrimary } from "@/components/common/Buttons";
import InputComponent from "@/components/common/Input";
import { useUser, useUserDispatch } from "@/components/context";
import Dropdown from "@/components/ui/Dropdown";
import { updateUser } from "@/utils/services/user-services";
import { useRouter } from "next/navigation";
import WorldWideDropdown from "@/components/ui/wideWorldDropdown";
import { getAvailableCities } from "@/utils/services/available-region";

function AddressBook() {
  const router = useRouter();
  const user = useUser();
  const userDispatcher = useUserDispatch();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [availableCities, setAvailableCities] = React.useState<string[]>([]);
  const [region, setRegion] = React.useState(user.location?.region || "");
  const [city, setCity] = React.useState(user.location?.city || "");
  const [address, setAddress] = React.useState(user.location?.address || "");

  React.useEffect(() => {
    if (!region) { 
      setAvailableCities([]) 
      return;
    }
    // fetch available cities
    const fetchCities = async () => {
      const cities = await getAvailableCities(region);
      console.log("cities", cities);
      setAvailableCities(cities);
    };
    fetchCities();
  }, [region]);

  React.useEffect(() => {
    // fetch available regions
    setRegion(user.location?.region || "");
    // fetch available cities
    setLoading(false);
  }, [user]);

  // React.useEffect(() => {
  //   // if (!city) setCity(user.location?.city || availableCities[0]);
  //   setRegion(user.location?.region || "");
  //   setAddress(user.location?.address || "");
  // }, [city, user]);

  const saveUpdates = async () => {
    const jwt = cookie.get("jwt");
    if (!jwt) {
      alert("يجب تسجيل الدخول أولا");
      router.replace("/login");
      return;
    }
    console.log(`Updating user ${user.documentId} with new location`, {
      region,
      city,
      address,
    });
    const { error, data } = await updateUser(jwt, user.documentId, {
      location: { region, city, address },
    });
    if (error || !data) {
      console.error("Error updating user", error);
      setError(error);
      return;
    }
    console.info("User updated successfully", data);
    user.location = { region, city, address };
    // if email updated, prompt for email confirmation
    // email confirmed, update user data
    // if phone updated, prompt for phone confirmation
    // phone confirmed, update user data
    userDispatcher({
      type: "UPDATE",
      payload: {
        userData: user,
      },
    });
  };

  return loading ? null : (
    <section className="w-full max-w-[1480px] px-0 laptop:px-[30px] flex flex-col justify-center tablet:items-center gap-4 mt-5 tablet:mt-14">
      {/* region and city */}
      <div className="w-full max-w-[640px] flex flex-col items-center justify-center gap-3">
        <div className="w-full flex justify-between items-center gap-4">
          {/* region */}
          <div className="basis-1/2 flex flex-col items-start justify-center gap-2">
            <h3 className="text-lg font-[500] text-right">الدولة *</h3>
            <WorldWideDropdown
              setCountryKey={(region: string) => setRegion(region)}
              defaultValue={region}
              triggerStyle="w-[250px] h-[54px] bg-surface border-none rounded-[12px] px-6 py-3"
            />
            {/* <Dropdown
              data={availableRegions}
              disabled={availableRegions.length <= 1}
              onSelect={(selected) => setRegion(selected)}
              value={region}
              className="w-full"
            >
              <button
                className="flex items-center justify-between w-[134px] h-[54px] bg-surface border-none rounded-[12px] px-6 py-3"
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
            </Dropdown> */}
          </div>

          {/* cities */}
          <div className="basis-1/2 flex flex-col items-center justify-center gap-2">
            <h3 className="text-lg font-[500] text-right">المدينة *</h3>
            <Dropdown
              data={availableCities}
              disabled={availableCities?.length <= 1}
              onSelect={(selected) => setCity(selected)}
              value={city}
              className="w-full"
            >
              <button
                className="flex items-center justify-between w-[134px] h-[54px] bg-surface border-none rounded-[12px] px-6 py-3 font-[400] disabled:opacity-50 group"
                disabled={availableCities?.length <= 1}
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
          </div>
        </div>
        {/* description */}
        <div className="self-start  flex flex-1 max-w-[296px] items-center justify-center">
          <p className="text-xs font-[400] opacity-85">
            نطاق التوصيل يشمل مدينة بورتسودان فقط في الوقت الراهن. نعمل على
            توسيع نطاق خدماتنا قريبا
          </p>
        </div>
      </div>

      {/* address */}
      <div className="w-full max-w-[640px] flex flex-col justify-center items-start gap-4">
        <h3 className="w-full text-right text-lg font-[500]">العنوان *</h3>
        <InputComponent
          name="address"
          type="text"
          value={address}
          placeholder="الحي، الشارع، رقم المنزل"
          onChange={(e) => setAddress(e.target.value)}
          customStyles="text-xs leading-10 max-w-[560px]"
        />
      </div>

      {/* submit button */}
      <div className="w-full max-w-[640px] flex justify-center items-center tablet:justify-start mt-10">
        <ButtonPrimary
          className="items-center justify-center"
          handleClick={saveUpdates}
          preloader
        >
          حفظ
        </ButtonPrimary>
      </div>
    </section>
  );
}

export default AddressBook;
