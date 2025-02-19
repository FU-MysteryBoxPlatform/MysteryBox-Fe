import CartIcon from "@/components/icons/CartIcon";
import { useToast } from "@/hooks/use-toast";
import { formatPriceVND } from "@/lib/utils";
import { GlobalContext } from "@/provider/global-provider";
import { useRouter } from "next/navigation";
import { useContext } from "react";

export type ProductCardProps = {
  id: string;
  image: string;
  title: string;
  price: number;
};
export default function ProductCard({
  id,
  image,
  title,
  price,
}: ProductCardProps) {
  const { addToCart } = useContext(GlobalContext);
  const { toast } = useToast();
  const route = useRouter();
  return (
    <div className="flex flex-col">
      <div className="relative">
        <div
          className="absolute top-2 right-2 p-1 bg-gray-200 rounded-lg flex items-center justify-center cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            addToCart({ id, image, title, price });
            toast({
              title: "Thêm vào giỏ hàng thành công!",
            });
          }}
        >
          <CartIcon className="" />
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={title}
          onClick={() => route.push(`/sale-detail/${id}`)}
          className="cursor-pointer"
        />
      </div>
      <p className="text-lg font-semibold mt-2">{title}</p>
      <p className="text-sm text-gray-500">{formatPriceVND(price)}</p>
    </div>
  );
}
