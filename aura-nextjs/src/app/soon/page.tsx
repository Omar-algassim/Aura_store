'use client'
import React from "react";
import Image from "next/image";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export const Construction = () => {
  return (
    <DotLottieReact
      src="https://lottie.host/fcaefb41-f147-4bc0-932f-9f4ac86782f9/lGAZqi31bQ.lottie"
      loop
      autoplay
    />
  );
};

export default function Soon() {
  return (
    <div>
      <div className='flex flex-col items-center justify-center h-screen w-screen bg-primary-light gap-8'>
        <Image src='/images/soon.svg' alt='soon' width={50} height={50} />
        <div className="flex flex-wrap justify-center items-center gap-1">
          <div className="size-[10px] rounded-full bg-primary animate-caret-blink"></div>
          <div className="size-[10px] rounded-full bg-primary animate-caret-blink delay-100"></div>
          <div className="size-[10px] rounded-full bg-primary animate-caret-blink delay-300"></div>
        </div>
          <div className="w-[150px] h-[150px] absolute bottom-10">
            <Construction />
            <h1 className='text-[20px] text-primary text-center'>قريباً</h1>
          </div>
      </div>
    </div>
  );
}