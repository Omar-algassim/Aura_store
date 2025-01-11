import { Footer } from "@/components/ui";
import React from "react";

function ProductsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="flex flex-col items-center min-h-screen py-2">
        <h1>ProductsLayout</h1>
        {children}
      </main>
      <Footer />
    </>
  );
}

export default ProductsLayout;
