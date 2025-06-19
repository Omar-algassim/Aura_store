import { Header } from '@/components/ui';
import { Toaster } from '@/components/ui/shadcn/toaster';
import React from 'react';

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className='w-full min-h-svh flex flex-col items-center bg-surface gap-12'>
      {/* only the navbar */}
      <Header />
      <section className='flex flex-col items-center w-full px-4 tablet:px-9 tablet:w-full desktop:max-w-[1280px]'>
        {children}
      </section>
      <Toaster />
    </main>
  );
}

export default AuthLayout;
