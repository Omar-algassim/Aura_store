'use client';
import { Suspense } from 'react';

import { ConfirmEmailPage } from '@/components/ui/auth/ConfirmEmailPage';
import { Preloader } from '@/components/ui/Preloader';

function EmailConfirmationPage() {
  return (
    <Suspense fallback={<Preloader />}>
      <ConfirmEmailPage />
    </Suspense>
  );
}
export default EmailConfirmationPage;
