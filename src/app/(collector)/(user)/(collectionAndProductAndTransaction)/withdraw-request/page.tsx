"use client";
import LoadingIndicator from "@/app/components/LoadingIndicator";
import Paginator from "@/app/components/Paginator";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  useGetAllWithdraw,
} from "@/hooks/api/useWithdraw";
import { formatDate, formatPriceVND } from "@/lib/utils";
import { GlobalContext } from "@/provider/global-provider";
import dayjs from "dayjs";
import { CalendarIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import queryString from "query-string";
import { useContext, useEffect, useState } from "react";

const walletTransactionType = 4;

export default function Page() {
  const { user } = useContext(GlobalContext);
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = queryString.parse(searchParams.toString());
  const page = params["page"] || 1;
  const status = params["status"];
  const startDate = params["startDate"];
  const endDate = params["endDate"];

  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [confirmImage, setConfirmImage] = useState<string>("");
  const [withdraws, setWithdraws] = useState<
    {
      walletTransaction: TWithdrawDetail;
      walletRequest: TModWithdraw;
    }[]
  >([]);
  const [totalPages, setTotalPages] = useState(0);

  const { mutate: mutateGetAllWithdraw, isPending: isPendingWithdraw } =
    useGetAllWithdraw();

  const handleFilterByStatus = (value: string) => {
    params["status"] = value;
    params["page"] = "1";
    router.push(`?${queryString.stringify(params)}`);
  };

  const handleFilterByStartDate = (date?: Date) => {
    params["startDate"] = dayjs(date).toISOString();
    params["page"] = "1";
    router.push(`?${queryString.stringify(params)}`);
  };
  const handleFilterByEndDate = (date?: Date) => {
    params["endDate"] = dayjs(date).toISOString();
    params["page"] = "1";
    router.push(`?${queryString.stringify(params)}`);
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
        <p className="text-xl md:text-2xl font-semibold mb-2 md:mb-4 border border-gray-300 px-6 py-4 rounded-lg">
          Yêu cầu rút tiền
        </p>
        <div>
          <Card x-chunk="dashboard-06-chunk-0 border-none">
            <CardHeader>
              <CardTitle>Quản lý tất cả yêu cầu rút tiền của bạn</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-6 [&>*]:flex-1">
                <Select
                  value={status as string}
                  onValueChange={(value: string) => handleFilterByStatus(value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Chờ xử lý</SelectItem>
                    <SelectItem value="1">Đã xử lý</SelectItem>
                    <SelectItem value="2">Đã huỷ</SelectItem>
                    <SelectItem value="3">Hoàn tiền</SelectItem>
                  </SelectContent>
                </Select>
                <Popover>
                  <PopoverTrigger className="px-2 py-1 text-sm rounded-md border border-gray-300 flex justify-between items-center">
                    <p>{dayjs(startDate as string).format("DD/MM/YYYY")}</p>
                    <CalendarIcon />
                  </PopoverTrigger>
                  <PopoverContent>
                    <Calendar
                      mode="single"
                      selected={
                        startDate
                          ? dayjs(startDate as string).toDate()
                          : undefined
                      }
                      onSelect={(date) => handleFilterByStartDate(date)}
                      className="rounded-md border w-fit"
                    />
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger className="px-2 py-1 text-sm rounded-md border border-gray-300 flex justify-between items-center">
                    <p>{dayjs(endDate as string).format("DD/MM/YYYY")}</p>
                    <CalendarIcon />
                  </PopoverTrigger>
                  <PopoverContent>
                    <Calendar
                      mode="single"
                      selected={
                        endDate ? dayjs(endDate as string).toDate() : undefined
                      }
                      onSelect={(date) => handleFilterByEndDate(date)}
                      className="rounded-md border w-fit"
                    />
                  </PopoverContent>
                </Popover>
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
      </div>
    </div>
  );
}
