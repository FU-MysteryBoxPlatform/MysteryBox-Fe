"use client";

import LoadingIndicator from "@/app/components/LoadingIndicator";
import { Button } from "@/components/ui/button";
import { useUpdateTransaction } from "@/hooks/api/useCartApi";
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

  const [data, setData] = useState<MomoPaymentResponse>({
    partnerCode: "",
    orderId: "",
    requestId: "",
    amount: "",
    orderInfo: "",
    orderType: "",
    transId: "",
    resultCode: "",
    message: "",
    payType: "",
    responseTime: "",
    extraData: "",
    signature: "",
  });
  const [dataVNPay, setDataVNPay] = useState<VnPayQueryParams>({});
  const isSuccess = searchParams.get("resultCode") === "0" ? true : false;
  const isVNPaySuccess =
    searchParams.get("vnp_ResponseCode") === "00" ? true : false;
  const transactionId = data.extraData || dataVNPay.vnp_TxnRef || "";
  const checkout = useUpdateTransaction(transactionId, isSuccess ? 1 : 2);
  const { setCart } = useContext(GlobalContext);
console.log(isVNPaySuccess)
  useEffect(() => {
    if (searchParams) {
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
    }

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
  }, [searchParams]);
  useEffect(() => {
    if (data.transId || dataVNPay.vnp_TxnRef) {
      if (isSuccess) {
        setCart([]);
      }
      checkout.mutate(
        {
          transactionId: data.transId || dataVNPay.vnp_TxnRef,
          transactionStatus: isSuccess ? 1 : 2,
        },
        {
          onSuccess: (data) => {
            console.log(data);
          },
        }
      );
    }
  }, [data.transId, dataVNPay.vnp_TxnRef]);
  return (
    <Suspense>
      <div className="max-w-[1280px] mx-auto px-4 md:px-10 lg:px-16 h-[90vh] flex items-center justify-center">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between lg:gap-48">
          <div className="flex flex-col max-lg:items-center">
            <p className="text-lg md:text-xl lg:text-2xl font-bold text-center lg:text-left">
              {isSuccess ||isVNPaySuccess ? "Thanh toán thành công!" : "Thanh toán thất bại!"}
            </p>
            {checkout.isPending ? <LoadingIndicator /> : null}
            <div className="text-sm my-4 text-center lg:text-left">
              <p>
                Mã giao dịch:{" "}
                <span className="font-semibold">{data.transId || dataVNPay.vnp_TxnRef || "N/A"}</span>
              </p>
              <p>
                Ngày tạo:{" "}
                <span className="font-semibold">
                  {data.responseTime 
                    ? dayjs(Number(data.responseTime)).format(
                        "DD/MM/YYYY HH:mm"
                      )
                    : "N/A"}
                </span>
              </p>
              <p>
                Phương thức thanh toán:{" "}
                <span className="font-semibold">
                  {data.partnerCode || dataVNPay.vnp_BankCode || "N/A"}
                </span>
              </p>
            </div>

            {isSuccess || isVNPaySuccess ? (
              <Button
                className="bg-[#E12E43] hover:bg-[#B71C32] text-white max-lg:mx-auto"
                onClick={() => router.push("/")}
              >
                Tiếp tục mua sắm
              </Button>
            ) : (
              <Button
                onClick={() => router.push("/")}
                className="max-lg:mx-auto"
              >
                Quay lại trang chủ
              </Button>
            )}
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
