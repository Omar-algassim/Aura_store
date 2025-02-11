import { OrderDTO } from "@/interfaces/dto";
import Image from "next/image";

const STATUS_COLORS = {
  pending: "#FFA500",
  confirmed: "#06C",
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
      className={`w-full flex flex-col items-center gap-8 bg-secondary-light rounded-xl p-5 ${props.className}`}
    >
      {/* order num and order status */}
      <div className="w-full flex justify-between">
        <p className="text-sm font-[500] capitalize text-foreground">
          رقم الطلب: {props.order.documentId}
        </p>
        <p
          className={`text-sm font-bold text-${
            STATUS_COLORS[props.order.order_status]
          }`}
        ></p>
      </div>

      {/* order items thumbnails and total price */}
      <div className="w-full flex justify-between items-center">
        {/* first three orders thumbnails */}
        <div className="max-h-12 flex gap-3">
          {props.order.order_items.slice(0, 3).map((order, index) => (
            <Image
              key={index}
              src={order.product.thumbnail}
              width={80}
              height={120}
              className="w-auto max-h-10"
              alt={order.product.title}
            />
          ))}
        </div>
        {/* total price */}
        <p className="text-sm capitalize font-[500] text-foreground">
          {props.order.total_pay} SDG
        </p>
      </div>
    </div>
  );
};

export default OrderCard;
