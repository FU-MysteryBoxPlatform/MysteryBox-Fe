"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Image from "next/image"; // Dùng Next.js Image để tối ưu hình ảnh
import { Progress } from "@radix-ui/react-progress";
import { RewardResponse } from "@/hooks/api/useCollection";


// Props type cho component
interface RewardProgressProps {
  data: RewardResponse | null; // Có thể null nếu không có dữ liệu
}
export default function RewardProgress({ data }: RewardProgressProps) {
  const [progress, setProgress] = useState<number>(0);
  const [isRewardClaimed, setIsRewardClaimed] = useState<boolean>(false);
  const [productName, setProductName] = useState<string>("Unknown Product");
  const [productImage, setProductImage] = useState<string>("");

  useEffect(() => {
    if (!data) return;

    const product = data.collection?.product ?? null;
    const userProgress = data.userCollectionProgress ?? null;

    setProductName(product?.name ?? "Unknown Product");
    setProductImage(product?.imagePath ?? "");
    setProgress(userProgress?.progress ?? 0);
    setIsRewardClaimed(userProgress?.isRewardClaimed ?? false);
  }, [data]);

  const progressPercentage = Math.min(progress, 100);

  if (!data) {
    return (
      <Card className="w-full max-w-md mx-auto shadow-lg">
        <CardContent className="pt-6">
          <p className="text-center text-gray-500">Không có dữ liệu</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="my-4 w-full shadow-lg rounded-lg overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg font-semibold text-gray-800">
            {productName}
          </span>
          <Badge
            variant={isRewardClaimed ? "default" : "secondary"}
            className={cn(
              isRewardClaimed
                ? "bg-gradient-to-r from-green-400 to-green-600"
                : "bg-gradient-to-r from-gray-400 to-gray-600",
              "text-white font-medium"
            )}
          >
            {isRewardClaimed ? "Đã nhận thưởng" : "Chưa nhận"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-row items-start gap-6">
          {/* Phần hình ảnh và tên sản phẩm bên trái */}
          <div className="flex-shrink-0 w-1/3">
            {productImage && (
              <div className="relative w-full h-32">
                <Image
                  src={productImage}
                  alt={productName}
                  fill
                  className="object-cover rounded-md"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority={true}
                />
              </div>
            )}
          </div>

          {/* Thanh tiến trình bên phải */}
          <div className="flex-1 space-y-3">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Tiến trình</span>
              <span>{progressPercentage}%</span>
            </div>
            <Progress
              value={progressPercentage}
              className={cn(
                "h-3 bg-gray-200 rounded-full relative overflow-hidden",
                isRewardClaimed
                  ? "bg-gradient-to-r from-green-100 to-teal-100"
                  : "bg-gradient-to-r from-blue-100 to-indigo-100"
              )}
            >
              <div
                className={cn(
                  "absolute top-0 left-0 h-full rounded-full transition-all duration-500 ease-in-out",
                  isRewardClaimed
                    ? "bg-gradient-to-r from-green-400 to-teal-500"
                    : "bg-gradient-to-r from-blue-400 to-indigo-500"
                )}
                style={{ width: `${progressPercentage}%` }}
              />
            </Progress>
            <p className="text-sm text-gray-500 italic">
              {isRewardClaimed
                ? "Chúc mừng! Bạn đã nhận phần thưởng."
                : `Đạt ${progressPercentage}% tiến trình nhận thưởng.`}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}