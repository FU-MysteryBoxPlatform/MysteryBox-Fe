import { useContext } from "react";
import Counter from "./Counter";
import { ProductCardProps } from "./ProductCard";
import { GlobalContext } from "@/provider/global-provider";
import { Checkbox } from "@/components/ui/checkbox";
import { formatPriceVND } from "@/lib/utils";
import Link from "next/link";

export default function ProductInCart({
  saleId,
  image,
  title,
  price,
  quantity,
  selected,
  collectionId,
}: ProductCardProps & { quantity: number; selected: boolean }) {
  const {
    addToCart,
    removeFromCart,
    toggleSelectProduct,
    removeFromCartBlindbox,
  } = useContext(GlobalContext);

  return (
    <div>
      <div className="flex items-start gap-4">
        <Checkbox
          defaultChecked={selected}
          checked={selected}
          onCheckedChange={() => {
            toggleSelectProduct(saleId || collectionId || "");
          }}
        />
        <Link href={`/sale-detail/${saleId}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt={title}
            className="w-[120px] h-[120px] rounded-lg"
          />
        </Link>
        <div className="grid gap-2 flex-1">
          <p className="font-semibold text-lg">{title}</p>
          <p className="text-sm text-gray-500">{formatPriceVND(price)}</p>
          <Counter
            count={quantity}
            onIncrease={() => {
              debugger;
              addToCart({
                saleId: saleId,
                image,
                title,
                price,
                collectionId: collectionId,
              });
            }}
            onDecrease={() => {
              if (collectionId) {
                removeFromCartBlindbox(collectionId);
              } else if (saleId) {
                removeFromCart(saleId);
              }
            }}
          />
          <button
            className="underline ml-auto text-red-500 text-sm"
            onClick={() => {
              if (collectionId) {
                removeFromCartBlindbox(collectionId);
              } else if (saleId) {
                removeFromCart(saleId);
              }
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
