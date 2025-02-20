"use client";
import CheckoutProductCard from "@/app/components/CheckoutProductCard";
import { Button } from "@/components/ui/button";
import { Order, useCheckOut } from "@/hooks/api/useCartApi";
import { toast } from "@/hooks/use-toast";
import { formatPriceVND } from "@/lib/utils";
import { GlobalContext } from "@/provider/global-provider";
import { useContext, useMemo } from "react";

export default function Page() {
  const { cart, user } = useContext(GlobalContext);
  const checkout = useCheckOut();

  const totalPrice = useMemo(() => {
    return (
      cart?.reduce(
        (acc, item) => (item.selected ? acc + item.price * item.quantity : acc),
        0
      ) || 0
    );
  }, [cart]);

  const handlePayWithVNPay = () => {
    const payload = {
      customerId: user?.id,
      paymentMethod: 0,
      note: "",
      orderDetailDtos: cart
        ?.filter((item) => item.selected)
        .map((item) => ({
          saleId: item.id,
          quantity: item.quantity,
          note: item.title,
        })),
      returnUrl: `${window.location.host}/payment`,
    } as Order;

    checkout.mutate(payload, {
      onSuccess: (data) => {
        if (data.isSuccess) {
          toast({
            title: "Tạo đơn hàng thành công!",
          });
          window.location.href = data.result;
        } else {
          toast({
            title: data.messages[0],
          });
        }
      },
    });

    console.log(payload);
  };

  const handlePayWithMomo = () => {
    console.log("pay with momo");
  };

  return (
    <div>
      <div className="max-w-[1280px] mx-auto px-4 md:px-10 lg:px-16">
        <div className="my-10">
          <p className="text-xl font-semibold md:text-2xl lg:text-3xl mb-6 md:mb-10">
            Thanh toán giỏ hàng
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-10">
            <div className="max-md:order-2">
              <p className="text-lg font-semibold md:text-xl mb-4">
                Phương thức thanh toán
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  className="bg-white text-[#E12E43] border border-[#E12E43] hover:bg-white"
                  onClick={handlePayWithVNPay}
                >
                  <img
                    src="/vnpay.png"
                    alt="vnpay"
                    className="w-16 object-cover"
                  />
                  Thanh toán với VNPay
                </Button>
                <Button
                  className="bg-white text-[#E12E43] border border-[#E12E43] hover:bg-white"
                  onClick={handlePayWithMomo}
                >
                  <img
                    src="/momo.png"
                    alt="momo"
                    className="w-4 object-cover"
                  />
                  Thanh toán với Momo
                </Button>
              </div>
            </div>
            <div>
              <p className="text-lg font-semibold md:text-xl mb-4">
                Đơn hàng của bạn
              </p>
              <div className="grid gap-3">
                {cart
                  ?.filter((item) => item.selected)
                  .map((item) => {
                    return <CheckoutProductCard key={item.id} {...item} />;
                  })}
              </div>
              <div className="flex justify-between items-center mt-2">
                <p className="text-lg font-bold">Tổng tiền:</p>
                <p className="text-lg font-semibold">
                  {formatPriceVND(totalPrice)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
