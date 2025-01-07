'use client';
import { useState } from "react";
import { Button } from "../ui/shadcn/button";
import { ButtonPreloader } from "../ui/Preloader";


interface BaseButtonProps {
  children: React.ReactNode;
  handleClick?: () => void;
  variant?:  'secondary';
  type?: 'button' | 'submit' | 'reset';
  preloader?: boolean;
  customStyles?: string;
  disabled?: boolean;
}

interface ButtonProps {
  children: React.ReactNode;
  handleClick?: () => void;
  preloader?: boolean;
  className?: string;
  disabled?:boolean
}


function BaseButton(props: BaseButtonProps) {
  const {
    children,
    variant,
    type,
    customStyles,
    preloader,
    handleClick,
    disabled} = props;

  const [loading, setLoading] = useState(false);

  const onClick = () => {
    if (preloader) {
      setLoading(true);
    }
    if (handleClick !== undefined) {
      handleClick();
    }
  }

  return (
    <Button disabled={disabled} variant={variant || "default"} type={type}
      className={`w-full max-w-[320px] h-14 rounded-[12px] flex items-center 
      justify-center gap-2 hover:bg-primary-dark hover:text-white active:bg-primary-dark active:text-white focus:outline-none focus:bg-primary-dark focus:text-white
      ${variant !== 'secondary'
      ? 'bg-primary text-white'
      : 'bg-surface text-primary-dark border-2 border-primary-dark'}
      ${customStyles}`}
      onClick={onClick}
    >
      {children}
      {loading && <ButtonPreloader />}
    </Button>
  )
}

export function ButtonPrimary(props: ButtonProps) {
  return (
    <BaseButton {...props} disabled={props.disabled} customStyles={props.className} type="submit" />
  );
}

export function ButtonSecondary(props: ButtonProps) {
  return (
    <BaseButton {...props} disabled={props.disabled} customStyles={props.className} variant='secondary' type="submit" />
  );
}