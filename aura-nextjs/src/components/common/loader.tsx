import React from "react";

export function Loader() {
 
    return(
    <div className="flex flex-wrap justify-center items-center gap-1">
        <div className="size-[5px] rounded-full bg-primary animate-caret-blink"></div>
        <div className="size-[5px] rounded-full bg-primary animate-caret-blink delay-100"></div>
        <div className="size-[5px] rounded-full bg-primary animate-caret-blink delay-300"></div>
    </div>
)
}