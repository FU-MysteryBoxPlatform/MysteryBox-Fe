import CartIcon from "@/components/icons/CartIcon";
import { useToast } from "@/hooks/use-toast";
import { GlobalContext } from "@/provider/global-provider";
import { useContext } from "react";

export type ProductCardProps = {
  id: number;
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
        <img src={image} alt={title} />
      </div>
      <p className="text-lg font-semibold mt-2">{title}</p>
      <p className="text-sm text-gray-500">${price}</p>
    </div>
  );
}
