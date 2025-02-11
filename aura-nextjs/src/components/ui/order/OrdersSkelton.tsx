import { Skeleton } from "@/components/ui/shadcn/skeleton";

const OrdersSkelton = () => {
  return (
    <div className="w-full flex flex-col items-center gap-8 bg-secondary-light rounded-xl p-5">
      {Array.from({ length: 10 }).map((_, index) => (
        <Skeleton
          key={index}
          className="w-full min-h-40 p-6 flex flex-col gap-10 justify-between bg-surface"
        >
          <div className="w-full flex justify-between">
            <Skeleton className="w-32 tablet:w-72 h-10 tablet:h-12 rounded-lg bg-[#b9c1e4]" />
            <Skeleton className="w-16 tablet:w-24 h-8 tablet:h-12 rounded-lg bg-[#b9c1e4]" />
          </div>

          {/* order items thumbnails and total price */}
          <div className="w-full gap-3 flex justify-between items-end">
            {/* first three orders thumbnails */}
            <Skeleton className="w-72 h-12 tablet:h-32 rounded-lg bg-[#b9c1e4]" />
            {/* total price */}
            <Skeleton className="w-20 h-6 tablet:h-10  rounded-lg bg-[#b9c1e4]" />
          </div>
        </Skeleton>
      ))}
    </div>
  );
};

export default OrdersSkelton;
