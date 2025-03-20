"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import dayjs from "dayjs";
import { CalendarIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Inventory, useGetInventoryById } from "@/hooks/api/useInventory";
import { useRequestAuction } from "@/hooks/api/useAuction";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const RegisterSchema = z.object({
  price: z
    .string()
    .min(1, "Vui lòng nhập giá bắt đầu")
    .regex(/^\d+$/, "Giá phải là một số hợp lệ"),
});

type RegisterForm = z.infer<typeof RegisterSchema>;

interface RarityInfo {
  rarity: string;
  classes: string;
}

const getRarityColor = (id: string): RarityInfo => {
  const rarityMap = {
    Common: "bg-gray-200 text-gray-800",
    Uncommon: "bg-green-100 text-green-800",
    Rare: "bg-blue-100 text-blue-800",
    Epic: "bg-purple-100 text-purple-800",
    Legendary: "bg-orange-100 text-orange-800",
  };

  const itemId = parseInt(id.replace("inv", "")) || parseInt(id);
  const rarities = Object.keys(rarityMap);
  const rarity = rarities[itemId % rarities.length] as keyof typeof rarityMap;

  return {
    rarity,
    classes: rarityMap[rarity],
  };
};

export default function AuctionRegisterPage() {
  const { inventory } = useParams<{ inventory: string }>();
  const [inventoryDetail, setInventoryDetail] = useState<Inventory | null>(
    null
  );
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());

  const { data, isLoading } = useGetInventoryById(inventory);
  const { mutate: requestAuction, isPending } = useRequestAuction();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: { price: "" },
  });

  useEffect(() => {
    if (data?.result?.items?.[0]) {
      setInventoryDetail(data.result.items[0]);
    }
  }, [data]);

  const onSubmit = (formData: RegisterForm) => {
    if (dayjs(endDate).isBefore(startDate)) {
      toast({
        title: "Lỗi",
        description: "Ngày kết thúc phải sau ngày bắt đầu",
        variant: "destructive",
      });
      return;
    }

    requestAuction(
      {
        inventoryId: inventory,
        startTime: dayjs(startDate).toISOString(),
        endTime: dayjs(endDate).toISOString(),
        minimunBid: parseInt(formData.price),
      },
      {
        onSuccess: (response) => {
          toast({
            title: response.isSuccess
              ? "Đăng ký đấu giá thành công!"
              : response.messages[0],
            variant: response.isSuccess ? "default" : "destructive",
          });
        },
        onError: () => {
          toast({
            title: "Đã xảy ra lỗi",
            description: "Vui lòng thử lại sau",
            variant: "destructive",
          });
        },
      }
    );
  };

  if (isLoading || !inventoryDetail) {
    return (
      <div className="container mx-auto py-10 text-center">
        <p className="text-gray-500">Đang tải...</p>
      </div>
    );
  }

  const { rarity, classes } = getRarityColor(inventory);

  return (
    <div className="container mx-auto py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Product Image */}
        <div className="relative">
          <img
            src={inventoryDetail?.product?.imagePath || "/placeholder.png"}
            alt={inventoryDetail?.product?.name}
            className="w-full max-w-[300px] h-[300px] object-cover rounded-lg shadow-md"
            loading="lazy"
          />
        </div>

        {/* Product Details and Form */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {inventoryDetail?.product?.name}
              </h1>
              <Badge className={cn("text-sm", classes)}>{rarity}</Badge>
            </div>
            <p className="text-gray-600 mt-2">
              {inventoryDetail?.product?.description}
            </p>
            <p className="text-lg font-semibold text-gray-800 mt-1">
              {inventoryDetail?.product?.price.toLocaleString()} VND
            </p>
          </div>

          <form
            id="register-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {/* Starting Price */}
            <div className="space-y-2">
              <Label htmlFor="price" className="font-semibold text-gray-700">
                Giá bắt đầu
              </Label>
              <Input
                id="price"
                placeholder="Nhập giá bắt đầu (VND)"
                {...register("price")}
                className={cn(
                  "w-full",
                  errors.price && "border-red-500 focus:ring-red-500"
                )}
              />
              {errors.price && (
                <p className="text-sm text-red-500">{errors.price.message}</p>
              )}
            </div>

            {/* Date Pickers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-semibold text-gray-700">
                  Ngày bắt đầu
                </Label>
                <Popover>
                  <PopoverTrigger className="w-full flex items-center justify-between p-2 border rounded-md bg-white text-sm text-gray-700 hover:border-gray-400">
                    {dayjs(startDate).format("DD/MM/YYYY")}
                    <CalendarIcon className="h-4 w-4 text-gray-500" />
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => date && setStartDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label className="font-semibold text-gray-700">
                  Ngày kết thúc
                </Label>
                <Popover>
                  <PopoverTrigger className="w-full flex items-center justify-between p-2 border rounded-md bg-white text-sm text-gray-700 hover:border-gray-400">
                    {dayjs(endDate).format("DD/MM/YYYY")}
                    <CalendarIcon className="h-4 w-4 text-gray-500" />
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={(date) => date && setEndDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              form="register-form"
              type="submit"
              className="w-full bg-[#E12E43] hover:bg-[#c6283a] text-white"
              disabled={isPending}
            >
              {isPending ? "Đang xử lý..." : "Đăng ký"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
