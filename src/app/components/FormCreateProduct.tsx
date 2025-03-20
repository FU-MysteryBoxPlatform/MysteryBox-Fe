"use client";
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
  productId?: string;
  name: string;
  description: string;
  price: number;
  discount: number;
  rarityStatusId: number;
  productStatusId: number;
  imagePath: string;
};

type TCreateProduct = {
  defaultProduct?: TProduct;
  onSaveProduct: (product: TProduct) => void;
  onCreateProduct: (product: TProduct) => void;
};

const CreateProductSchema = z.object({
  name: z.string().min(1, "Vui lòng nhập tên vật phẩm"),
  description: z.string().min(1, "Vui lòng nhập mô tả"),
  price: z.string().min(1, "Vui lòng nhập giá"),
  discount: z.string().optional(),
  rarityStatusId: z.string().optional(),
  productStatusId: z.string().optional(),
});

type CreateProductForm = z.infer<typeof CreateProductSchema>;

export default function FormCreateProduct({
  defaultProduct,
  onSaveProduct,
  onCreateProduct,
}: TCreateProduct) {
  const [image, setImage] = useState(defaultProduct?.imagePath || "");

  const { handleSubmit, register, setValue, getValues, formState } =
    useForm<CreateProductForm>({
      resolver: zodResolver(CreateProductSchema),
      defaultValues: {
        name: defaultProduct?.name || "",
        description: defaultProduct?.description || "",
        price: defaultProduct?.price?.toString() || "",
        discount: defaultProduct?.discount?.toString() || "",
        rarityStatusId: defaultProduct?.rarityStatusId?.toString() || "0",
        productStatusId: defaultProduct?.productStatusId?.toString() || "0",
      },
    });

  const onSubmit = (data: CreateProductForm) => {
    const productData = {
      ...data,
      price: +data.price,
      discount: data.discount ? +data.discount : 0,
      rarityStatusId: +(data.rarityStatusId || 0),
      productStatusId: +(data.productStatusId || 0),
      imagePath: image,
    };
    if (defaultProduct) {
      onSaveProduct(productData);
    } else {
      onCreateProduct(productData);
    }
  };

  return (
    <div className="space-y-6">
      <form
        id="add-product-form"
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-4 grid-cols-1 sm:grid-cols-2"
      >
        {/* Tên vật phẩm */}
        <div className="space-y-2 col-span-1 sm:col-span-2">
          <Label htmlFor="name" className="text-sm font-medium text-gray-700">
            Tên Vật Phẩm
          </Label>
          <Input
            id="name"
            placeholder="Nhập tên vật phẩm"
            className="bg-white border-gray-300"
            {...register("name")}
          />
          {formState.errors.name && (
            <p className="text-red-500 text-sm">
              {formState.errors.name.message}
            </p>
          )}
        </div>

        {/* Mô tả */}
        <div className="space-y-2 col-span-1 sm:col-span-2">
          <Label
            htmlFor="description"
            className="text-sm font-medium text-gray-700"
          >
            Mô Tả
          </Label>
          <Textarea
            id="description"
            placeholder="Nhập mô tả vật phẩm"
            className="bg-white border-gray-300 min-h-[100px]"
            {...register("description")}
          />
          {formState.errors.description && (
            <p className="text-red-500 text-sm">
              {formState.errors.description.message}
            </p>
          )}
        </div>

        {/* Giá và Giảm giá */}
        <div className="space-y-2">
          <Label htmlFor="price" className="text-sm font-medium text-gray-700">
            Giá
          </Label>
          <Input
            id="price"
            type="number"
            placeholder="Nhập giá"
            className="bg-white border-gray-300"
            {...register("price")}
          />
          {formState.errors.price && (
            <p className="text-red-500 text-sm">
              {formState.errors.price.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="discount"
            className="text-sm font-medium text-gray-700"
          >
            Giảm Giá (Nếu Có)
          </Label>
          <Input
            id="discount"
            type="number"
            placeholder="Nhập giá giảm"
            className="bg-white border-gray-300"
            {...register("discount")}
          />
          {formState.errors.discount && (
            <p className="text-red-500 text-sm">
              {formState.errors.discount.message}
            </p>
          )}
        </div>

        {/* Độ hiếm */}
        <div className="space-y-2">
          <Label
            htmlFor="rarityStatusId"
            className="text-sm font-medium text-gray-700"
          >
            Độ Hiếm
          </Label>
          <Select
            value={getValues("rarityStatusId") || "0"}
            onValueChange={(value) => setValue("rarityStatusId", value)}
          >
            <SelectTrigger className="bg-white border-gray-300">
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

        {/* Trạng thái */}
        <div className="space-y-2">
          <Label
            htmlFor="productStatusId"
            className="text-sm font-medium text-gray-700"
          >
            Trạng Thái
          </Label>
          <Select
            value={getValues("productStatusId") || "0"}
            onValueChange={(value) => setValue("productStatusId", value)}
          >
            <SelectTrigger className="bg-white border-gray-300">
              <SelectValue placeholder="Chọn trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Có sẵn</SelectItem>
              <SelectItem value="1">Không có sẵn</SelectItem>
              <SelectItem value="2">Còn hàng</SelectItem>
              <SelectItem value="3">Hết hàng</SelectItem>
            </SelectContent>
          </Select>
          {formState.errors.productStatusId && (
            <p className="text-red-500 text-sm">
              {formState.errors.productStatusId.message}
            </p>
          )}
        </div>

        {/* Hình ảnh */}
        <div className="space-y-2 col-span-1 sm:col-span-2">
          <Label className="text-sm font-medium text-gray-700">Hình Ảnh</Label>
          <ImageUploader
            onChange={(url) => setImage(url)}
            value={image}
            className="w-32 h-32 rounded-md border border-dashed border-gray-300 bg-white flex items-center justify-center hover:border-red-600 transition-colors"
          />
          {!image && (
            <p className="text-red-500 text-sm">Vui lòng tải lên hình ảnh</p>
          )}
        </div>
      </form>

      <Button
        type="submit"
        form="add-product-form"
        className="w-full bg-red-600 hover:bg-red-700 text-white mt-4"
        disabled={!image}
      >
        {defaultProduct ? "Lưu Vật Phẩm" : "Tạo Vật Phẩm"}
      </Button>
    </div>
  );
}
