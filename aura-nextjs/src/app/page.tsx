import { Footer } from "@/components/ui";
import React from "react";

function Home() {
  return (
    <>
      <main className="flex flex-col items-center justify-center min-h-screen py-2">
        <div className="flex-1 tablet:w-full desktop:max-w-screen-laptop">
          <div className="text-center flex flex-col gap-8">
            <h1 className="text-4xl font-bold">مرحبا بكم من اورا</h1>
            <p className="text-lg">متجر لي مستحضرات التجميل في السودان</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Home;
