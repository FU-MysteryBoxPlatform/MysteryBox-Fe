import { useContext } from "react";
import Counter from "./Counter";
import { ProductCardProps } from "./ProductCard";
import { GlobalContext } from "@/provider/global-provider";
import { Checkbox } from "@/components/ui/checkbox";
import { formatPriceVND } from "@/lib/utils";

export default function ProductInCart({
  id,
  image,
  title,
  price,
  quantity,
  selected,
}: ProductCardProps & { quantity: number; selected: boolean }) {
  const { addToCart, removeFromCart, toggleSelectProduct } =
    useContext(GlobalContext);

  return (
    <div>
      <div className="flex items-start gap-4">
        <Checkbox
          defaultChecked={selected}
          checked={selected}
          onCheckedChange={() => {
            toggleSelectProduct(id);
          }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={title}
          className="w-[120px] h-[120px] rounded-lg"
        />
        <div className="grid gap-2 flex-1">
          <p className="font-semibold text-lg">{title}</p>
          <p className="text-sm text-gray-500">{formatPriceVND(price)}</p>
          <Counter
            count={quantity}
            onIncrease={() => {
              addToCart({ id, image, title, price });
            }}
            onDecrease={() => {
              removeFromCart(id, 1);
            }}
          />
          <button
            className="underline ml-auto text-red-500 text-sm"
            onClick={() => {
              removeFromCart(id);
            }}
          >
            Xoá
          </button>
        </div>
      </div>
      <div className="w-full h-[1px] bg-gray-300 mt-3"></div>
    </div>
  );
}
