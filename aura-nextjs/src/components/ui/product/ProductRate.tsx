import { starIcon, starIconEmpty } from "@/constants/app-constants";
import Image from "next/image";
import React from "react";

function ProductRate({ starsNumber }: { starsNumber: number }) {
  return (
    <div className="flex w-full gap-1 items-center justify-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <Image
          key={star}
          className="w-3 h-3 object-contain object-center"
          src={star <= starsNumber ? starIcon : starIconEmpty}
          width={20}
          height={20}
          alt="star-rate"
          color="#FFA500"
        />
      ))}
    </div>
  );
}

export function SetProductRates({
  setRate,
  currentRate,
}: {
  setRate: (rate: number) => void;
  currentRate: number;
}) {
  const [currentStart, setCurrentStar] = React.useState(currentRate);
  const handleRateChange = (rate: number) => {
    // /console.log(rate);
    setRate(rate);
  };

  return (
    <div className="flex w-full gap-1 ">
      <div
        className="flex gap-1 items-center justify-center"
        onMouseLeave={() => setRate(currentRate)}
        dir="ltr"
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            onClick={() => handleRateChange(star)}
            onMouseOver={() => setCurrentStar(star)}
          >
            <path
              id="Vector"
              d="M15.3134 6.87336L15.2646 6.91755L12.0453 9.83345L11.8298 10.0286L11.8929 10.3125L12.8572 14.6537L12.8575 14.655C12.8878 14.7896 12.879 14.9305 12.8328 15.0594C12.7867 15.1881 12.706 15.297 12.6037 15.3742C12.5016 15.4512 12.382 15.4939 12.2601 15.4994C12.1383 15.5049 12.0163 15.4732 11.9091 15.4062C11.909 15.4061 11.9089 15.4061 11.9088 15.406L8.26173 13.1102L7.99507 12.9423L7.72858 13.1104L4.08981 15.406C4.08957 15.4061 4.08934 15.4063 4.08911 15.4064C3.982 15.4732 3.86017 15.5049 3.7385 15.4994C3.61653 15.4939 3.49697 15.4512 3.39489 15.3742C3.29259 15.297 3.21191 15.1881 3.16574 15.0594C3.11953 14.9305 3.11078 14.7896 3.14106 14.655L3.14135 14.6537L4.10427 10.3169L4.16724 10.0333L3.95206 9.83811L0.73208 6.91777L0.732087 6.91776L0.729654 6.91558C0.632982 6.82905 0.560797 6.71264 0.524963 6.57961C0.489104 6.44648 0.491957 6.30502 0.533012 6.17378C0.574034 6.04264 0.650589 5.9298 0.750249 5.8478C0.849684 5.76598 0.967969 5.71811 1.0899 5.70748L1.09122 5.70736L5.33551 5.32583L5.63989 5.29847L5.75435 5.01511L7.4111 0.913884L7.4114 0.913115C7.46217 0.786836 7.54661 0.681932 7.6513 0.609535C7.75575 0.537304 7.87643 0.5 7.99822 0.5C8.12 0.5 8.24068 0.537304 8.34513 0.609535C8.44982 0.681932 8.53426 0.786836 8.58502 0.913115L8.58553 0.914369L10.2473 5.0156L10.3619 5.29849L10.6659 5.32583L14.9088 5.70736L14.9101 5.70747C15.032 5.71811 15.1503 5.76598 15.2498 5.8478C15.3494 5.9298 15.426 6.04265 15.467 6.17378C15.508 6.30503 15.5109 6.44648 15.475 6.57961C15.4447 6.69208 15.3885 6.79266 15.3134 6.87336Z"
              // stroke="#FFA500"
              className={`${
                star <= currentStart
                  ? "fill-[#FFA500] hover:fill-none hover:stroke-[#FFA500]"
                  : "stroke-[#FFA500] hover:fill-[#FFA500]"
              }`}
            />
          </svg>
        ))}
      </div>
    </div>
  );
}
export default ProductRate;
