"use client";
import * as z from "zod";
import CartIcon from "@/components/icons/CartIcon";
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
import { useToast } from "@/hooks/use-toast";
import { formatPriceVND } from "@/lib/utils";
import { GlobalContext } from "@/provider/global-provider";
import { Ellipsis } from "lucide-react";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSellInventory } from "@/hooks/api/useInventory";
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
}: InventoryCardProps) {
  const [openSellModal, setOpenSellModal] = useState(false);
  const { user, addToCart } = useContext(GlobalContext);
  const { toast } = useToast();
  const route = useRouter();

  const { mutate: mutateSellInventory, isPending } = useSellInventory();

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
            productId: id,
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
        {isPersonal ? (
          <div className="absolute top-2 right-2 p-1 bg-gray-200 rounded-lg flex items-center justify-center cursor-pointer">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Ellipsis className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {status === 0 && (
                  <DropdownMenuItem onClick={() => setOpenSellModal(true)}>
                    Bán
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem>Trao đổi</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div
            className="absolute top-2 right-2 p-1 bg-gray-200 rounded-lg flex items-center justify-center cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              addToCart({ id, image, title, price });
              toast({
                title: "Thêm vào giỏ hàng thành công!",
              });
            }}
          >
            <CartIcon className="" />
          </div>
        )}

        <img
          src={image}
          alt={title}
          loading="lazy"
          onClick={() => route.push(`/sale-detail/${id}`)}
          className="cursor-pointer aspect-square object-cover"
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
    </div>
  );
}
