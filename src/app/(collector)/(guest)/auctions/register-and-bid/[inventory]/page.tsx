"use client";

import { useContext, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import dayjs from "dayjs";
import { CalendarIcon, ClockIcon } from "lucide-react";

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
import { GlobalContext } from "@/provider/global-provider";

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

  const itemId = parseInt(id);
  const rarities = Object.keys(rarityMap);
  const rarity = rarities[itemId % rarities.length] as keyof typeof rarityMap;

  return {
    rarity,
    classes: rarityMap[rarity],
  };
};

// Component chọn giờ đơn giản
const TimePicker = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  return (
    <Input
      type="time"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full"
    />
  );
};

export default function AuctionRegisterPage() {
  const { inventory } = useParams<{ inventory: string }>();
  const [inventoryDetail, setInventoryDetail] = useState<Inventory | null>(
    null
  );
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [startTime, setStartTime] = useState<string>("00:00");
  const [endTime, setEndTime] = useState<string>("23:59");

  const { data, isLoading } = useGetInventoryById(inventory);
  const { mutate: requestAuction, isPending } = useRequestAuction();
  const { user } = useContext(GlobalContext);
  const router = useRouter();
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

  const combineDateTime = (date: Date, time: string) => {
    const [hours, minutes] = time.split(":");
    return dayjs(date)
      .set("hour", parseInt(hours))
      .set("minute", parseInt(minutes))
      .toISOString();
  };

  const onSubmit = (formData: RegisterForm) => {
    const startDateTime = combineDateTime(startDate, startTime);
    const endDateTime = combineDateTime(endDate, endTime);

    if (dayjs(endDateTime).isBefore(startDateTime)) {
      toast({
        title: "Lỗi",
        description: "Thời gian kết thúc phải sau thời gian bắt đầu",
        variant: "destructive",
      });
      return;
    }

    requestAuction(
      {
        accountId: user?.id ?? "",
        inventoryId: inventory,
        startDate: startDateTime,
        endDate: endDateTime,
        minimumBid: parseInt(formData.price),
      },
      {
        onSuccess: (response) => {
          toast({
            title: response.isSuccess
              ? "Đăng ký đấu giá thành công!"
              : response.messages[0],
            variant: response.isSuccess ? "default" : "destructive",
          });
          if (response.isSuccess) {
            router.push("/auctions");
          }
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

  const { rarity, classes } = getRarityColor(
    inventoryDetail?.itemStatusId.toString()
  );

  return (
    <div className="container mx-auto py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Product Image */}
        <div className="relative">
          <img
            src={inventoryDetail?.product?.imagePath || "/placeholder.png"}
            alt={inventoryDetail?.product?.name}
            className="w-full max-w-[300px] h-[300px] object-cover rounded-md shadow-md"
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

            {/* Date and Time Pickers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Start Date and Time */}
              <div className="space-y-2">
                <Label className="font-semibold text-gray-700">
                  Thời gian bắt đầu
                </Label>
                <div className="space-y-2">
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
                  <TimePicker value={startTime} onChange={setStartTime} />
                </div>
              </div>

              {/* End Date and Time */}
              <div className="space-y-2">
                <Label className="font-semibold text-gray-700">
                  Thời gian kết thúc
                </Label>
                <div className="space-y-2">
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
                  <TimePicker value={endTime} onChange={setEndTime} />
                </div>
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
