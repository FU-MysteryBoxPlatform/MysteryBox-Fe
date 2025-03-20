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
  collectionName: z.string().min(1, "Vui lòng nhập tên bộ sưu tập"),
  description: z.string().min(1, "Vui lòng nhập mô tả"),
  rewards: z.string().min(1, "Vui lòng nhập phần thưởng"),
  blindBoxPrice: z.string().min(1, "Vui lòng nhập giá túi mù"),
  discountBlindBoxPrice: z.string().optional(),
  totalItem: z.string().min(1, "Vui lòng nhập tổng số túi mù"),
});

type CreateCollectionForm = z.infer<typeof CreateCollectionSchema>;

export default function FormCreateCollection() {
  const router = useRouter();
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [openCreateProductModal, setOpenCreateProductModal] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [products, setProducts] = useState<TProduct[]>([]);
  const [defaultProduct, setDefaultProduct] = useState<TProduct | undefined>();
  const [editIndex, setEditIndex] = useState<number>();

  const { mutate: mutateCreateCollection, isPending } = useCreateCollection();

  const { handleSubmit, register, formState } = useForm<CreateCollectionForm>({
    resolver: zodResolver(CreateCollectionSchema),
    defaultValues: {
      discountBlindBoxPrice: "",
    },
  });

  const handleRemoveProduct = (index: number) => {
    setProducts((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveImage = (index: number) => () => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = (data: CreateCollectionForm) => {
    mutateCreateCollection(
      {
        ...data,
        blindBoxPrice: +data.blindBoxPrice,
        discountBlindBoxPrice: data.discountBlindBoxPrice
          ? +data.discountBlindBoxPrice
          : 0,
        totalItem: +data.totalItem,
        productDtos: products,
        startTime: dayjs(startDate).toISOString(),
        endTime: dayjs(endDate).toISOString(),
        listImage: images,
      },
      {
        onSuccess: (data) => {
          if (data.isSuccess) {
            toast({ title: "Tạo bộ sưu tập thành công!" });
            router.push("/management/manage-collection");
          } else {
            toast({ title: data.messages[0], variant: "destructive" });
          }
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Tạo Bộ Sưu Tập Mới
          </h1>
          <Button
            type="submit"
            form="create-collection-form"
            className="bg-red-600 hover:bg-red-700 text-white"
            disabled={isPending}
          >
            {isPending ? <LoadingIndicator /> : "Lưu Bộ Sưu Tập"}
          </Button>
        </div>

        <form
          id="create-collection-form"
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Thông tin chung */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="collectionName"
                className="text-sm font-medium text-gray-700"
              >
                Tên Bộ Sưu Tập
              </Label>
              <Input
                id="collectionName"
                placeholder="Nhập tên bộ sưu tập"
                className="bg-white border-gray-300"
                {...register("collectionName")}
              />
              {formState.errors.collectionName && (
                <p className="text-red-500 text-sm">
                  {formState.errors.collectionName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="text-sm font-medium text-gray-700"
              >
                Mô Tả
              </Label>
              <Textarea
                id="description"
                placeholder="Nhập mô tả"
                className="bg-white border-gray-300 min-h-[100px]"
                {...register("description")}
              />
              {formState.errors.description && (
                <p className="text-red-500 text-sm">
                  {formState.errors.description.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="rewards"
                className="text-sm font-medium text-gray-700"
              >
                Phần Thưởng
              </Label>
              <Textarea
                id="rewards"
                placeholder="Nhập phần thưởng khi sưu tập đủ"
                className="bg-white border-gray-300 min-h-[100px]"
                {...register("rewards")}
              />
              {formState.errors.rewards && (
                <p className="text-red-500 text-sm">
                  {formState.errors.rewards.message}
                </p>
              )}
            </div>
          </div>

          {/* Thông tin khác */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Ngày Bắt Đầu
                </Label>
                <Popover>
                  <PopoverTrigger className="w-full h-10 bg-white border border-gray-300 rounded-md flex items-center justify-between px-3 text-gray-700 hover:border-gray-400 transition-colors">
                    <span>{dayjs(startDate).format("DD/MM/YYYY")}</span>
                    <CalendarIcon className="h-4 w-4 text-gray-500" />
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      className="rounded-md border shadow-md"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Ngày Kết Thúc
                </Label>
                <Popover>
                  <PopoverTrigger className="w-full h-10 bg-white border border-gray-300 rounded-md flex items-center justify-between px-3 text-gray-700 hover:border-gray-400 transition-colors">
                    <span>{dayjs(endDate).format("DD/MM/YYYY")}</span>
                    <CalendarIcon className="h-4 w-4 text-gray-500" />
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      className="rounded-md border shadow-md"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="totalItem"
                  className="text-sm font-medium text-gray-700"
                >
                  Tổng Số Túi Mù
                </Label>
                <Input
                  id="totalItem"
                  type="number"
                  placeholder="Nhập số lượng"
                  className="bg-white border-gray-300"
                  {...register("totalItem")}
                />
                {formState.errors.totalItem && (
                  <p className="text-red-500 text-sm">
                    {formState.errors.totalItem.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="blindBoxPrice"
                  className="text-sm font-medium text-gray-700"
                >
                  Giá Túi Mù
                </Label>
                <Input
                  id="blindBoxPrice"
                  type="number"
                  placeholder="Nhập giá"
                  className="bg-white border-gray-300"
                  {...register("blindBoxPrice")}
                />
                {formState.errors.blindBoxPrice && (
                  <p className="text-red-500 text-sm">
                    {formState.errors.blindBoxPrice.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="discountBlindBoxPrice"
                  className="text-sm font-medium text-gray-700"
                >
                  Giảm Giá (Nếu Có)
                </Label>
                <Input
                  id="discountBlindBoxPrice"
                  type="number"
                  placeholder="Nhập giá giảm"
                  className="bg-white border-gray-300"
                  {...register("discountBlindBoxPrice")}
                />
                {formState.errors.discountBlindBoxPrice && (
                  <p className="text-red-500 text-sm">
                    {formState.errors.discountBlindBoxPrice.message}
                  </p>
                )}
              </div>
            </div>

            {/* Hình ảnh */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Danh Sách Hình Ảnh
              </Label>
              <div className="flex flex-wrap gap-4">
                {images.map((image, idx) => (
                  <div key={idx} className="relative">
                    <img
                      src={image}
                      alt={`Hình ảnh ${idx + 1}`}
                      className="w-24 h-24 rounded-md object-cover border border-gray-200 shadow-sm"
                    />
                    <button
                      type="button"
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
                      onClick={handleRemoveImage(idx)}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <ImageUploader
                  onChange={(url) => setImages((prev) => [...prev, url])}
                  showPreview={false}
                  className="w-24 h-24 rounded-md border border-dashed border-gray-300 bg-white flex items-center justify-center hover:border-red-600 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Vật phẩm */}
          <div className="col-span-1 lg:col-span-2 space-y-2">
            <div className="flex items-center gap-4">
              <Label className="text-sm font-medium text-gray-700">
                Danh Sách Vật Phẩm
              </Label>
              <Button
                type="button"
                className="bg-red-600 hover:bg-red-700 text-white w-8 h-8 rounded-full p-0"
                onClick={() => setOpenCreateProductModal(true)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-4">
              {products.length === 0 ? (
                <p className="text-gray-600">
                  Chưa có vật phẩm nào. Nhấn nút "+" để thêm.
                </p>
              ) : (
                products.map((product, index) => (
                  <div
                    key={product.name}
                    className="relative group cursor-pointer"
                    onClick={() => {
                      setOpenCreateProductModal(true);
                      setDefaultProduct(product);
                      setEditIndex(index);
                    }}
                  >
                    <div className="flex flex-col items-center gap-2 bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                      <img
                        src={product.imagePath || "/placeholder.svg"}
                        alt={product.name}
                        className="w-20 h-20 rounded-md object-cover border border-gray-200"
                      />
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-900">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-500">{product.price}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors opacity-0 group-hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveProduct(index);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </form>

        <Dialog
          open={openCreateProductModal}
          onOpenChange={setOpenCreateProductModal}
        >
          <DialogContent className="max-w-lg rounded-xl">
            <DialogHeader>
              <DialogTitle className="text-xl text-gray-900">
                {defaultProduct ? "Chỉnh Sửa Vật Phẩm" : "Tạo Vật Phẩm"}
              </DialogTitle>
            </DialogHeader>
            <FormCreateProduct
              defaultProduct={defaultProduct}
              onSaveProduct={(product) => {
                setProducts((prev) => {
                  const newProducts = [...prev];
                  newProducts[editIndex || 0] = product;
                  return newProducts;
                });
                setOpenCreateProductModal(false);
                setDefaultProduct(undefined);
                setEditIndex(undefined);
              }}
              onCreateProduct={(product) => {
                setProducts((prev) => [...prev, product]);
                setOpenCreateProductModal(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
