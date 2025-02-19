import { formatPriceVND } from "@/lib/utils";
import { ProductCardProps } from "./ProductCard";
import Link from "next/link";

export default function CheckoutProductCard({
  id,
  image,
  title,
  price,
  quantity,
}: ProductCardProps & { quantity: number; selected: boolean }) {
  return (
    <Link href={`/sale-detail/${id}`}>
      <div>
        <div className="flex items-start gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt={title}
            className="w-[120px] h-[120px] rounded-lg"
          />
          <div className="grid gap-2 flex-1">
            <p className="font-semibold text-lg">{title}</p>
            <p className="text-sm text-gray-500">{formatPriceVND(price)}</p>
            <p className="text-sm font-semibold">Số lượng: {quantity}</p>
          </div>
        </div>
        <div className="w-full h-[1px] bg-gray-300 mt-3"></div>
      </div>
    </Link>
  );
}
