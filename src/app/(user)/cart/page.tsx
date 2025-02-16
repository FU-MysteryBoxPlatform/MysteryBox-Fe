"use client";
import ProductInCart from "@/app/components/ProductInCart";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { GlobalContext } from "@/provider/global-provider";
import { useContext, useMemo } from "react";
import Image from "next/image";

export default function Page() {
  const { cart, toggleSelectAllProducts } = useContext(GlobalContext);
  const totalPrice = useMemo(
    () =>
      cart?.reduce(
        (acc, item) => (item.selected ? acc + item.price * item.quantity : acc),
        0
      ),
    [cart]
  );

  return (
    <div>
      <div className="max-w-[1280px] mx-auto px-4 md:px-10 lg:px-16 grid md:grid-cols-5 gap-10 py-10">
        <div className="md:col-span-3">
          <p className="text-xl font-semibold md:text-2xl lg:text-3xl mb-6 md:mb-10">
            Giỏ hàng của tôi
          </p>
          <div className="flex items-center gap-2 mb-4">
            <Checkbox
              checked={cart?.every((item) => item.selected)}
              onCheckedChange={toggleSelectAllProducts}
            />
            <p className="text-sm font-semibold">Chọn tất cả</p>
          </div>
          {cart?.length && cart?.length > 0 ? (
            <div className="grid gap-3">
              {cart?.map((item) => (
                <ProductInCart key={item.id} {...item} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-4">
              <Image
                src="/images/cart-empty.png"
                alt="empty cart"
                width={120}
                height={120}
                objectFit="cover"
              />
              <p>Không có sản phẩm nào trong giỏ hàng</p>
            </div>
          )}
        </div>
        <div className="md:col-span-2 fixed max-md:bottom-0 md:sticky max-md:w-screen bg-white max-md:left-0 p-4 self-start md:top-10">
          <p className="text-lg md:text-xl lg:text-2xl font-semibold mb-6 md:mb-10">
            Thanh toán
          </p>
          <div>
            <div className="flex items-center gap-2 justify-between mb-4">
              <p className="text-lg font-semibold">Tổng tiền:</p>
              <p className="text-xl font-bold">${totalPrice}</p>
            </div>
            <Button className="w-full bg-[#E12E43] text-white hover:bg-[#B71C32]">
              Thanh toán
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
