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
import { useContext, useEffect, useState, useMemo } from "react";
import DatePicker from "react-date-picker";

// Form xác nhận
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
      { walletRequestId: requestId, accountId: user?.id || "", image },
      {
        onSuccess: (data) => {
          toast({
            title: data.isSuccess ? "Xác nhận thành công" : data.messages[0],
            variant: data.isSuccess ? "default" : "destructive",
          });
          if (data.isSuccess) onFinish?.();
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      <ImageUploader
        showPreview
        onChange={setImage}
        className="w-full rounded-lg border border-gray-200"
      />
      <Button
        onClick={handleApprove}
        className="w-full bg-green-600 hover:bg-green-700"
        disabled={isPending}
      >
        {isPending ? <LoadingIndicator /> : "Xác nhận"}
      </Button>
    </div>
  );
};

// Component Tabs
const FilterTabs = ({
  status,
  onChange,
}: {
  status: string;
  onChange: (value: string) => void;
}) => (
  <div className="grid grid-cols-4 gap-2 p-2 bg-gray-100 rounded-lg">
    {TABS.map((tab) => (
      <Button
        key={tab.value}
        variant={tab.value === status ? "default" : "outline"}
        className={cn(
          "py-2 text-sm font-medium transition-all",
          tab.value === status && "bg-[#E12E43] text-white hover:bg-[#c12739]"
        )}
        onClick={() => onChange(tab.value)}
      >
        {tab.title}
      </Button>
    ))}
  </div>
);

// Component chính
export default function WithdrawManagementPage() {
  const { user } = useContext(GlobalContext);
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = useMemo(
    () => queryString.parse(searchParams.toString()),
    [searchParams]
  );
  const page = Number(params.page || 1);
  const status = params.status || "0";
  const startDate = params.startDate;
  const endDate = params.endDate;

  const [openApproveModal, setOpenApproveModal] = useState(false);
  const [approveRequestId, setApproveRequestId] = useState<string>();
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [withdraws, setWithdraws] = useState<TModWithdraw[]>([]);
  const [detailWithdraw, setDetailWithdraw] = useState<TModWithdraw>();
  const [totalPages, setTotalPages] = useState(0);

  const { mutate: mutateGetAllWithdraw, isPending: isPendingWithdraw } =
    useGetAllWalletRequest();

  const fetchWithdraws = () => {
    mutateGetAllWithdraw(
      {
        walletRequestType: 1,
        walletRequestStatus: Number(status),
        startTime: startDate as string | undefined,
        endTime: endDate as string | undefined,
        pageNumber: page,
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
  };

  const handleFilterByDate = (key: "startDate" | "endDate", date?: Date) => {
    const newParams: { [key: string]: any } = { ...params, page: "1" };
    newParams[key] = date ? dayjs(date).toISOString() : null;
    router.push(`?${queryString.stringify(newParams)}`);
  };

  useEffect(() => {
    fetchWithdraws();
  }, [page, status, startDate, endDate]);

  console.log({ withdraws });

  return (
    <div className="container mx-auto py-8">
      <Card className="shadow-lg">
        <CardHeader className="border-b">
          <CardTitle className="text-2xl font-semibold text-gray-800">
            Quản lý yêu cầu rút tiền
          </CardTitle>
          <CardDescription className="text-gray-600">
            Theo dõi và xử lý tất cả yêu cầu rút tiền trên hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <FilterTabs
            status={status as string}
            onChange={(value) => {
              router.push(
                `?${queryString.stringify({
                  ...params,
                  status: value,
                  page: "1",
                })}`
              );
            }}
          />

          <div className="grid grid-cols-2 gap-4 my-6">
            <DatePicker
              className="w-full h-10 rounded-lg border-gray-200"
              value={startDate ? new Date(startDate as string) : null}
              onChange={(value) =>
                handleFilterByDate("startDate", value as Date)
              }
              clearIcon={null}
            />
            <DatePicker
              className="w-full h-10 rounded-lg border-gray-200"
              value={endDate ? new Date(endDate as string) : null}
              onChange={(value) => handleFilterByDate("endDate", value as Date)}
              clearIcon={null}
            />
          </div>

          {isPendingWithdraw ? (
            <div className="flex justify-center py-10">
              <LoadingIndicator />
            </div>
          ) : withdraws.length > 0 ? (
            <>
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>Tên</TableHead>
                    <TableHead>Tổng tiền</TableHead>
                    <TableHead>Tài khoản</TableHead>
                    <TableHead>Ngày thực hiện</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {withdraws.map((w) => (
                    <TableRow
                      key={w.walletRequestId}
                      className="hover:bg-gray-100"
                    >
                      <TableCell>
                        {w.createByAccount.firstName}{" "}
                        {w.createByAccount.lastName}
                      </TableCell>
                      <TableCell>
                        {formatPriceVND(w.walletTransaction.amount)}
                      </TableCell>
                      <TableCell>{w.bankAccount}</TableCell>
                      <TableCell>
                        {dayjs(w.createDate).format("DD/MM/YYYY HH:mm")}
                      </TableCell>
                      <TableCell>
                        {w.walletRequestStatus.name === "PENDING" ? (
                          <Button
                            variant="link"
                            className="text-blue-600"
                            onClick={() => {
                              setOpenApproveModal(true);
                              setApproveRequestId(w.walletRequestId);
                            }}
                          >
                            Xác nhận
                          </Button>
                        ) : w.walletRequestStatus.name === "COMPELETED" ? (
                          <Button
                            variant="outline"
                            onClick={() => {
                              setDetailWithdraw(w);
                              setOpenDetailModal(true);
                            }}
                          >
                            Chi tiết
                          </Button>
                        ) : null}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-6 flex justify-center">
                <Paginator
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={(pageNumber) =>
                    router.push(
                      `?${queryString.stringify({
                        ...params,
                        page: pageNumber,
                      })}`
                    )
                  }
                  showPreviousNext
                />
              </div>
            </>
          ) : (
            <div className="text-center py-10 text-gray-500">
              Không có giao dịch nào
            </div>
          )}
        </CardContent>
      </Card>
      <Dialog open={openApproveModal} onOpenChange={setOpenApproveModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận yêu cầu rút tiền</DialogTitle>
          </DialogHeader>
          <FormApprove
            requestId={approveRequestId || ""}
            onFinish={() => {
              fetchWithdraws();
              setOpenApproveModal(false);
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={openDetailModal} onOpenChange={setOpenDetailModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Chi tiết yêu cầu rút tiền</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm">
            <p>
              <strong>Mã yêu cầu:</strong> {detailWithdraw?.walletRequestId}
            </p>
            <p>
              <strong>Ngày yêu cầu:</strong>{" "}
              {dayjs(detailWithdraw?.createDate).format("DD/MM/YYYY")}
            </p>
            <p>
              <strong>Người yêu cầu:</strong>{" "}
              {detailWithdraw?.createByAccount.firstName}{" "}
              {detailWithdraw?.createByAccount.lastName}
            </p>
            <p>
              <strong>Người xác nhận:</strong>{" "}
              {detailWithdraw?.walletRequestStatus.name === "COMPELETED"
                ? `${detailWithdraw?.updateByAccount.firstName} ${detailWithdraw?.updateByAccount.lastName}`
                : "--"}
            </p>
            <p>
              <strong>Hình ảnh xác nhận:</strong>
            </p>
            <img
              src={detailWithdraw?.image}
              alt="Confirmation"
              className="w-full rounded-lg border"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const TABS = [
  { title: "Đang chờ", value: "0" },
  { title: "Thành công", value: "2" },
  { title: "Đã huỷ", value: "1" },
  { title: "Hoàn tiền", value: "3" },
];
