import React from "react";
import { Header } from "@/components/ui/Header";

function CartLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="w-full flex flex-col items-center justify-center  max-w-[1440px] mb-20">
        {children}
      </main>
    </>
  );
}

export default CartLayout;
