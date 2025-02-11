"use client";
import { ButtonSecondary } from "@/components/common/Buttons";
import React, { useEffect } from "react";
import { OrdersPage as OrdersPageLo } from "@/constants/app-constants/localization";
import { OrderCard, OrdersSkelton } from "@/components/ui/order";
import { OrderDTO } from "@/interfaces/dto";

const orderStatuses = OrdersPageLo.orderStatuses;

function OrdersPage() {
  const [orders, setOrders] = React.useState<OrderDTO[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [visibleStatus, setVisibleStatus] = React.useState("الكل");
  const [userOrderStatuses, setUserOrderStatuses] = React.useState<string[]>(
    []
  );

  useEffect(() => {
    // fetch user orders
    setOrders([]);
    setLoading(false);
    // update user order statuses to include only the order statuses that the user has
    // setUserOrderStatuses([...new Set(orders.map((order) => orderStatuses[order.order_status]))]);
    setUserOrderStatuses([...Object.values(orderStatuses)]);
  }, []);

  if (!loading && orders.length === 0) {
    // return <EmptyCart />;
    return (
      <div className="w-full flex items-center justify-center px-4 text-xl  font-semibold text-foreground">
        لا يوجد طلبات
      </div>
    );
  }

  return (
    <section className="w-full max-w-[1480px] px-0 laptop:px-[30px] flex flex-col justify-center tablet:items-center gap-4 mt-4">
      {/* filters */}
      <div className="w-full self-start max-w-[680px] flex overflow-x-scroll scroll-m-0 py-3 px-4 items-center gap-4  rounded-xl">
        {userOrderStatuses.map((status, index) => (
          <ButtonSecondary
            key={index}
            handleClick={() => setVisibleStatus(status)}
            variant="link"
            className={`text-xs max-w-fit h-8 text-foreground px-2 py-2  ${
              visibleStatus === status
                ? "bg-primary-dark font-semibold text-white"
                : "bg-surface"
            }`}
          >
            {status}
          </ButtonSecondary>
        ))}
      </div>
      {/* user orders */}
      <div className="w-full flex flex-col gap-6 items-center justify-center">
        {loading ? (
          <OrdersSkelton />
        ) : (
          orders
            .filter((order) => {
              if (visibleStatus === "all") {
                return true;
              }
              return orderStatuses[order.order_status] === visibleStatus;
            })
            .map((order, index) => <OrderCard key={index} order={order} />)
        )}
      </div>
    </section>
  );
}

export default OrdersPage;
