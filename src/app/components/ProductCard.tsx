import CartIcon from "@/components/icons/CartIcon";
import { useToast } from "@/hooks/use-toast";
import { formatPriceVND } from "@/lib/utils";
import { GlobalContext } from "@/provider/global-provider";
import { useRouter } from "next/navigation";
import { useContext } from "react";

export type ProductCardProps = {
  saleId?: string;
  image: string;
  title: string;
  price: number;
  collectionId?: string;
};
export default function ProductCard({ saleId, image, title, price,collectionId }: ProductCardProps) {
  const { addToCart } = useContext(GlobalContext);
  const { toast } = useToast();
  const route = useRouter();
  return (
    <div className="flex flex-col">
      <div className="relative">
        <div
          className="absolute top-2 right-2 p-2 bg-gray-200 rounded-sm flex items-center justify-center cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            addToCart({
              saleId: saleId,
              image,
              title,
              price,
              collectionId: collectionId,
            });
            toast({
              title: "Thêm vào giỏ hàng thành công!",
            });
          }}
        >
          <CartIcon className="w-4 h-4" />
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={title}
          loading="lazy"
          onClick={() => route.push(`/sale-detail/${saleId}`)}
          className="cursor-pointer aspect-square object-cover w-full"
        />
      </div>
      <p className="text-lg font-semibold mt-2">{title}</p>
      <p className="text-sm text-gray-500">{formatPriceVND(price)}</p>
    </div>
  );
}
