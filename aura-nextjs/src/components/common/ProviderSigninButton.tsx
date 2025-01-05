import React from 'react'
import { facebookIcon, google } from '@/constants/app-constants/icons';
import { Button } from '@/components/ui/shadcn/button';
import Image from 'next/image';



interface ProviderSigninButtonProps {
  provider: string;
  title: string;
  handleClick: () => void;
}

function ProviderSigninButton(
  {provider, title, handleClick}: ProviderSigninButtonProps
) {
  return (
    <Button className='w-[320px] h-[56px] py-3 px-6 rounded-[12px] flex gap-[10px] bg-surface text-foreground hover:ring-[0.5px] hover:-ring-offset-1 hover:ring-opacity-5 hover:ring-primary transition-all
    ' onClick={handleClick}>
      <Image src={provider === 'google' ? google : facebookIcon} width={24} height={24} alt={provider} />
      <span className='flex-1 text-right text-[14px] font-[400] font-alex'>{title}</span>
    </Button>
  )
}

export default ProviderSigninButton