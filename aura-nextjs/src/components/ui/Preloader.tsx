import React from 'react';
import { ColorRing, Oval } from 'react-loader-spinner';

export function Preloader() {
  return (
    <div className='absolute top-0 left-0 w-full h-full bg-[#00000050] bg-opacity-90 flex items-center justify-center z-50'>
      <ColorRing
        visible={true}
        height="80"
        width="80"
        ariaLabel="color-ring-loading"
        wrapperStyle={{}}
        wrapperClass="color-ring-wrapper"
        colors={['#d5167b', '#8b0e50', '#ac93ba', '#ffeee7', '']}
        />
    </div>
  )
}

export function ButtonPreloader() {
  return (
    <Oval
      visible={true}
      height="16"
      width="16"
      color="#ffeee7"
      ariaLabel="loading"
      />
  )
}