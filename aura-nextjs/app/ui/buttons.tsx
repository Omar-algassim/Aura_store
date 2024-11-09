import Link from 'next/link';
import React from 'react'

// Interfaces
interface ButtonParams {
  href?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  styles?: string;
  children: React.ReactNode;
};

export function ButtonSolid( params: ButtonParams) {
  const className = `button ${params.styles || 'button button-solid'}`;
  if (params.href) {
    return (
      <Link href={params.href} className={className}>
        {params.children}
      </Link>
    );
  }

  return (
    <button
      type={params.type || 'button'}
      onClick={params.onClick}
      disabled={params.disabled}
      className={className}
    >
      {params.children}
    </button>
  )
}
