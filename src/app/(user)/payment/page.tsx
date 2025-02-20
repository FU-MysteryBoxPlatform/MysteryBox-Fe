"use client";
import { Button } from "@/components/ui/button";
import dayjs from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isSuccess = searchParams.get("isSuccess") === "success" ? true : false;

  return (
    <div>
      <div className="max-w-[1280px] mx-auto px-4 md:px-10 lg:px-16 h-[90vh] flex items-center justify-center">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between lg:gap-48">
          <div className="flex flex-col max-lg:items-center">
            <p className="text-lg md:text-xl lg:text-2xl font-bold text-center lg:text-left">
              {isSuccess ? "Thanh toán thành công!" : "Thanh toán thất bại!"}
            </p>

            <div className="text-sm my-4 text-center lg:text-left">
              <p>
                Mã giao dịch: <span className="font-semibold">abc</span>
              </p>
              <p>
                Ngày tạo:{" "}
                <span className="font-semibold">
                  {dayjs().format("DD/MM/YYYY HH:mm")}
                </span>
              </p>
              <p>
                Phương thức thanh toán:{" "}
                <span className="font-semibold">ABC</span>
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
              isSuccess
                ? "/images/payment-success.webp"
                : "/images/payment-fail.jpg"
            }
            alt={isSuccess ? "success" : "fail"}
            className="w-[343px] h-[343px] object-cover"
          />
        </div>
      </div>
    </div>
  );
}
