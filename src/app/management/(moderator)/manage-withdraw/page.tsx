"use client";
import { ImageUploader } from "@/app/components/ImageUpload";
import LoadingIndicator from "@/app/components/LoadingIndicator";
import Paginator from "@/app/components/Paginator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  TModWithdraw,
  useConfirmWalletRequest,
  useGetAllWalletRequest,
} from "@/hooks/api/useWithdraw";
import { toast } from "@/hooks/use-toast";
import { cn, formatPriceVND } from "@/lib/utils";
import { GlobalContext } from "@/provider/global-provider";
import dayjs from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import queryString from "query-string";
import { useContext, useEffect, useState } from "react";
import DatePicker from "react-date-picker";

const FormApprove = ({
  requestId,
  onFinish,
}: {
  requestId: string;
  onFinish?: () => void;
}) => {
  const { user } = useContext(GlobalContext);
  const [image, setImage] = useState<string>("");

  const { mutate: mutateConfirm, isPending } = useConfirmWalletRequest();

  const handleApprove = () => {
    mutateConfirm(
      {
        walletRequestId: requestId,
        accountId: user?.id || "",
        image,
      },
      {
        onSuccess: (data) => {
          if (data.isSuccess) {
            toast({
              title: "Xác nhận thành công",
            });
            onFinish?.();
          } else {
            toast({
              title: data.messages[0],
            });
          }
        },
      }
    );
  };

  return (
    <div className="grid gap-6">
      <ImageUploader
        showPreview
        onChange={(url) => setImage(url)}
        className="w-full"
      />

      <Button onClick={handleApprove} className="w-full">
        {isPending ? <LoadingIndicator /> : "Xác nhận"}
      </Button>
    </div>
  );
};

export default function Page() {
  const { user } = useContext(GlobalContext);
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = queryString.parse(searchParams.toString());
  const page = params["page"] || 1;
  const status = params["status"] || "0";
  const startDate = params["startDate"];
  const endDate = params["endDate"];

  const [openApproveModal, setOpenApproveModal] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [withdraws, setWithdraws] = useState<TModWithdraw[]>([]);
  const [detailWithdraw, setDetailWithdraw] = useState<TModWithdraw>();
  const [totalPages, setTotalPages] = useState(0);

  const { mutate: mutateGetAllWithdraw, isPending: isPendingWithdraw } =
    useGetAllWalletRequest();

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

  useEffect(() => {
    mutateGetAllWithdraw(
      {
        walletRequestType: 1,
        walletRequestStatus: status ? +status : 0,
        startTime: startDate ? (startDate as string) : undefined,
        endTime: endDate ? (endDate as string) : undefined,
        pageNumber: +(page as string),
        pageSize: 10,
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

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 justify-between">
            Quản lý yêu cầu rút tiền
          </CardTitle>
          <CardDescription>
            Quản lý tất cả các yêu cầu rút tiền trên hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Tabs */}
          <div className="p-2 flex items-center gap-2 [&>*]:flex-1 bg-gray-100 rounded-md mb-4">
            {TABS.map((tab, idx) => (
              <div
                key={idx}
                className={cn(
                  tab.value === status && "bg-[#E12E43] text-white",
                  "text-center rounded-lg cursor-pointer"
                )}
                onClick={() => {
                  params["status"] = tab.value;
                  params["page"] = "1";
                  router.push(`?${queryString.stringify(params)}`);
                }}
              >
                {tab.title}
              </div>
            ))}
          </div>

          <div className="flex gap-4 [&>*]:flex-1 mb-4">
            <DatePicker
              className="w-full h-9 [&>div]:border-gray-200 [&>div]:rounded-lg"
              value={startDate ? new Date(startDate as string) : null}
              onChange={(value) => {
                handleFilterByStartDate(value as Date);
              }}
            />
            <DatePicker
              className="w-full h-9 [&>div]:border-gray-200 [&>div]:rounded-lg"
              value={endDate ? new Date(endDate as string) : null}
              onChange={(value) => handleFilterByEndDate(value as Date)}
            />
          </div>

          {isPendingWithdraw ? (
            <div className="w-full flex items-center justify-center">
              <LoadingIndicator />
            </div>
          ) : (
            <>
              <Table className="mb-4">
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên</TableHead>
                    <TableHead>Tổng tiền</TableHead>
                    <TableHead>Tài khoản</TableHead>
                    <TableHead>Ngày thực hiện</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {withdraws?.length && withdraws?.length > 0
                    ? withdraws?.map((w, i) => {
                        return (
                          <TableRow key={i}>
                            <TableCell>
                              {w.createByAccount.firstName +
                                " " +
                                w.createByAccount.lastName}
                            </TableCell>

                            <TableCell>
                              {formatPriceVND(w.walletTransaction.amount)}
                            </TableCell>
                            <TableCell>{w.bankAccount}</TableCell>
                            <TableCell>
                              {dayjs(w.createDate).format("DD/MM/YYYY HH:mm")}
                            </TableCell>
                            {w.walletRequestStatus.name === "PENDING" && (
                              <TableCell>
                                <Dialog
                                  open={openApproveModal}
                                  onOpenChange={setOpenApproveModal}
                                >
                                  <DialogTrigger className="text-blue-400">
                                    Xác nhận
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>
                                        Xác nhận yêu cầu rút tiền
                                      </DialogTitle>
                                    </DialogHeader>
                                    <FormApprove
                                      requestId={w.walletRequestId}
                                      onFinish={() => {
                                        setOpenApproveModal(false);
                                        mutateGetAllWithdraw(
                                          {
                                            walletRequestType: 1,
                                            walletRequestStatus: status
                                              ? +status
                                              : 0,
                                            startTime: startDate
                                              ? (startDate as string)
                                              : undefined,
                                            endTime: endDate
                                              ? (endDate as string)
                                              : undefined,
                                            pageNumber: +(page as string),
                                            pageSize: 10,
                                          },
                                          {
                                            onSuccess: (data) => {
                                              if (data.isSuccess) {
                                                setWithdraws(data.result.items);
                                                setTotalPages(
                                                  data.result.totalPages
                                                );
                                              }
                                            },
                                          }
                                        );
                                      }}
                                    />
                                  </DialogContent>
                                </Dialog>
                              </TableCell>
                            )}
                            {w.walletRequestStatus.name === "COMPELETED" && (
                              <TableCell>
                                <Button
                                  onClick={() => {
                                    setOpenDetailModal(true);
                                    setDetailWithdraw(w);
                                  }}
                                >
                                  Chi tiết
                                </Button>
                              </TableCell>
                            )}
                          </TableRow>
                        );
                      })
                    : null}
                </TableBody>
              </Table>
              {withdraws?.length && withdraws.length > 0 ? (
                <Paginator
                  currentPage={+(page as string)}
                  totalPages={totalPages}
                  onPageChange={(pageNumber) => {
                    params["page"] = pageNumber.toString();
                    router.push(`?${queryString.stringify(params)}`);
                  }}
                  showPreviousNext
                />
              ) : (
                <div className="w-full text-center mt-10">
                  Không có giao dịch nào
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
      <Dialog open={openDetailModal} onOpenChange={setOpenDetailModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chi tiết yêu cầu rút tiền</DialogTitle>
          </DialogHeader>
          <div className="grid gap-2">
            <p>
              Mã yêu cầu:{" "}
              <span className="font-semibold">
                {detailWithdraw?.walletRequestId}
              </span>
            </p>
            <p>
              Ngày yêu cầu:{" "}
              <span className="font-semibold">
                {dayjs(detailWithdraw?.createDate).format("DD/MM/YYYY")}
              </span>
            </p>
            <p>
              Tên người yêu cầu:{" "}
              <span className="font-semibold">
                {detailWithdraw?.createByAccount.firstName}{" "}
                {detailWithdraw?.createByAccount.lastName}
              </span>
            </p>
            <p>
              Tên người xác nhận:{" "}
              <span className="font-semibold">
                {detailWithdraw?.walletRequestStatus.name === "COMPELETED"
                  ? detailWithdraw?.updateByAccount.firstName +
                    " " +
                    detailWithdraw?.updateByAccount.lastName
                  : "--"}
              </span>
            </p>
            <p>Hình ảnh xác nhận:</p>
            <img src={detailWithdraw?.image} alt="image" className="w-full" />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const TABS = [
  {
    title: "Đang chờ",
    value: "0",
  },
  {
    title: "Thành công",
    value: "2",
  },
  {
    title: "Đã huỷ",
    value: "1",
  },
  {
    title: "Hoàn tiền",
    value: "3",
  },
];
