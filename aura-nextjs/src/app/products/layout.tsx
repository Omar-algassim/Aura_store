import { Footer, Header } from "@/components/ui";
import React from "react";

function ProductsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="w-full max-w-[1400px] flex flex-col items-center min-h-screen py-2 mt-10 tablet:mt-20 bg-white">
        <h1>ProductsLayout</h1>
        {children}
      </main>
      <Footer />
    </>
  );
}

export default ProductsLayout;
