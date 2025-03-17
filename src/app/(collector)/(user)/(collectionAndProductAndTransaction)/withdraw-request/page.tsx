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
    {
      walletTransaction: TWithdrawDetail;
      walletRequest: TModWithdraw;
    }[]
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

  const handleFilterByStartDate = (date?: Date) => {
    if (!date) params["startDate"] = null;
    else params["startDate"] = dayjs(date).toISOString();
    params["page"] = "1";
    router.push(`?${queryString.stringify(params)}`);
  };
  const handleFilterByEndDate = (date?: Date) => {
    if (!date) params["endDate"] = null;
    else params["endDate"] = dayjs(date).toISOString();
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
            toast({
              title: "Yêu cầu rút tiền đã được tạo thành công",
            });
            setOpenCreateWithdrawModal(false);
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
    mutateGetAllWithdraw(
      {
        accountId: user?.id || "",
        walletTransactionType: walletTransactionType,
        status: status ? +status : undefined,
        startTime: startDate ? (startDate as string) : undefined,
        endTime: endDate ? (endDate as string) : undefined,
        pageNumber: +(page as string),
        pageSize: 5,
      },
      {
        onSuccess: (data) => {
          if (data.isSuccess) {
            setWithdraws(data.result.items);
            setTotalPages(data.result.totalPages);
          }
        },
      }
    );
  }, [endDate, startDate, mutateGetAllWithdraw, page, user?.id, status]);

  if (isPendingWithdraw) {
    return (
      <div className="flex w-full items-center justify-center h-[70vh]">
        <LoadingIndicator />
      </div>
    );
  }

  const renderWithdrawStatus = (status: number) => {
    switch (status) {
      case 0:
        return "Chờ xử lý";
      case 1:
        return "Đã xử lý";
      case 2:
        return "Đã huỷ";
      case 3:
        return "Hoàn tiền";
      default:
        return "Không xác định";
    }
  };

  const renderColorWithdrawStatus = (status: number) => {
    switch (status) {
      case 0:
        return "text-orange-400";
      case 1:
        return "text-blue-700";
      case 2:
        return "text-green-500";
      case 3:
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="rounded-lg flex-1 max-md:w-full">
      <div>
        <div className="mb-2 md:mb-4 border border-gray-300 px-6 py-4 rounded-lg flex items-center justify-between">
          <p className="text-xl md:text-2xl font-semibold">Yêu cầu rút tiền</p>
          <Button onClick={() => setOpenCreateWithdrawModal(true)}>
            Tạo yêu cầu rút tiền
          </Button>
        </div>
        <div>
          <Card x-chunk="dashboard-06-chunk-0 border-none">
            <CardHeader>
              <CardTitle>Quản lý tất cả yêu cầu rút tiền của bạn</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-6 [&>*]:flex-1">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trạng thái
                  </label>
                  <Select
                    value={status as string}
                    onValueChange={(value: string) =>
                      handleFilterByStatus(value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Chờ xử lý</SelectItem>
                      <SelectItem value="1">Đã xử lý</SelectItem>
                      <SelectItem value="2">Đã huỷ</SelectItem>
                      <SelectItem value="3">Hoàn tiền</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Từ ngày:
                  </label>
                  <div className="relative">
                    <DatePicker
                      className="w-full h-9 [&>div]:border-gray-200 [&>div]:rounded-lg"
                      value={startDate ? new Date(startDate as string) : null}
                      onChange={(value) => {
                        handleFilterByStartDate(value as Date);
                      }}
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Đến ngày:
                  </label>
                  <div className="relative">
                    <DatePicker
                      className="w-full h-9 [&>div]:border-gray-200 [&>div]:rounded-lg"
                      value={endDate ? new Date(endDate as string) : null}
                      onChange={(value) => handleFilterByEndDate(value as Date)}
                    />
                  </div>
                </div>
              </div>
              <div className="grid gap-4 mb-6">
                {withdraws.length > 0 &&
                  withdraws.map((w) => (
                    <div
                      key={w.walletTransaction.walletTransactionId}
                      className="bg-white shadow-lg p-4 rounded-lg my-1 text-sm font-sans"
                    >
                      <div className="flex justify-between">
                        <span className="inline-block">
                          <strong> Mã giao dịch:</strong>{" "}
                          {w.walletTransaction.walletTransactionId}
                        </span>

                        <span className="inline-block text-gray-600 text-sm">
                          {formatDate(w.walletTransaction.timeStamp)}
                        </span>
                      </div>

                      <div className="flex justify-between my-2">
                        <span className="inline-block">
                          <strong className="text-gray-600">Trạng thái</strong>:{" "}
                          <span
                            className={`${renderColorWithdrawStatus(
                              w.walletTransaction.walletTransactionStatusId
                            )}`}
                          >
                            {renderWithdrawStatus(
                              w.walletTransaction.walletTransactionStatusId
                            )}
                          </span>
                        </span>

                        <span className="inline-block text-gray-500 text-sm">
                          Tổng tiền:
                          <strong className="ml-1 text-blue-700 ">
                            {formatPriceVND(w.walletTransaction.amount)}
                          </strong>
                        </span>
                      </div>
                      <div>
                        <button
                          onClick={() => {
                            setOpenDetailModal(true);
                            setConfirmImage(w.walletRequest.image);
                          }}
                          className="text-blue-600 hover:underline"
                        >
                          Xem hình ảnh xác nhận
                        </button>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Pagination */}
              {withdraws.length > 0 && (
                <Paginator
                  currentPage={+(page as string)}
                  totalPages={totalPages}
                  onPageChange={(pageNumber) => {
                    params["page"] = pageNumber.toString();
                    router.push(`?${queryString.stringify(params)}`);
                  }}
                  showPreviousNext
                />
              )}
            </CardContent>
          </Card>

          <Dialog open={openDetailModal} onOpenChange={setOpenDetailModal}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Hình ảnh xác nhận</DialogTitle>
              </DialogHeader>
              <img src={confirmImage} alt="image" className="w-full" />
            </DialogContent>
          </Dialog>
        </div>
        <Dialog
          open={openCreateWithdrawModal}
          onOpenChange={setOpenCreateWithdrawModal}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tạo yêu cầu thanh toán</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <form>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="amount">Số tiền</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Nhập số tiền"
                    {...register("amount")}
                  />
                  {formState.errors.amount && (
                    <p className="text-red-500 text-sm">
                      {formState.errors.amount.message}
                    </p>
                  )}
                </div>
              </form>
              <Button
                className="bg-[#E12E43] text-white hover:bg-[#B71C32] w-full"
                onClick={handleSubmit(onSubmit)}
              >
                Tạo yêu cầu rút tiền
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
