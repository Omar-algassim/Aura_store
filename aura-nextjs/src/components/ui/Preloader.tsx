"use client";
import React from "react";
import { ColorRing, Oval, RotatingLines } from "react-loader-spinner";

export function Preloader() {
  return (
    <div className="absolute -top-4 bottom-0 left-0 min-w-full min-h-screen bg-[#00000050] bg-opacity-90 flex items-center justify-center z-50">
      <ColorRing
        visible={true}
        height="80"
        width="80"
        ariaLabel="color-ring-loading"
        wrapperStyle={{}}
        wrapperClass="color-ring-wrapper"
        colors={["#8b0e50", "#d5167b", "#d5167b", "#f2f2f2", "#f2f2f2"]}
      />
    </div>
  );
}

export function ButtonPreloader(props: { color?: string }) {
  return (
    <Oval
      visible={true}
      height="24"
      width="24"
      strokeWidth={5}
      secondaryColor="#f2f2f2"
      color={`${props.color || "#ffeee7"}`}
      ariaLabel="loading"
    />
  );
}
