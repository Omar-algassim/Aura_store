'use client';
import React from 'react';
import { Footer, Header } from '@/components/ui';

function ProfileLayout({ children }: { children: React.ReactNode }) {
  // const router = useRouter();
  // const user = useUser();
  // const userDispatcher = useUserDispatch();
  // const cart = useCart() as CartEntity;
  // const cartDispatcher = useCartDispatcher();

  // const logout = () => {
  //   userDispatcher({ type: "LOGOUT", payload: {} });
  //   cartDispatcher({ type: "DELETE", payload: { cart } });
  //   router.push("/");
  // };
  return (
    <>
      <Header />
      <div className='w-full max-w-[1480px] min-h-svh flex flex-col items-center px-[17px] mt-10 laptop:px-0 bg-white rounded-2xl gap-[60px]'>
        {children}
      </div>
      <Footer />
    </>
  );
}

export default ProfileLayout;
