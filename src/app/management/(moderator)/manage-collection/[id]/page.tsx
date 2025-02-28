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
    <div className="w-full p-6">
      <div className="flex mb-6 items-center justify-between">
        <div className="flex items-center gap-2">
          <ArrowLeft
            className="w-6 h-6 text-gray-500 cursor-pointer"
            onClick={() => router.push("/management/manage-collection")}
          />
          <p className="text-lg font-bold">Tạo bộ sưu tập mới</p>
        </div>
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
            <div
              key={index}
              className="flex space-y-1.5 relative cursor-pointer"
              onClick={() => {
                setOpenCreateProductModal(true);
                setDefaultProduct(product);
                setEditIndex(index);
              }}
            >
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
