"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { History } from "lucide-react";
import { useAllSaleByAccountId } from "@/hooks/api/useSale";
import { useContext, useState } from "react";
import { GlobalContext } from "@/provider/global-provider";
import { formatDate, formatPriceVND } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import queryString from "query-string";
import Paginator from "@/app/components/Paginator";
import Link from "next/link";
import LoadingIndicator from "@/app/components/LoadingIndicator";
import SaleStatusBadge from "@/app/components/SaleStatusBadge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import axiosClient from "@/axios-client";
import { toast } from "@/hooks/use-toast";

export default function Page() {
  const { user } = useContext(GlobalContext);
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = queryString.parse(searchParams.toString());
  const page = params["page"] || 1;
  const { data, isPending, refetch } = useAllSaleByAccountId(
    user?.id ?? "",
    +page,
    10
  );
  const totalPages = data?.result.totalPages ?? 0;

  const [saleId, setSaleId] = useState("");
  const [isLoadingCancel, setIsLoadingCancel] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);

  const handleCancelSale = async () => {
    try {
      setIsLoadingCancel(true);
      const response = await axiosClient.put(
        `/sale/cancel-sale?saleId=${saleId}`
      );

      setIsLoadingCancel(false);

      if (response.data.isSuccess) {
        setOpenConfirmModal(false);
        refetch();
        toast({
          title: "Đã huỷ yêu cầu rao bán thành công!",
        });
      } else toast({ title: response.data.messages[0] });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-white rounded-lg">
      <h1 className="text-3xl font-bold text-center mb-4 text-gray-900">
        Lịch Sử Rao Bán
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Theo dõi trạng thái các vật phẩm bạn đã đăng bán
      </p>

      <Card className="shadow-lg border border-gray-200 rounded-xl">
        <CardHeader className="p-6 bg-white border-b border-gray-200">
          <CardTitle className="flex items-center gap-2 text-2xl font-semibold text-gray-900">
            <History className="h-6 w-6 text-emerald-600" />
            Danh Sách Rao Bán
          </CardTitle>
          <CardDescription className="text-gray-600">
            Xem thông tin chi tiết về các vật phẩm đã rao bán và trạng thái hiện
            tại
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {isPending ? (
            <div className="flex justify-center py-12">
              <LoadingIndicator />
            </div>
          ) : (
            <>
              <Table className="bg-white rounded-lg shadow-md border border-gray-200">
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="text-gray-900 font-semibold w-[100px]">
                      ID
                    </TableHead>
                    <TableHead className="text-gray-900 font-semibold">
                      Vật Phẩm
                    </TableHead>
                    <TableHead className="text-gray-900 font-semibold">
                      Giá Bán
                    </TableHead>
                    <TableHead className="text-gray-900 font-semibold">
                      Phí Sàn
                    </TableHead>
                    <TableHead className="text-gray-900 font-semibold">
                      Tổng Giá
                    </TableHead>
                    <TableHead className="text-gray-900 font-semibold hidden md:table-cell">
                      Duyệt Bởi
                    </TableHead>
                    <TableHead className="text-gray-900 font-semibold hidden md:table-cell">
                      Ngày Duyệt
                    </TableHead>
                    <TableHead className="text-gray-900 font-semibold">
                      Trạng Thái
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.result.items.map((item) => (
                    <TableRow
                      key={item.saleId}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <TableCell className="font-mono text-sm text-gray-700">
                        <Link
                          href={`/sale-detail/${item.saleId}`}
                          className="text-emerald-600 hover:underline"
                        >
                          {item.saleId.substring(0, 8)}
                        </Link>
                      </TableCell>
                      <TableCell className="font-medium text-gray-900">
                        {item.inventory.product.name}
                      </TableCell>
                      <TableCell className="text-gray-900 font-semibold">
                        {formatPriceVND(item.unitPrice)}
                      </TableCell>
                      <TableCell className="text-gray-700">
                        {formatPriceVND(item.totalFee)}
                      </TableCell>
                      <TableCell className="text-gray-900 font-semibold">
                        {formatPriceVND(item.totalAmount)}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-gray-700">
                        {item.updateByAccount?.firstName || "-"}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-gray-600 text-sm">
                        {formatDate(item.updateDate) || "-"}
                      </TableCell>
                      <TableCell>
                        <SaleStatusBadge status={item.saleStatus.name} />
                      </TableCell>
                      {item.saleStatus.name === "WaitingForApprove" && (
                        <TableCell>
                          <Button
                            onClick={() => {
                              setSaleId(item.saleId);
                              setOpenConfirmModal(true);
                            }}
                          >
                            Huỷ
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                  {data?.result.items.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center py-12 text-gray-500"
                      >
                        Không có lịch sử rao bán nào
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              {data && data.result.items.length > 0 && (
                <div className="mt-6 flex justify-center">
                  <Paginator
                    currentPage={+(page as string)}
                    totalPages={totalPages}
                    onPageChange={(pageNumber) => {
                      params["page"] = pageNumber.toString();
                      router.push(`?${queryString.stringify(params)}`);
                    }}
                    showPreviousNext
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
      <Dialog open={openConfirmModal} onOpenChange={setOpenConfirmModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận huỷ yêu cầu rao bán</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn huỷ yêu cầu rao bán này không? Hành động này
              sẽ không thể được thu hồi lại.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2">
            <Button onClick={() => setOpenConfirmModal(false)}>Hủy</Button>
            <Button
              onClick={handleCancelSale}
              className="bg-[#E12E43] hover:bg-[#B71C32]"
            >
              {isLoadingCancel ? <LoadingIndicator /> : "Xác nhận"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
