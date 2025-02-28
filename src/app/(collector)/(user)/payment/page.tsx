"use client";

import LoadingIndicator from "@/app/components/LoadingIndicator";
import { Button } from "@/components/ui/button";
import { useUpdateTransaction } from "@/hooks/api/useCartApi";
import { useToast } from "@/hooks/use-toast";
import { GlobalContext } from "@/provider/global-provider";
import dayjs from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useContext, useEffect, useState } from "react";
export type MomoPaymentResponse = {
  partnerCode: string;
  orderId: string;
  requestId: string;
  amount: string;
  orderInfo: string;
  orderType: string;
  transId: string;
  resultCode: string;
  message: string;
  payType: string;
  responseTime: string;
  extraData: string;
  signature: string;
};
export type VnPayQueryParams = {
  vnp_Amount?: string;
  vnp_BankCode?: string;
  vnp_BankTranNo?: string;
  vnp_CardType?: string;
  vnp_OrderInfo?: string;
  vnp_PayDate?: string;
  vnp_ResponseCode?: string;
  vnp_TmnCode?: string;
  vnp_TransactionNo?: string;
  vnp_TransactionStatus?: string;
  vnp_TxnRef?: string;
  vnp_SecureHash?: string;
};
export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setCart } = useContext(GlobalContext);
  const { toast } = useToast();

  // State lưu dữ liệu thanh toán
  const [data, setData] = useState({} as MomoPaymentResponse);
  const [dataVNPay, setDataVNPay] = useState({} as VnPayQueryParams);
  const [isReady, setIsReady] = useState(false);

  // Kiểm tra trạng thái thanh toán thành công
  const isSuccess = searchParams.get("resultCode") === "0";
  const isVNPaySuccess = searchParams.get("vnp_ResponseCode") === "00";

  // Lấy ID giao dịch
  const transactionId = data.extraData || dataVNPay.vnp_TxnRef || "";
  const checkout = useUpdateTransaction(transactionId, isSuccess || isVNPaySuccess ? 1 : 2);

  // Lấy dữ liệu từ URL
  useEffect(() => {
    if (!searchParams) return;

    setData({
      partnerCode: searchParams.get("partnerCode") || "",
      orderId: searchParams.get("orderId") || "",
      requestId: searchParams.get("requestId") || "",
      amount: searchParams.get("amount") || "",
      orderInfo: searchParams.get("orderInfo") || "",
      orderType: searchParams.get("orderType") || "",
      transId: searchParams.get("transId") || "",
      resultCode: searchParams.get("resultCode") || "",
      message: searchParams.get("message") || "",
      payType: searchParams.get("payType") || "",
      responseTime: searchParams.get("responseTime") || "",
      extraData: searchParams.get("extraData") || "",
      signature: searchParams.get("signature") || "",
    });

    setDataVNPay({
      vnp_Amount: searchParams.get("vnp_Amount") || "",
      vnp_BankCode: searchParams.get("vnp_BankCode") || "",
      vnp_BankTranNo: searchParams.get("vnp_BankTranNo") || "",
      vnp_CardType: searchParams.get("vnp_CardType") || "",
      vnp_OrderInfo: searchParams.get("vnp_OrderInfo") || "",
      vnp_PayDate: searchParams.get("vnp_PayDate") || "",
      vnp_ResponseCode: searchParams.get("vnp_ResponseCode") || "",
      vnp_TmnCode: searchParams.get("vnp_TmnCode") || "",
      vnp_TransactionNo: searchParams.get("vnp_TransactionNo") || "",
      vnp_TransactionStatus: searchParams.get("vnp_TransactionStatus") || "",
      vnp_TxnRef: searchParams.get("vnp_TxnRef") || "",
    });

    // Đánh dấu dữ liệu đã sẵn sàng
    setIsReady(true);
  }, [searchParams]);

  // Chỉ gọi API khi dữ liệu đã sẵn sàng
  useEffect(() => {
    if (!isReady || !transactionId) return;

    debugger;
    checkout.mutate(
      { transactionId, transactionStatus: isSuccess || isVNPaySuccess ? 1 : 2 },
      {
        onSuccess: (data) => {
            if(data.isSuccess) {
              setCart([]);
            }
            toast({ title: data.messages[0] });
        },
      }
    );
  }, [isReady, transactionId]);

  return (
    <Suspense>
      <div className="max-w-[1280px] mx-auto px-4 md:px-10 lg:px-16 h-[90vh] flex items-center justify-center">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between lg:gap-48">
          <div className="flex flex-col max-lg:items-center">
            <p className="text-lg md:text-xl lg:text-2xl font-bold text-center lg:text-left">
              {isSuccess || isVNPaySuccess
                ? "Thanh toán thành công!"
                : "Thanh toán thất bại!"}
            </p>
            {checkout.isPending && <LoadingIndicator />}
            <div className="text-sm my-4 text-center lg:text-left">
              <p>
                Mã giao dịch:{" "}
                <span className="font-semibold">{transactionId || "N/A"}</span>
              </p>
              <p>
                Ngày tạo:{" "}
                <span className="font-semibold">
                  {data.responseTime
                    ? dayjs(Number(data.responseTime)).format(
                        "DD/MM/YYYY HH:mm"
                      ) || dataVNPay.vnp_PayDate
                    : "N/A"}
                </span>
              </p>
              <p>
                Phương thức thanh toán:{" "}
                <span className="font-semibold">
                  {data.partnerCode || dataVNPay ? "VNPAY" : "N/A"}
                </span>
              </p>
            </div>

            <Button
              className={`max-lg:mx-auto ${
                isSuccess || isVNPaySuccess
                  ? "bg-[#E12E43] hover:bg-[#B71C32] text-white"
                  : ""
              }`}
              onClick={() => router.push("/")}
            >
              {isSuccess || isVNPaySuccess
                ? "Tiếp tục mua sắm"
                : "Quay lại trang chủ"}
            </Button>
          </div>
          <img
            src={
              isSuccess || isVNPaySuccess
                ? "/images/payment-success.webp"
                : "/images/payment-fail.png"
            }
            alt={isSuccess || isVNPaySuccess ? "success" : "fail"}
            className="w-[343px] h-[343px] object-cover"
          />
        </div>
      </div>
    </Suspense>
  );
}
