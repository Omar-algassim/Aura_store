import { useState } from "react";
import { Input } from "../ui/shadcn/input";
import { Eye, EyeClosed } from "lucide-react";

interface InputProps {
  name: string;
  type?: "text" | "password" | "number" | "email" | "tel";
  hidden?: boolean;
  defaultValue?: string;
  placeholder?: string;
  customStyles?: string;
  value?: string | number;
  readonly?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function InputComponent(props: InputProps) {
  const { name, type, placeholder, customStyles, value, defaultValue } = props;

  const [showPassword, setShowPassword] = useState(false);
  const [inputType, setInputType] = useState(type);
  return (
    <div
      className={`w-full max-width-[320px] h-14 flex items-center justify-center rounded-[12px] border-none bg-surface text-foreground text-[16px] text-right font-[400] font-alex ${customStyles} ${
        props.hidden && "hidden"
      } `}
    >
      <Input
        readOnly={props.readonly}
        hidden={props.hidden}
        formNoValidate
        value={value}
        defaultValue={defaultValue}
        placeholder={placeholder}
        type={inputType || "text"}
        name={name}
        onChange={props.onChange}
        className={`w-full max-width-[320px] h-14 flex items-center justify-center rounded-[12px] border-none bg-surface text-foreground text-[16px] text-right font-[400] font-alex ${customStyles} `}
      />
      {type === "password" &&
        (showPassword ? (
          <Eye
            size={24}
            color="#ac93ba"
            onClick={() => {
              setShowPassword(false);
              setInputType("password");
            }}
            className="cursor-pointer ml-4"
          />
        ) : (
          <EyeClosed
            size={22}
            color="#ac93ba"
            onClick={() => {
              setShowPassword(true);
              setInputType("text");
            }}
            className="cursor-pointer ml-4"
          />
        ))}
    </div>
  );
}

export default InputComponent;
