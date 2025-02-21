import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import LoadingIndicator from "./LoadingIndicator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import dayjs from "dayjs";

const CreateCollectionSchema = z.object({
  collectionName: z.string(),
  collectionDescription: z.string(),
});

type CreateCollectionForm = z.infer<typeof CreateCollectionSchema>;

export default function FormCreateCollection() {
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());

  const { handleSubmit, register, formState } = useForm<CreateCollectionForm>({
    resolver: zodResolver(CreateCollectionSchema),
  });

  const onSubmit = (data: CreateCollectionForm) => {
    console.log({ data });
  };

  return (
    <>
      <form className="grid gap-4" id="sell-inventory-form">
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="collectionName">Tên bộ sưu tập mới</Label>
          <Input
            id="collectionName"
            placeholder="Nhập tên bộ sưu tập"
            {...register("collectionName")}
          />
          {formState.errors.collectionName && (
            <p className="text-red-500 text-sm">
              {formState.errors.collectionName.message}
            </p>
          )}
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="collectionDescription">Mô tả</Label>
          <Textarea
            id="collectionDescription"
            placeholder="Nhập mô tả"
            {...register("collectionDescription")}
          />
          {formState.errors.collectionDescription && (
            <p className="text-red-500 text-sm">
              {formState.errors.collectionDescription.message}
            </p>
          )}
        </div>
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
      </form>
      <Button
        form="sell-inventory-form"
        type="button"
        className="bg-[#E12E43] hover:bg-[#B71C32]"
        disabled={false}
        onClick={handleSubmit(onSubmit)}
      >
        {false ? <LoadingIndicator /> : "Tạo"}
      </Button>
    </>
  );
}
