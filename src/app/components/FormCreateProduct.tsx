import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ImageUploader } from "./ImageUpload";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export type TProduct = {
  name: string;
  description: string;
  price: number;
  discount: number;
  rarityStatusId: number;
  productStatusId: number;
  imagePath: string;
};

type TCreateProduct = {
  onCreateProduct: (product: TProduct) => void;
};

const CreateProductSchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.string(),
  discount: z.string(),
  rarityStatusId: z.string().optional(),
  productStatusId: z.string().optional(),
});

type CreateProductForm = z.infer<typeof CreateProductSchema>;

export default function FormCreateProduct({ onCreateProduct }: TCreateProduct) {
  const [image, setImage] = useState("");
  const { handleSubmit, register, setValue, getValues, formState } =
    useForm<CreateProductForm>({
      resolver: zodResolver(CreateProductSchema),
      defaultValues: {
        rarityStatusId: "0",
        productStatusId: "0",
      },
    });

  const onsubmit = (data: CreateProductForm) => {
    onCreateProduct({
      ...data,
      price: +data.price,
      discount: +data.discount,
      rarityStatusId: +(data.rarityStatusId || 0),
      productStatusId: +(data.productStatusId || 0),
      imagePath: image,
    });
  };

  return (
    <div>
      <form className="grid gap-4 grid-cols-2" id="add-product-form">
        <div className="flex flex-col space-y-1.5 col-span-2">
          <Label htmlFor="name">Tên vật phẩm</Label>
          <Input
            id="name"
            placeholder="Nhập tên bộ sưu tập"
            {...register("name")}
          />
          {formState.errors.name && (
            <p className="text-red-500 text-sm">
              {formState.errors.name.message}
            </p>
          )}
        </div>
        <div className="flex flex-col space-y-1.5 col-span-2">
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
          <Label htmlFor="price">Giá</Label>
          <Input
            id="price"
            type="number"
            placeholder="Nhập giá"
            {...register("price")}
          />
          {formState.errors.price && (
            <p className="text-red-500 text-sm">
              {formState.errors.price.message}
            </p>
          )}
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="discount">Giảm giá</Label>
          <Input
            id="discount"
            type="number"
            placeholder="Nhập giảm giá"
            {...register("discount")}
          />
          {formState.errors.discount && (
            <p className="text-red-500 text-sm">
              {formState.errors.discount.message}
            </p>
          )}
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="name">Độ hiếm</Label>
          <Select
            {...register("rarityStatusId")}
            value={getValues("rarityStatusId") || "0"}
            defaultValue={getValues("rarityStatusId") || "0"}
            onValueChange={(value) => setValue("rarityStatusId", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Chọn độ hiếm" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Bình thường</SelectItem>
              <SelectItem value="1">Hiếm</SelectItem>
              <SelectItem value="2">Cực hiếm</SelectItem>
              <SelectItem value="3">Huyền thoại</SelectItem>
            </SelectContent>
          </Select>
          {formState.errors.rarityStatusId && (
            <p className="text-red-500 text-sm">
              {formState.errors.rarityStatusId.message}
            </p>
          )}
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="name">Trạng thái vật phẩm</Label>
          <Select
            {...register("productStatusId")}
            value={getValues("productStatusId") || "0"}
            defaultValue={getValues("productStatusId") || "0"}
            onValueChange={(value) => setValue("productStatusId", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Chọn trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Có sẵn</SelectItem>
              <SelectItem value="1">Khống có sẵn</SelectItem>
              <SelectItem value="2">Còn hàng</SelectItem>
              <SelectItem value="3">Hết hàng</SelectItem>
            </SelectContent>
          </Select>
          {formState.errors.productStatusId && (
            <p className="text-red-500 text-sm">
              {formState.errors.productStatusId?.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="name">Hình ảnh</Label>
          <ImageUploader
            onChange={(url) => setImage(url)}
            value={image}
            className="w-24 h-24 rounded-[unset]"
          />
        </div>
      </form>
      <Button
        className="bg-[#E12E43] text-white hover:bg-[#B71C32] mt-6 w-full"
        form="add-product-form"
        disabled={!image}
        onClick={handleSubmit(onsubmit)}
      >
        Tạo vật phẩm
      </Button>
    </div>
  );
}
