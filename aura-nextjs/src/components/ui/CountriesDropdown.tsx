"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/shadcn/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/shadcn/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/shadcn/popover";
import { countriesCode } from "@/constants/app-constants";

export function CountriesDropdown(props: {
  className?: string;
  setCountryKey: (code: string) => void;
}) {
  const { setCountryKey } = props;
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [currentCountry, setCurrentCountry] = React.useState<{
    country: string;
    icon: string;
    value: string;
    code: string;
  }>({ country: "", icon: "", value: "", code: "" });

  // // /console.log("currentCountry", JSON.stringify(currentCountry, null, 2));
  // // /console.log("value", value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[120px] tablet:w-[180px] h-14 flex items-center justify-center rounded-[12px] border-none bg-surface text-foreground text-[12px] tablet:text-[14px] text-right px-2 font-[400] font-alex shadow-slate-500 hover:shadow-sm hover:shadow-slate-500 hover:bg-surface active:shadow-slate-500 active:bg-surface focus:outline-none focus:shadow-slate-500 focus:bg-surface transition-all duration-200 gap-1"
        >
          <ChevronsUpDown className="h-6 w-6 shrink-0 opacity-50" />
          {value ? (
            <div dir="ltr" className="flex gap-2 flex-1">
              <span className="block text-[18px]">{currentCountry.icon}</span>
              <span className="block text-[18px] font-[500]">
                {currentCountry.code}
              </span>
              <span className="block text-[18px] font-[600]">
                {currentCountry.value}
              </span>
            </div>
          ) : (
            "مفتاح الدولة"
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[180px] p-0 border-none shadow-xl shadow-[#00000070]">
        <Command className="w-full bg-surface border-none">
          <CommandInput placeholder="إختار رمز الدولة..." />
          <CommandList className="w-full">
            <CommandEmpty>غير متوفر</CommandEmpty>
            <CommandGroup dir="ltr" className="w-full">
              {countriesCode.map((countryCode, index) => (
                <CommandItem
                  key={countryCode.value + index}
                  value={countryCode.country}
                  onSelect={(selected) => {
                    setValue(selected === value ? "" : selected);
                    setCurrentCountry(
                      currentCountry.country === selected
                        ? { country: "", icon: "", value: "", code: "" }
                        : countryCode
                    );
                    setCountryKey(countryCode.value);
                    setOpen(false);
                  }}
                  className="w-full flex"
                >
                  <div className="flex gap-2 flex-1">
                    <span className="block">{countryCode.icon}</span>
                    <span className="block font-[400]">{countryCode.code}</span>
                    <span className="block font-[600]">
                      {countryCode.value}
                    </span>
                  </div>
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === countryCode.country
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                    strokeWidth={3}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
