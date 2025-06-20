import { Footer, Header } from "@/components/ui";
import React from "react";

function ProductsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="w-full max-w-[1480px] flex flex-col items-center min-h-screen py-10 mt-10 tablet:mt-16 bg-white rounded-2xl overflow-x-hidden">
        {children}
      </main>
      <Footer />
    </>
  );
}

export default ProductsLayout;
