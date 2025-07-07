'use client';
import { Suspense } from 'react';

import { ConfirmPhonePage } from '@/components/ui/auth/ConfirmPhonePage';
import { Preloader } from '@/components/ui/Preloader';

function Page() {
  return (
    <Suspense fallback={<Preloader />}>
      <ConfirmPhonePage />
    </Suspense>
  );
}
export default Page;
