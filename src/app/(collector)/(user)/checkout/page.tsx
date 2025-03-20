"use client";
import CheckoutProductCard from "@/app/components/CheckoutProductCard";
import { Button } from "@/components/ui/button";
import { OrderRequest, useCheckOut } from "@/hooks/api/useCartApi";
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

  const handleCheckOut = (isMomo: boolean) => {
    const payload = {
      customerId: user?.id,
      paymentMethod: isMomo ? 1 : 0,
      blindBoxOrderDetails: cart
        ?.filter((item) => item.selected && item.collectionId)
        .map((item) => ({
          collectionId: item.collectionId,
          quantity: item.quantity,
        })),
      orderDetailDtos: cart
        ?.filter((item) => item.selected && item.saleId)
        .map((item) => ({
          saleId: item.saleId,
        })),
      returnUrl: `${window.location.host}`.includes("localhost")
        ? `http://${window.location.host}/payment`
        : `https://${window.location.host}/payment`,
    } as OrderRequest;

    checkout.mutate(payload, {
      onSuccess: (data) => {
        if (data.isSuccess) {
          toast({ title: "Tạo đơn hàng thành công!" });
          if (data.result) window.location.href = data.result;
        } else {
          toast({ title: data.messages[0], variant: "destructive" });
        }
      },
    });
  };

  const handlePayWithVNPay = () => handleCheckOut(false);
  const handlePayWithMomo = () => handleCheckOut(true);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Thanh Toán Giỏ Hàng
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Đơn hàng */}
          <div className="order-2 lg:order-1">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Đơn Hàng Của Bạn
            </h2>
            {cart?.filter((item) => item.selected).length === 0 ? (
              <div className="text-center py-12 text-gray-600">
                Bạn chưa chọn sản phẩm nào để thanh toán.
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {cart
                    ?.filter((item) => item.selected)
                    .map((item) => (
                      <CheckoutProductCard
                        key={item.collectionId || item.saleId}
                        {...item}
                      />
                    ))}
                </div>
                <div className="flex justify-between items-center mt-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <p className="text-lg font-bold text-gray-900">Tổng tiền:</p>
                  <p className="text-xl font-semibold text-emerald-600">
                    {formatPriceVND(totalPrice)}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Phương thức thanh toán */}
          <div className="order-1 lg:order-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Phương Thức Thanh Toán
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <Button
                variant="outline"
                className="flex items-center justify-center gap-3 py-6 bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 shadow-sm rounded-lg transition-all"
                onClick={handlePayWithVNPay}
              >
                <img
                  src="/vnpay.png"
                  alt="VNPay"
                  className="w-12 h-6 object-contain"
                />
                <span className="text-base font-medium">
                  Thanh toán với VNPay
                </span>
              </Button>
              <Button
                variant="outline"
                className="flex items-center justify-center gap-3 py-6 bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 shadow-sm rounded-lg transition-all"
                onClick={handlePayWithMomo}
              >
                <img
                  src="/momo.png"
                  alt="Momo"
                  className="w-6 h-6 object-contain"
                />
                <span className="text-base font-medium">
                  Thanh toán với Momo
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
