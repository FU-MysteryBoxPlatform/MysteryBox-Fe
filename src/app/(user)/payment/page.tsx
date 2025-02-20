"use client";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isSuccess = searchParams.get("isSuccess") === "success" ? true : false;

  return (
    <div>
      <div className="max-w-[1280px] mx-auto px-4 md:px-10 lg:px-16">
        <div className="my-10 flex flex-col items-center justify-center gap-6">
          <img
            src={
              isSuccess
                ? "/images/payment-success.webp"
                : "/images/payment-fail.jpg"
            }
            alt={isSuccess ? "success" : "fail"}
            className="w-[343px] h-[343px] object-cover"
          />
          <p className="text-lg md:text-xl lg:text-2xl font-bold text-center">
            {isSuccess ? "Thanh toán thành công!" : "Thanh toán thất bại!"}
          </p>
          {isSuccess ? (
            <Button
              className="bg-[#E12E43] hover:bg-[#B71C32] text-white"
              onClick={() => router.push("/")}
            >
              Tiếp tục mua sắm
            </Button>
          ) : (
            <Button onClick={() => router.push("/")}>Quay lại trang chủ</Button>
          )}
        </div>
      </div>
    </div>
  );
}
