import axiosClient from "@/axios-client";
import { Button } from "@/components/ui/button";
import { Sale } from "@/hooks/api/useManageSale";
import { toast } from "@/hooks/use-toast";

export default function RequestSaleDetail({ sale }: { sale: Sale }) {
  console.log({ sale: sale.saleId });

  const handleApproveSale = async () => {
    try {
      const response = await axiosClient.put(
        `/sale/approved-sale?saleId=${sale.saleId}`
      );

      if (response.data.isSuccess) {
        toast({
          title: "Đã duyệt sản phẩm thành công!",
        });
      } else toast({ title: "Duyệt sản phẩm thất bại!" });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex gap-6">
      <img src={sale?.inventory.product.imagePath} alt="w-16 h-16 rounded-md" />
      <div className="flex flex-col gap-2">
        <p className="text-lg font-bold">{sale?.inventory.product.name}</p>
        <p className="text-gray-500 text-sm">
          {sale?.inventory.product.description}
        </p>
        <p className="text-sm">
          <span className="font-semibold">Giá bán:</span>{" "}
          {sale?.unitPrice.toLocaleString()}
        </p>
        <p className="text-sm">
          <span className="font-semibold">Số lượng bán:</span>{" "}
          {sale?.quantitySold}
        </p>
        <p className="text-sm">
          <span className="font-semibold">Người bán:</span>
          {sale?.inventory.account.firstName +
            " " +
            sale?.inventory.account.lastName}
        </p>
        <p className="text-sm">
          <span className="font-semibold">Độ hiếm:</span>{" "}
          {sale?.inventory.product.rarityStatus.dropRate}
        </p>
        <div className="flex gap-4">
          <Button
            className="bg-[#E12E43] text-white hover:bg-[#B71C32]"
            onClick={handleApproveSale}
          >
            Duyệt
          </Button>
        </div>
      </div>
    </div>
  );
}
