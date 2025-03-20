"use client";
import LoadingIndicator from "@/app/components/LoadingIndicator";
import Paginator from "@/app/components/Paginator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TModWithdraw,
  TWithdrawDetail,
  useCreateWithdrawRequest,
  useGetAllWithdraw,
} from "@/hooks/api/useWithdraw";
import { toast } from "@/hooks/use-toast";
import { formatDate, formatPriceVND } from "@/lib/utils";
import { GlobalContext } from "@/provider/global-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import queryString from "query-string";
import { useContext, useEffect, useState } from "react";
import DatePicker from "react-date-picker";
import { useForm } from "react-hook-form";
import { z } from "zod";

const walletTransactionType = 4;

const CreateWithdrawRequestSchema = z.object({
  amount: z.string().min(1, "Vui lòng nhập số tiền"),
});
export type CreateWithdrawRequestForm = z.infer<
  typeof CreateWithdrawRequestSchema
>;

export default function Page() {
  const { user } = useContext(GlobalContext);
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = queryString.parse(searchParams.toString());
  const page = params["page"] || 1;
  const status = params["status"];
  const startDate = params["startDate"];
  const endDate = params["endDate"];

  const [openCreateWithdrawModal, setOpenCreateWithdrawModal] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [confirmImage, setConfirmImage] = useState<string>("");
  const [withdraws, setWithdraws] = useState<
    { walletTransaction: TWithdrawDetail; walletRequest: TModWithdraw }[]
  >([]);
  const [totalPages, setTotalPages] = useState(0);

  const { handleSubmit, register, formState } =
    useForm<CreateWithdrawRequestForm>({
      resolver: zodResolver(CreateWithdrawRequestSchema),
    });

  const { mutate: mutateGetAllWithdraw, isPending: isPendingWithdraw } =
    useGetAllWithdraw();
  const { mutate: mutateCreateWithdrawRequest } = useCreateWithdrawRequest();

  const handleFilterByStatus = (value: string) => {
    params["status"] = value;
    params["page"] = "1";
    router.push(`?${queryString.stringify(params)}`);
  };

  const handleFilterByStartDate = (date: Date | null) => {
    params["startDate"] = date ? dayjs(date).toISOString() : null;
    params["page"] = "1";
    router.push(`?${queryString.stringify(params)}`);
  };

  const handleFilterByEndDate = (date: Date | null) => {
    params["endDate"] = date ? dayjs(date).toISOString() : null;
    params["page"] = "1";
    router.push(`?${queryString.stringify(params)}`);
  };

  const onSubmit = (data: CreateWithdrawRequestForm) => {
    mutateCreateWithdrawRequest(
      {
        accountId: user?.id || "",
        amount: +data.amount,
      },
      {
        onSuccess: (data) => {
          if (data.isSuccess) {
            toast({ title: "Yêu cầu rút tiền đã được tạo thành công" });
            setOpenCreateWithdrawModal(false);
          } else {
            toast({ title: data.messages[0], variant: "destructive" });
          }
        },
      }
    );
  };

  useEffect(() => {
    if (!user?.id) return;
    mutateGetAllWithdraw(
      {
        accountId: user.id,
        walletTransactionType,
        status: status ? +status : undefined,
        startTime: startDate ? (startDate as string) : undefined,
        endTime: endDate ? (endDate as string) : undefined,
        pageNumber: +(page as string),
        pageSize: 5,
      },
      {
        onSuccess: (data) => {
          if (data.isSuccess) {
            setWithdraws(data.result.items || []);
            setTotalPages(data.result.totalPages || 0);
          }
        },
      }
    );
  }, [endDate, startDate, mutateGetAllWithdraw, page, user?.id, status]);

  const statusMap = {
    0: { text: "Chờ xử lý", className: "bg-yellow-100 text-yellow-800" },
    1: { text: "Đã xử lý", className: "bg-green-100 text-green-800" },
    2: { text: "Đã hủy", className: "bg-red-100 text-red-800" },
    3: { text: "Hoàn tiền", className: "bg-blue-100 text-blue-800" },
  };

  const renderWithdrawStatus = (status: keyof typeof statusMap) => {
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-semibold ${
          statusMap[status].className || "bg-gray-100 text-gray-800"
        }`}
      >
        {statusMap[status].text || "Không xác định"}
      </span>
    );
  };

  if (isPendingWithdraw) {
    return (
      <div className="w-full max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <LoadingIndicator />
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Yêu Cầu Rút Tiền</h1>
        <Button
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
          onClick={() => setOpenCreateWithdrawModal(true)}
        >
          Tạo Yêu Cầu Rút Tiền
        </Button>
      </div>

      <Card className="shadow-lg border border-gray-200 rounded-xl">
        <CardHeader className="bg-white border-b border-gray-200">
          <CardTitle className="text-xl font-semibold text-gray-900">
            Quản Lý Yêu Cầu Rút Tiền
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1">
                Trạng thái
              </Label>
              <Select
                value={status as string}
                onValueChange={handleFilterByStatus}
              >
                <SelectTrigger className="w-full bg-white border-gray-300">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Chờ xử lý</SelectItem>
                  <SelectItem value="1">Đã xử lý</SelectItem>
                  <SelectItem value="2">Đã hủy</SelectItem>
                  <SelectItem value="3">Hoàn tiền</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1">
                Từ ngày
              </Label>
              <DatePicker
                className="w-full h-10 [&>div]:border-gray-200 [&>div]:rounded-lg"
                value={startDate ? new Date(startDate as string) : null}
                onChange={(value) => handleFilterByStartDate(value as Date | null)}
              />
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1">
                Đến ngày
              </Label>
              <DatePicker
                className="w-full h-10 [&>div]:border-gray-200 [&>div]:rounded-lg"
                value={endDate ? new Date(endDate as string) : null}
                onChange={(value) => handleFilterByEndDate(value as Date | null)}
              />
            </div>
          </div>

          {withdraws.length === 0 ? (
            <div className="text-center py-12 text-gray-600">
              Bạn chưa có yêu cầu rút tiền nào.
            </div>
          ) : (
            <>
              <div className="grid gap-4 mb-6">
                {withdraws.map((w) => (
                  <div
                    key={w.walletTransaction.walletTransactionId}
                    className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div>
                        <p className="text-sm text-gray-700">
                          <strong>Mã giao dịch:</strong>{" "}
                          {w.walletTransaction.walletTransactionId}
                        </p>
                        <p className="text-sm text-gray-700 mt-1">
                          <strong>Trạng thái:</strong>{" "}
                          {renderWithdrawStatus(
                            w.walletTransaction.walletTransactionStatusId as 0 | 1 | 2 | 3
                          )}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">
                          {formatDate(w.walletTransaction.timeStamp)}
                        </p>
                        <p className="text-sm text-gray-900 font-semibold mt-1">
                          {formatPriceVND(w.walletTransaction.amount)}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="link"
                      className="mt-2 text-emerald-600 hover:underline p-0 h-auto"
                      onClick={() => {
                        setOpenDetailModal(true);
                        setConfirmImage(w.walletRequest.image);
                      }}
                    >
                      Xem hình ảnh xác nhận
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex justify-center">
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
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={openDetailModal} onOpenChange={setOpenDetailModal}>
        <DialogContent className="max-w-lg rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-xl text-gray-900">
              Hình Ảnh Xác Nhận
            </DialogTitle>
          </DialogHeader>
          <img
            src={confirmImage}
            alt="Xác nhận rút tiền"
            className="w-full rounded-lg"
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={openCreateWithdrawModal}
        onOpenChange={setOpenCreateWithdrawModal}
      >
        <DialogContent className="max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-xl text-gray-900">
              Tạo Yêu Cầu Rút Tiền
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label
                htmlFor="amount"
                className="text-sm font-medium text-gray-700"
              >
                Số tiền
              </Label>
              <Input
                id="amount"
                type="number"
                placeholder="Nhập số tiền"
                className="mt-1"
                {...register("amount")}
              />
              {formState.errors.amount && (
                <p className="text-red-500 text-sm mt-1">
                  {formState.errors.amount.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Tạo Yêu Cầu
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
