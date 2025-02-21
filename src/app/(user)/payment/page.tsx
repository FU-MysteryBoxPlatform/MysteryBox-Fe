"use client";

import { Button } from "@/components/ui/button";
import dayjs from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
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
  const isSuccess = searchParams.get("resultCode") === "0" ? true : false;

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
  }, [searchParams]);
console.log(data);
  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-10 lg:px-16 h-[90vh] flex items-center justify-center">
      <div className="flex flex-col-reverse lg:flex-row items-center justify-between lg:gap-48">
        <div className="flex flex-col max-lg:items-center">
          <p className="text-lg md:text-xl lg:text-2xl font-bold text-center lg:text-left">
            {isSuccess ? "Thanh toán thành công!" : "Thanh toán thất bại!"}
          </p>

          <div className="text-sm my-4 text-center lg:text-left">
            <p>
              Mã giao dịch:{" "}
              <span className="font-semibold">{data.transId || "N/A"}</span>
            </p>
            <p>
              Ngày tạo:{" "}
              <span className="font-semibold">
                {data.responseTime
                  ? dayjs(Number(data.responseTime)).format("DD/MM/YYYY HH:mm")
                  : "N/A"}
              </span>
            </p>
            <p>
              Phương thức thanh toán:{" "}
              <span className="font-semibold">{data.partnerCode || "N/A"}</span>
            </p>
          </div>

          {isSuccess ? (
            <Button
              className="bg-[#E12E43] hover:bg-[#B71C32] text-white max-lg:mx-auto"
              onClick={() => router.push("/")}
            >
              Tiếp tục mua sắm
            </Button>
          ) : (
            <Button onClick={() => router.push("/")} className="max-lg:mx-auto">
              Quay lại trang chủ
            </Button>
          )}
        </div>
        <img
          src={
            isSuccess
              ? "/images/payment-success.webp"
              : "/images/payment-fail.png"
          }
          alt={isSuccess ? "success" : "fail"}
          className="w-[343px] h-[343px] object-cover"
        />
      </div>
    </div>
  );
}
