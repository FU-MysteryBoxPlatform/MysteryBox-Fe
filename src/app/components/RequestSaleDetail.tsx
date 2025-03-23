import axiosClient from "@/axios-client";
import { Button } from "@/components/ui/button";
import { Sale } from "@/hooks/api/useManageSale";
import { toast } from "@/hooks/use-toast";
import { GlobalContext } from "@/provider/global-provider";
import { useContext, useState } from "react";
import LoadingIndicator from "./LoadingIndicator";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";

export default function RequestSaleDetail({
  sale,
  onApprove,
}: {
  sale: Sale;
  onApprove: () => void;
}) {
  const { user } = useContext(GlobalContext);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCancel, setIsLoadingCancel] = useState(false);
  const [isRemove, setIsRemove] = useState(false);

  const handleApproveSale = async () => {
    try {
      setIsLoading(true);
      const response = await axiosClient.put(
        `/sale/approved-sale?saleId=${sale.saleId}&accountId=${user?.id}`
      );

      setIsLoading(false);

      if (response.data.isSuccess) {
        onApprove();
        toast({
          title: "Đã duyệt sản phẩm thành công!",
        });
      } else toast({ title: response.data.messages[0] });
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancelSale = async () => {
    try {
      setIsLoadingCancel(true);
      const response = await axiosClient.put(
        `/sale/cancel-sale?saleId=${sale.saleId}`
      );

      setIsLoadingCancel(false);

      if (response.data.isSuccess) {
        onApprove();
        toast({
          title: "Đã từ chối yêu cầu rao bán!",
        });
      } else toast({ title: response.data.messages[0] });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex gap-6">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={sale?.inventory?.product?.imagePath}
        alt={sale?.inventory?.product?.name}
        className="w-[400px] h-[400px] rounded-md object-cover aspect-square"
      />
      <div className="flex flex-col gap-2">
        <p className="text-lg font-bold">{sale?.inventory?.product?.name}</p>
        <p className="text-gray-500 text-sm">
          {sale?.inventory?.product?.description}
        </p>
        <p className="text-sm">
          <span className="font-semibold">Giá bán:</span>{" "}
          {sale?.totalAmount.toLocaleString()}
        </p>
        <p className="text-sm">
          <span className="font-semibold">Số lượng bán:</span>{" "}
          {sale?.quantitySold || 1}
        </p>
        <p className="text-sm">
          <span className="font-semibold">Người bán: </span>
          {sale?.inventory?.account?.firstName +
            " " +
            sale?.inventory?.account?.lastName}
        </p>
        <p className="text-sm">
          <span className="font-semibold">Độ hiếm:</span>{" "}
          {sale?.inventory?.product?.rarityStatus?.dropRate}
        </p>
        {sale.saleStatusId === 0 && (
          <div className="flex gap-4 mt-auto [&>*]:flex-1">
            <Button
              className="bg-[#E12E43] text-white hover:bg-[#B71C32]"
              onClick={handleApproveSale}
            >
              {isLoading ? <LoadingIndicator /> : "Duyệt"}
            </Button>
            <Button onClick={() => setOpen(true)}>
              {isLoadingCancel ? <LoadingIndicator /> : "Từ chối"}
            </Button>
          </div>
        )}
        {sale.saleStatusId === 1 && (
          <div className="flex gap-4 mt-auto [&>*]:flex-1">
            <Button
              onClick={() => {
                setOpen(true);
                setIsRemove(true);
              }}
            >
              {isLoadingCancel ? <LoadingIndicator /> : "Gỡ khỏi marketplace"}
            </Button>
          </div>
        )}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader className="font-bold">
            {!isRemove ? "Từ chối yêu cầu rao bán" : "Gỡ vật phẩm rao bán"}
          </DialogHeader>
          <p>
            {!isRemove
              ? "Bạn có chắc chắn mình muốn từ chối yêu cầu rao bán này? Hành động này sẽ không thể được thu hồi lại."
              : "Bạn có chắc chắn mình muốn gỡ vật phẩm rao bán này? Hành động này sẽ không thể được thu hồi lại."}
          </p>
          <div className="flex items-center [&>*]:flex-1 gap-6">
            <Button onClick={() => setOpen(false)}>
              {isLoadingCancel ? <LoadingIndicator /> : "Huỷ"}
            </Button>
            <Button
              className="bg-[#E12E43] text-white hover:bg-[#B71C32]"
              onClick={handleCancelSale}
            >
              {isLoading ? <LoadingIndicator /> : "Xác nhận"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
