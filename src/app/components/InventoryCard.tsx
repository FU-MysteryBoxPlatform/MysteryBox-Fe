"use client";
import CartIcon from "@/components/icons/CartIcon";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSellInventory } from "@/hooks/api/useInventory";
import { useGetCollectionDetail } from "@/hooks/api/useUnboxBlindBox";
import { useToast } from "@/hooks/use-toast";
import { formatPriceVND } from "@/lib/utils";
import { GlobalContext } from "@/provider/global-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { Ellipsis } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import LoadingIndicator from "./LoadingIndicator";

export type InventoryCardProps = {
  id: string;
  image: string;
  title: string;
  price: number;
  stock: number;
  status: number;
  showPrice?: boolean;
  isPersonal?: boolean;
  collectionId: string;
};
const SellInventorySchema = z.object({
  quantity: z.string(),
  price: z.string(),
});

type SellInventoryForm = z.infer<typeof SellInventorySchema>;

export default function InventoryCard({
  id,
  image,
  title,
  price,
  stock,
  status,
  showPrice = true,
  isPersonal = false,
  collectionId,
}: InventoryCardProps) {
  const [openPreview, setOpenPreview] = useState(false);
  const [openSellModal, setOpenSellModal] = useState(false);
  const { user, addToCart } = useContext(GlobalContext);
  const { toast } = useToast();
  const router = useRouter();

  const { data, refetch } = useGetCollectionDetail(collectionId);
  const { mutate: mutateSellInventory, isPending } = useSellInventory();

  const collectionData = useMemo(() => data?.result, [data]);

  console.log({ collectionData });

  const { handleSubmit, register, formState, setError } =
    useForm<SellInventoryForm>({
      resolver: zodResolver(SellInventorySchema),
    });

  const onSubmit = (data: SellInventoryForm) => {
    if (+data.quantity > stock) {
      setError("quantity", {
        message: "Số lượng bán vượt quá số lượng bạn sở hữu",
      });
      return;
    }

    mutateSellInventory(
      {
        accountId: user?.id || "",
        sellerItems: [
          {
            inventoryId: id,
            quantity: +data.quantity,
            price: +data.price,
          },
        ],
      },
      {
        onSuccess: (data) => {
          if (data.isSuccess) {
            toast({
              title: "Rao bán vật phẩm thành công!",
            });
            setOpenSellModal(false);
          } else toast({ title: "Rao bán vật phẩm thất bại!" });
        },
      }
    );
  };

  return (
    <div className="flex flex-col">
      <div className="relative">
        <div className="absolute top-2 left-2 rounded-full flex items-center justify-center text-xs w-6 h-6 bg-gray-200">
          x{stock}
        </div>
        {isPersonal ? (
          <div className="absolute top-2 right-2 p-1 bg-gray-200 rounded-sm flex items-center justify-center cursor-pointer">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Ellipsis className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {status === 0 && !collectionId && (
                  <DropdownMenuItem onClick={() => setOpenSellModal(true)}>
                    Bán
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem>Trao đổi</DropdownMenuItem>

                {collectionId && (
                  <DropdownMenuItem
                    onClick={() => {
                      router.push(
                        `/unbox?inventoryId=${id}&collectionId=${collectionId}`
                      );
                    }}
                  >
                    Mở túi mù
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div
            className="absolute top-2 right-2 p-2 bg-gray-200 rounded-sm flex items-center justify-center cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              addToCart({ saleId: id, image, title, price });
              toast({
                title: "Thêm vào giỏ hàng thành công!",
              });
            }}
          >
            <CartIcon className="w-4 h-4" />
          </div>
        )}

        <Image
          src={image}
          alt={title}
          width={120}
          height={120}
          onClick={() => router.push(`/sale-detail/${id}`)}
          className="cursor-pointer w-full aspect-square object-cover border border-gray-200"
        />
      </div>
      <p className="font-semibold mt-2 line-clamp-2">{title}</p>
      {showPrice && (
        <p className="text-sm text-gray-500">{formatPriceVND(price)}</p>
      )}

      <Dialog open={openSellModal} onOpenChange={setOpenSellModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Bán vật phẩm{" "}
              <span className="text-[#E12E43] font-bold">{title}</span>
            </DialogTitle>
            <DialogDescription>
              Bạn đang có{" "}
              <span className="text-[#E12E43] font-bold">{stock}</span> vật phẩm
              này. Nhập những thông tin dưới đây để rao bán vật phẩm của bạn
            </DialogDescription>
          </DialogHeader>
          <form className="grid gap-4" id="sell-inventory-form">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="price">Giá bán (VND)</Label>
              <Input
                id="price"
                type="number"
                placeholder="Nhập giá bán"
                {...register("price")}
              />
              {formState.errors.price && (
                <p className="text-red-500 text-sm">
                  {formState.errors.price.message}
                </p>
              )}
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="quantity">Số lượng bán</Label>
              <Input
                id="quantity"
                type="number"
                placeholder="Nhập số lượng bán"
                {...register("quantity")}
              />
              {formState.errors.quantity && (
                <p className="text-red-500 text-sm">
                  {formState.errors.quantity.message}
                </p>
              )}
            </div>
          </form>
          <Button
            form="sell-inventory-form"
            type="button"
            className="bg-[#E12E43] hover:bg-[#B71C32]"
            disabled={isPending}
            onClick={handleSubmit(onSubmit)}
          >
            {isPending ? <LoadingIndicator /> : "Xác nhận bán"}
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={openPreview} onOpenChange={setOpenPreview}>
        <DialogContent className="max-w-[70vw]">
          <DialogHeader>
            <DialogTitle className="text-[#E12E43] font-bold">
              {collectionData?.collection.collectionName}
            </DialogTitle>
            <DialogDescription>
              Bạn sẽ nhận được một trong số những vật phẩm dưới đây
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 mb-10">
            {collectionData?.products.map((product) => (
              <div
                key={product.productId}
                className="flex items-center justify-between"
              >
                <div className="flex flex-col space-x-2">
                  <img
                    src={product.imagePath}
                    alt={product.name}
                    loading="lazy"
                    className="rounded-lg min-w-full aspect-square object-cover"
                  />
                  <p className="text-sm font-semibold line-clamp-1">
                    {product.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatPriceVND(product.price)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Button
            className="bg-[#E12E43] hover:bg-[#B71C32] w-full"
            onClick={() => {
              router.push(
                `/unbox?inventoryId=${id}&collectionId=${collectionId}`
              );
            }}
          >
            Mở túi mù
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
