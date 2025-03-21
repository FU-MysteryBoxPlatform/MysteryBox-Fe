"use client";
import * as z from "zod";
import FormCreateProduct, {
  TProduct,
} from "@/app/components/FormCreateProduct";
import { ImageUploader } from "@/app/components/ImageUpload";
import LoadingIndicator from "@/app/components/LoadingIndicator";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import {
  useGetCollectionById,
  useUpdateCollection,
} from "@/hooks/api/useManageCollection";
import dayjs from "dayjs";
import { ArrowLeft, CalendarIcon, Plus, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { toast } from "@/hooks/use-toast";

const UpdateCollectionSchema = z.object({
  collectionName: z.string().optional(),
  description: z.string().optional(),
  rewards: z.string().optional(),
  blindBoxPrice: z.string().optional(),
  discountBlindBoxPrice: z.string().optional(),
});

type UpdateCollectionForm = z.infer<typeof UpdateCollectionSchema>;

export default function Page() {
  const { id } = useParams();
  const router = useRouter();
  const { data } = useGetCollectionById(id as string);
  const collection = useMemo(() => data?.result, [data]);

  const [openCreateProductModal, setOpenCreateProductModal] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [products, setProducts] = useState<TProduct[]>([]);
  const [defaultProduct, setDefaultProduct] = useState<TProduct | undefined>();
  const [editIndex, setEditIndex] = useState<number>();
  const [startDate, setStartDate] = useState<Date | undefined>(
    new Date(collection?.collection.startTime || "")
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    new Date(collection?.collection.endTime || "")
  );
  const { mutate: mutateUpdateCollection, isPending } = useUpdateCollection();

  const { handleSubmit, register, setValue, formState } =
    useForm<UpdateCollectionForm>({
      defaultValues: {
        collectionName: collection?.collection.collectionName,
        description: collection?.collection.description,
        rewards: collection?.collection.rewards,
        blindBoxPrice: collection?.collection.blindBoxPrice.toString(),
        discountBlindBoxPrice:
          collection?.collection.discountBlindBoxPrice.toString(),
      },
      resolver: zodResolver(UpdateCollectionSchema),
    });

  const handleRemoveImage = (index: number) => () => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleRemoveProduct = (index: number) => {
    setProducts((prevProducts) => prevProducts.filter((_, i) => i !== index));
  };

  const onSubmit = (data: UpdateCollectionForm) => {
    mutateUpdateCollection(
      {
        ...data,
        blindBoxPrice: +(data.blindBoxPrice || 0),
        discountBlindBoxPrice: +(data.discountBlindBoxPrice || 0),
        updateProductDtos: products,
        startTime: dayjs(startDate)?.toISOString(),
        endTime: dayjs(endDate)?.toISOString(),
        imagePath: images[0],
        collectionId: id as string,
      },
      {
        onSuccess: (data) => {
          if (data.isSuccess) {
            toast({
              title: "Cập nhật bộ sưu tập thành công!",
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
    if (collection) {
      setValue("collectionName", collection.collection.collectionName);
      setValue("description", collection.collection.description);
      setValue("blindBoxPrice", collection.collection.blindBoxPrice.toString());
      setValue(
        "discountBlindBoxPrice",
        collection.collection.discountBlindBoxPrice.toString()
      );
      setValue("rewards", collection.collection.rewards);
      setStartDate(new Date(collection.collection.startTime));
      setEndDate(new Date(collection.collection.endTime));
      setImages(collection?.collectionImage.map((image) => image.path) || []);
      setProducts(
        collection.products.map((p) => {
          return {
            productId: p.productId,
            name: p.name,
            description: p.description,
            price: p.price,
            discount: p.discount,
            rarityStatusId: p.rarityStatus.id,
            productStatusId: p.productStatus.id,
            imagePath: p.imagePath,
          } as TProduct;
        }) || []
      );
    }
  }, [collection, setValue]);

  return (
    <div className="w-full max-w-7xl mx-auto p-8 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <ArrowLeft
            className="w-6 h-6 text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
            onClick={() => router.push("/management/manage-collection")}
          />
          <h1 className="text-2xl font-semibold text-gray-800">
            Cập nhật bộ sưu tập
          </h1>
        </div>
        <Button
          form="sell-inventory-form"
          type="button"
          className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-2 rounded-lg transition-colors"
          disabled={isPending}
          onClick={handleSubmit(onSubmit)}
        >
          {isPending ? <LoadingIndicator /> : "Lưu bộ sưu tập"}
        </Button>
      </div>

      {/* Form */}
      <form
        id="sell-inventory-form"
        className="bg-white p-6 rounded-lg shadow-sm"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Collection Name */}
          <div className="col-span-2 space-y-2">
            <Label
              htmlFor="collectionName"
              className="text-gray-700 font-medium"
            >
              Tên bộ sưu tập
            </Label>
            <Input
              id="collectionName"
              placeholder="Nhập tên bộ sưu tập"
              className="border-gray-300 focus:ring-red-500 focus:border-red-500"
              {...register("collectionName")}
            />
            {formState.errors.collectionName && (
              <p className="text-red-500 text-sm">
                {formState.errors.collectionName.message}
              </p>
            )}
          </div>

          {/* Description & Rewards */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-700 font-medium">
              Mô tả
            </Label>
            <Textarea
              id="description"
              placeholder="Nhập mô tả"
              className="border-gray-300 focus:ring-red-500 focus:border-red-500"
              {...register("description")}
            />
            {formState.errors.description && (
              <p className="text-red-500 text-sm">
                {formState.errors.description.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="rewards" className="text-gray-700 font-medium">
              Phần thưởng
            </Label>
            <Textarea
              id="rewards"
              placeholder="Nhập phần thưởng"
              className="border-gray-300 focus:ring-red-500 focus:border-red-500"
              {...register("rewards")}
            />
            {formState.errors.rewards && (
              <p className="text-red-500 text-sm">
                {formState.errors.rewards.message}
              </p>
            )}
          </div>

          {/* Dates */}
          <div className="space-y-2">
            <Label className="text-gray-700 font-medium">Ngày bắt đầu</Label>
            <Popover>
              <PopoverTrigger className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md flex justify-between items-center hover:border-red-500 transition-colors">
                <p>{dayjs(startDate).format("DD/MM/YYYY")}</p>
                <CalendarIcon className="text-gray-500" />
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
          <div className="space-y-2">
            <Label className="text-gray-700 font-medium">Ngày kết thúc</Label>
            <Popover>
              <PopoverTrigger className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md flex justify-between items-center hover:border-red-500 transition-colors">
                <p>{dayjs(endDate).format("DD/MM/YYYY")}</p>
                <CalendarIcon className="text-gray-500" />
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

          {/* Prices */}
          <div className="space-y-2">
            <Label
              htmlFor="blindBoxPrice"
              className="text-gray-700 font-medium"
            >
              Giá túi mù
            </Label>
            <Input
              id="blindBoxPrice"
              type="number"
              placeholder="Nhập giá túi mù"
              className="border-gray-300 focus:ring-red-500 focus:border-red-500"
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
              className="text-gray-700 font-medium"
            >
              Giảm giá túi mù
            </Label>
            <Input
              id="discountBlindBoxPrice"
              type="number"
              placeholder="Nhập giảm giá túi mù"
              className="border-gray-300 focus:ring-red-500 focus:border-red-500"
              {...register("discountBlindBoxPrice")}
            />
            {formState.errors.discountBlindBoxPrice && (
              <p className="text-red-500 text-sm">
                {formState.errors.discountBlindBoxPrice.message}
              </p>
            )}
          </div>

          {/* Images */}
          <div className="col-span-2 space-y-2">
            <Label className="text-gray-700 font-medium">
              Danh sách hình ảnh
            </Label>
            <div className="flex flex-wrap gap-4">
              {images.map((image, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={image}
                    className="w-28 h-28 rounded-md object-cover border border-gray-200"
                  />
                  <div
                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
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
                className="w-28 h-28 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center hover:border-red-500 transition-colors"
              />
            </div>
          </div>

          {/* Products */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-gray-700 font-medium">
                Danh sách vật phẩm
              </Label>
              <Button
                type="button"
                className="bg-red-600 hover:bg-red-700 text-white w-8 h-8 rounded-full flex items-center justify-center"
                onClick={() => setOpenCreateProductModal(true)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {products.map((product, index) => (
                <div
                  key={index}
                  className="relative bg-white p-3 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => {
                    setOpenCreateProductModal(true);
                    setDefaultProduct(product);
                    setEditIndex(index);
                  }}
                >
                  <img
                    src={product.imagePath}
                    alt="Product image"
                    className="w-full h-24 object-cover rounded-md mb-2"
                  />
                  <p className="text-sm font-medium text-gray-800">
                    {product.name}
                  </p>
                  <p className="text-xs text-gray-500">{product.price}</p>
                  <div
                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveProduct(index);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </form>

      {/* Modal */}
      <Dialog
        open={openCreateProductModal}
        onOpenChange={setOpenCreateProductModal}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl text-gray-800">
              Tạo vật phẩm
            </DialogTitle>
          </DialogHeader>
          <FormCreateProduct
            defaultProduct={defaultProduct}
            onSaveProduct={(product) => {
              setProducts((prevProducts) => {
                const newProducts = [...prevProducts];
                newProducts[editIndex || 0] = product;
                return newProducts;
              });
              setOpenCreateProductModal(false);
              setDefaultProduct(undefined);
              setEditIndex(undefined);
            }}
            onCreateProduct={(product) => {
              setProducts((prevProducts) => [...prevProducts, product]);
              setOpenCreateProductModal(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
