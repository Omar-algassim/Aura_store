import { OrderDTO } from "@/interfaces/dto";
import Image from "next/image";
import { OrdersPage } from "@/constants/app-constants/localization";
import { BaseUrl } from "@/constants/api-constants";

const STATUS_COLORS = {
  pending: "#FFA500",
  confirmed: "#05CA",
  preparing: "#8A2BE2",
  onDelivery: "#008080",
  delivered: "#24A148",
  cancelled: "#DC3545",
};

type Props = {
  order: OrderDTO;
  className?: string;
};

const OrderCard = (props: Props) => {
  return (
    <div
      className={`w-full flex flex-col items-center gap-8 bg-surface rounded-xl p-5 ${props.className}`}
    >
      {/* order num and order status */}
      <div className="w-full flex justify-between">
        <p className="text-sm font-[500] capitalize text-[#202020]">
          رقم الطلب: {props.order.id}
        </p>
        <p
          className={`text-sm font-bold capitalize`}
          style={{
            color: STATUS_COLORS[props.order.order_status],
          }}
        >
          {OrdersPage.orderStatuses[props.order.order_status]}
        </p>
      </div>

      {/* order items thumbnails and total price */}
      <div className="w-full flex justify-between items-end">
        {/* first three orders thumbnails */}
        <div className="flex gap-2">
          {props.order.order_items.slice(0, 3).map((order, index) => (
            <Image
              key={index}
              src={`${BaseUrl}${order.product.thumbnail}`}
              width={80}
              height={120}
              className="w-auto rounded-md tablet:rounded-lg max-h-16 tablet:max-h-20 object-cover object-center text-xs"
              alt={order.product.title}
            />
          ))}
        </div>
        {/* total price */}
        <p className="text-sm capitalize font-[500] text-[#202020]">
          {props.order.total_pay} SDG
        </p>
      </div>
    </div>
  );
};

export default OrderCard;
