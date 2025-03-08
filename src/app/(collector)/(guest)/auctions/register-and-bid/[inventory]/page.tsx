"use client";

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
import { useRequestAuction } from "@/hooks/api/useAuction";
import { Inventory, useGetInventoryById } from "@/hooks/api/useInventory";
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { CalendarIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const RegisterSchema = z.object({
  price: z.string().min(1, "Vui lòng nhập giá bắt đầu"),
});

type RegisterForm = z.infer<typeof RegisterSchema>;

export default function Page() {
  const { inventory } = useParams();
  const [inventoryDetail, setInventoryDetail] = useState<Inventory>();
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());

  const { data } = useGetInventoryById(inventory as string);
  const { mutate: mutateRequestAuction } = useRequestAuction();

  const { handleSubmit, register, formState } = useForm<RegisterForm>({
    resolver: zodResolver(RegisterSchema),
  });

  const getRarityColor = (id: string) => {
    const rarityMap = {
      Common: "bg-gray-200 text-gray-800",
      Uncommon: "bg-green-100 text-green-800",
      Rare: "bg-blue-100 text-blue-800",
      Epic: "bg-purple-100 text-purple-80 0",
      Legendary: "bg-orange-100 text-orange-800",
    };

    // Assign rarity based on item id for demo purposes
    const itemId = parseInt(id.replace("inv", "")) || parseInt(id);
    const rarities = ["Common", "Uncommon", "Rare", "Epic", "Legendary"];
    const rarity: keyof typeof rarityMap = rarities[
      itemId % 5
    ] as keyof typeof rarityMap;

    return {
      rarity,
      classes: rarityMap[rarity],
    };
  };

  const onSubmit = (data: RegisterForm) => {
    mutateRequestAuction(
      {
        inventoryId: inventory as string,
        startTime: dayjs(startDate).toISOString(),
        endTime: dayjs(endDate).toISOString(),
        minimunBid: +data.price,
      },
      {
        onSuccess: (data) => {
          if (data.isSuccess) {
            toast({
              title: "Đăng ký đấu giá thành công!",
            });
          } else {
            toast({
              title: data.messages[0],
            });
          }
        },
      }
    );
  };

  useEffect(() => {
    setInventoryDetail(data?.result.items[0]);
  }, [data?.result]);

  console.log({ inventoryDetail });

  return (
    <div className="flex gap-6 lg:gap-10">
      <img
        src={inventoryDetail?.product.imagePath}
        alt={inventoryDetail?.product.name}
        className="object-cover w-[200px] h-[200px]"
      />
      <div>
        <div className="flex items-center gap-2">
          <p className="text-2xl font-bold">{inventoryDetail?.product.name}</p>
          <Badge
            className={`ml-2 text-xs ${
              getRarityColor(inventory as string).classes
            }`}
          >
            {getRarityColor(inventory as string).rarity}
          </Badge>
        </div>
        <p className="text-gray-400">{inventoryDetail?.product.description}</p>
        <p className="font-bold text-sm">
          {inventoryDetail?.product.price.toLocaleString()} VND
        </p>

        <div className="mt-6 grid gap-4">
          <form id="register-form">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="price" className="font-bold">
                Giá bắt đầu
              </Label>
              <Input
                id="price"
                placeholder="Nhập giá bắt đầu"
                {...register("price")}
              />
              {formState.errors.price && (
                <p className="text-red-500 text-sm">
                  {formState.errors.price.message}
                </p>
              )}
            </div>
          </form>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label>Ngày bắt đầu</Label>
              <Popover>
                <PopoverTrigger className="px-2 py-1 text-sm rounded-md border border-gray-300 flex justify-between items-center">
                  <p>{dayjs(startDate).format("DD/MM/YYYY")}</p>
                  <CalendarIcon />
                </PopoverTrigger>
                <PopoverContent>
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    className="rounded-md border w-fit"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label>Ngày kết thúc</Label>
              <Popover>
                <PopoverTrigger className="px-2 py-1 text-sm rounded-md border border-gray-300 flex justify-between items-center">
                  <p>{dayjs(endDate).format("DD/MM/YYYY")}</p>
                  <CalendarIcon />
                </PopoverTrigger>
                <PopoverContent>
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    className="rounded-md border w-fit"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <Button
            form="register-form"
            className="bg-[#E12E43] text-white hover:bg-[#B71C32]"
            onClick={handleSubmit(onSubmit)}
          >
            Đăng ký
          </Button>
        </div>
      </div>
    </div>
  );
}
