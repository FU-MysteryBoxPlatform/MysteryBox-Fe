"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useParams } from "next/navigation";

export default function Page() {
  const { id } = useParams();

  console.log({ id });

  //TODO: get box details here
  return (
    <div>
      <div className="flex gap-6 max-md:flex-col">
        <img
          src="/mock-images/image1.png"
          alt="image"
          className="shrink-0 object-cover aspect-square max-h-[274px]"
        />
        <div className="flex-1 grid gap-6">
          <p className="text-xl md:text-2xl lg:text-3xl font-bold">
            Chi tiết sản phẩm
          </p>
          <Card className="w-full">
            <CardContent className="p-6 grid xl:grid-cols-2 gap-4">
              <div className="">
                <p className="text-lg lg:text-xl font-bold mb-1">Giá bắt đầu</p>
                <p className="font-bold mb-6">100,000 VND</p>
                <div className="flex items-center">
                  {Array.from({ length: 5 }, (_, i) => (
                    <div
                      key={i}
                      className="h-8 w-8 rounded-full bg-gray-400 border border-[#C4C4C4] [&:not(:first-of-type)]:-ml-2"
                    />
                  ))}
                  <div className="h-8 w-8 rounded-full bg-gray-400 border border-[#C4C4C4] opacity-80 text-xs flex items-center justify-center -ml-2">
                    +12
                  </div>
                </div>
              </div>
              <div className="">
                <p className="text-lg lg:text-xl font-bold mb-1">
                  Giá đấu thầu hiện tại
                </p>
                <p className="font-bold">1,000,000 VND</p>
              </div>
            </CardContent>
          </Card>

          <div>
            <div className="grid grid-cols-2 gap-6 bg-black p-6 text-white">
              <div className="text-lg font-bold flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-[#E12E43] animate-ping"></div>
                Đấu thầu hiện tại
              </div>
              <div className="text-lg font-bold">14 ra giá</div>
            </div>
            <div className="border border-black p-6 grid gap-4">
              {Array.from({ length: 5 }, (_, i) => (
                <div key={i} className="grid grid-cols-2 gap-6">
                  <div className="flex items-center gap-2">
                    <img
                      src="/mock-images/image1.png"
                      alt="image"
                      className="w-12 h-12 rounded-full"
                    />
                    <p className="text-lg font-bold">Người bán</p>
                  </div>
                  <p>150,000 VND</p>
                </div>
              ))}
            </div>
          </div>

          <Button className="bg-[#E12E43] text-white hover:bg-[#B71C32]">
            Đặt giá đấu thầu
          </Button>
        </div>
      </div>
    </div>
  );
}
