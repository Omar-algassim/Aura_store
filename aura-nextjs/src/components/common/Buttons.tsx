'use client';
import { useState } from 'react';
import { Button } from '../ui/shadcn/button';
import { ButtonPreloader } from '../ui/Preloader';

interface BaseButtonProps {
  children: React.ReactNode;
  handleClick?: () => void;
  variant?: 'secondary' | 'link' | 'ghost' | 'outline' | 'default';
  type?: 'button' | 'submit' | 'reset';
  preloader?: boolean;
  preloaderColor?: string;
  customStyles?: string;
  disabled?: boolean;
}

interface ButtonProps {
  children: React.ReactNode;
  handleClick?: () => void;
  preloader?: boolean;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'secondary' | 'link' | 'ghost' | 'outline' | 'default';
}

function BaseButton(props: BaseButtonProps) {
  const {
    children,
    variant,
    type,
    customStyles,
    preloader,
    preloaderColor,
    handleClick,
    disabled,
  } = props;

  const [loading, setLoading] = useState(false);

  const onClick = async () => {
    if (preloader) {
      setLoading(true);
    }
    if (handleClick !== undefined) {
      await handleClick();
      setLoading(false);
    }
  };

  return (
    <Button
      disabled={disabled}
      variant={variant || 'default'}
      type={type}
      className={`relative w-full max-w-[320px] h-14 rounded-2xl flex items-center 
      justify-center gap-2 hover:bg-primary-dark hover:text-white active:bg-primary-dark active:text-white focus:outline-none focus:bg-primary-dark focus:text-white cursor-pointer transition-all duration-300 ease-linear
      ${customStyles}`}
      onClick={onClick}>
      {children}
      {loading && <ButtonPreloader color={preloaderColor} />}
    </Button>
  );
}

export function ButtonPrimary(props: ButtonProps) {
  return (
    <BaseButton
      {...props}
      disabled={props.disabled}
      customStyles={`button-primary ${props.className}`}
      type={props.type || 'submit'}
      variant={props.variant || 'default'}
    />
  );
}

export function ButtonSecondary(props: ButtonProps) {
  return (
    <BaseButton
      {...props}
      disabled={props.disabled}
      customStyles={props.className}
      type={props.type || 'submit'}
      variant={props.variant || 'outline'}
      preloaderColor='#8b0e50'
    />
  );
}
