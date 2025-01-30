import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./shadcn/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "./shadcn/command";
import { Check } from "lucide-react";

interface DropdownProps {
  data: string[];
  onSelect: (value: string) => void;
  value?: string;
  disabled?: boolean;
  className?: string;
  itemClassName?: string;
  children: React.ReactNode;
}

function Dropdown(props: DropdownProps) {
  const {
    data,
    onSelect,
    value,
    className,
    itemClassName,
    children,
    disabled,
  } = props;

  const [open, setOpen] = React.useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={disabled}>
        {children}
      </PopoverTrigger>
      <PopoverContent
        className={`w-[180px] p-0 border-none shadow-xl ${className}`}
      >
        <Command className="w-full bg-surface border-none">
          {/* <CommandInput placeholder="إختار..." /> */}
          <CommandList className="w-full">
            <CommandEmpty>غير متوفر</CommandEmpty>
            <CommandGroup dir="rtl" className="w-full">
              {data.map((item, index) => (
                <CommandItem
                  key={item + index}
                  value={item}
                  onSelect={(selected) => {
                    onSelect(selected);
                    setOpen(false);
                  }}
                  className={`w-full flex ${itemClassName}`}
                >
                  {item}
                  <Check
                    className={`mr-2 h-4 w-4 ${
                      value === item ? "opacity-100" : "opacity-0"
                    }`}
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

export default Dropdown;
