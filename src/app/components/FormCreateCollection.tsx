"use client";
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
import { CalendarIcon, Plus, X } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import dayjs from "dayjs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import FormCreateProduct, { TProduct } from "./FormCreateProduct";
import { ImageUploader } from "./ImageUpload";
import { useCreateCollection } from "@/hooks/api/useManageCollection";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

const CreateCollectionSchema = z.object({
  collectionName: z.string(),
  description: z.string(),
  rewards: z.string(),
  blindBoxPrice: z.string(),
  discountBlindBoxPrice: z.string(),
  totalItem: z.string(),
});

type CreateCollectionForm = z.infer<typeof CreateCollectionSchema>;

export default function FormCreateCollection() {
  const router = useRouter();
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [openCreateProductModal, setOpenCreateProductModal] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [products, setProducts] = useState<TProduct[]>([]);

  const { mutate: mutateCreateCollection, isPending } = useCreateCollection();

  const { handleSubmit, register, formState } = useForm<CreateCollectionForm>({
    resolver: zodResolver(CreateCollectionSchema),
  });

  const handleRemoveProduct = (index: number) => () => {
    setProducts((prevProducts) => prevProducts.filter((_, i) => i !== index));
  };

  const handleRemoveImage = (index: number) => () => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const onSubmit = (data: CreateCollectionForm) => {
    mutateCreateCollection(
      {
        ...data,
        blindBoxPrice: +data.blindBoxPrice,
        discountBlindBoxPrice: +data.discountBlindBoxPrice,
        totalItem: +data.totalItem,
        productDtos: products,
        startTime: dayjs(startDate)?.toISOString(),
        endTime: dayjs(endDate)?.toISOString(),
        listImage: images,
      },
      {
        onSuccess: (data) => {
          if (data.isSuccess) {
            toast({
              title: "Tạo bộ sưu tập thành công!",
            });
            router.push(`/management/manage-collection`);
          } else {
            toast({
              title: "Tạo bộ sưu tập không thành công!",
            });
          }
        },
      }
    );
  };

  console.log({ error: formState.errors });

  return (
    <>
      <div className="flex mb-6 items-center justify-between">
        <p className="text-lg font-bold">Tạo bộ sưu tập mới</p>
        <Button
          form="sell-inventory-form"
          type="button"
          className="bg-[#E12E43] hover:bg-[#B71C32]"
          disabled={isPending}
          onClick={handleSubmit(onSubmit)}
        >
          {false ? <LoadingIndicator /> : "Lưu bộ sưu tập"}
        </Button>
      </div>
      <form className="grid grid-cols-2 gap-4" id="sell-inventory-form">
        <div className="flex flex-col space-y-1.5 col-span-2">
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
          <Label htmlFor="description">Mô tả</Label>
          <Textarea
            id="description"
            placeholder="Nhập mô tả"
            {...register("description")}
          />
          {formState.errors.description && (
            <p className="text-red-500 text-sm">
              {formState.errors.description.message}
            </p>
          )}
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="rewards">Phần thưởng</Label>
          <Textarea
            id="rewards"
            placeholder="Nhập phần thưởng"
            {...register("rewards")}
          />
          {formState.errors.rewards && (
            <p className="text-red-500 text-sm">
              {formState.errors.rewards.message}
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
        <div className="col-span-2 grid grid-cols-3 gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="totalItem">Tổng số túi mù</Label>
            <Input
              id="totalItem"
              type="number"
              placeholder="Nhập tổng số túi mù"
              {...register("totalItem")}
            />
            {formState.errors.totalItem && (
              <p className="text-red-500 text-sm">
                {formState.errors.totalItem.message}
              </p>
            )}
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="blindBoxPrice">Giá túi mù</Label>
            <Input
              id="blindBoxPrice"
              type="number"
              placeholder="Nhập giá túi mù"
              {...register("blindBoxPrice")}
            />
            {formState.errors.blindBoxPrice && (
              <p className="text-red-500 text-sm">
                {formState.errors.blindBoxPrice.message}
              </p>
            )}
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="discountBlindBoxPrice">Giảm giá túi mù</Label>
            <Input
              id="discountBlindBoxPrice"
              type="number"
              placeholder="Nhập giảm giá túi mù"
              {...register("discountBlindBoxPrice")}
            />
            {formState.errors.discountBlindBoxPrice && (
              <p className="text-red-500 text-sm">
                {formState.errors.discountBlindBoxPrice.message}
              </p>
            )}
          </div>
        </div>
        <div className="flex space-y-1.5 flex-col gap-4 col-span-2">
          <Label>Danh sách hình ảnh</Label>
          <div className="flex flex-wrap gap-4">
            {images.map((image, idx) => (
              <div key={idx} className="w-fit relative">
                <img src={image} className="w-24 h-24" />
                <div
                  className="absolute w-6 h-6 flex items-center justify-center rounded-full -top-3 -right-3 bg-[#E12E43] text-white cursor-pointer"
                  onClick={handleRemoveImage(idx)}
                >
                  <X className="h-4 w-4" />
                </div>
              </div>
            ))}
            <ImageUploader
              onChange={(url) =>
                setImages((prevImages) => [...prevImages, url])
              }
              showPreview={false}
              className="w-24 h-24"
            />
          </div>
        </div>
        <div className="flex space-y-1.5 items-center gap-4">
          <Label>Danh sách vật phẩm</Label>
          <Button
            type="button"
            className="bg-[#E12E43] hover:bg-[#B71C32] w-6 h-6 rounded-full !mt-0"
            onClick={() => setOpenCreateProductModal(true)}
          >
            <Plus />
          </Button>
        </div>
        <div className="col-span-2 flex gap-4 flex-wrap">
          {products.map((product, index) => (
            <div key={product.name} className="flex space-y-1.5 relative">
              <div className="flex flex-col justify-start items-center gap-2">
                <img
                  src={product.imagePath}
                  alt="Product image"
                  className="w-20 h-20 border border-gray-200 object-cover"
                />
                <div className="flex flex-col">
                  <p className="text-sm font-medium">{product.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {product.price}
                  </p>
                </div>
              </div>
              <div
                className="absolute w-6 h-6 flex items-center justify-center rounded-full -top-3 -right-3 bg-[#E12E43] text-white cursor-pointer"
                onClick={handleRemoveProduct(index)}
              >
                <X className="h-4 w-4" />
              </div>
            </div>
          ))}
        </div>
      </form>

      <Dialog
        open={openCreateProductModal}
        onOpenChange={setOpenCreateProductModal}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tạo vật phẩm</DialogTitle>
          </DialogHeader>
          <FormCreateProduct
            onCreateProduct={(product) => {
              setProducts((prevProducts) => [...prevProducts, product]);
              setOpenCreateProductModal(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
