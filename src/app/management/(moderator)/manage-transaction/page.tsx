"use client";
import LoadingIndicator from "@/app/components/LoadingIndicator";
import Paginator from "@/app/components/Paginator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  TTransaction,
  useGetAllTransaction,
} from "@/hooks/api/useTransactions";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import queryString from "query-string";
import { useEffect, useState } from "react";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = queryString.parse(searchParams.toString());
  const page = params["page"] || 1;
  const currTab = params["tab"] || "0";

  const [transactions, setTransactions] = useState<TTransaction[]>();
  const [totalPages, setTotalPages] = useState(0);

  const { data, isLoading, refetch } = useGetAllTransaction(
    +page,
    10,
    +currTab
  );

  useEffect(() => {
    refetch();
  }, [refetch, page, currTab]);

  console.log({ transactions });

  useEffect(() => {
    setTransactions(data?.result.items);
    setTotalPages(data?.result.totalPages || 0);
  }, [data]);

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 justify-between">
            Quản lý giao dịch
          </CardTitle>
          <CardDescription>
            Quản lý tất cả các giao dịch trên hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Tabs */}
          <div className="p-2 flex items-center gap-2 [&>*]:flex-1 bg-gray-100 rounded-md mb-4">
            {TABS.map((tab, idx) => (
              <div
                key={idx}
                className={cn(
                  tab.value === currTab && "bg-[#E12E43] text-white",
                  "text-center rounded-lg cursor-pointer"
                )}
                onClick={() => {
                  params["tab"] = tab.value;
                  router.push(`?${queryString.stringify(params)}`);
                }}
              >
                {tab.title}
              </div>
            ))}
          </div>

          {isLoading ? (
            <div className="w-full flex items-center justify-center">
              <LoadingIndicator />
            </div>
          ) : (
            <>
              <Table className="mb-4">
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên</TableHead>
                    <TableHead>Loại giao dịch</TableHead>
                    <TableHead>Thanh toán</TableHead>
                    <TableHead>Ngày thực hiện</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions?.length && transactions?.length > 0
                    ? transactions?.map((tran, i) => {
                        return (
                          <TableRow key={i}>
                            <TableCell>
                              {tran.account?.firstName +
                                " " +
                                tran.account?.lastName}
                            </TableCell>
                            <TableCell>
                              <div
                                className={cn(
                                  "px-2 py-1 rounded-lg text-white w-fit",
                                  tran.transactionType.name === "TRADING"
                                    ? "bg-orange-500"
                                    : tran.transactionType.name === "SELL"
                                    ? "bg-blue-500"
                                    : "bg-green-500"
                                )}
                              >
                                {tran.transactionType.name === "TRADING"
                                  ? "Giao dịch"
                                  : tran.transactionType.name === "SELL"
                                  ? "Bán"
                                  : "Mua"}
                              </div>
                            </TableCell>

                            <TableCell>{tran.paymentMethod.name}</TableCell>
                            <TableCell>
                              {dayjs(tran.date).format("DD/MM/YYYY HH:mm")}
                            </TableCell>
                          </TableRow>
                        );
                      })
                    : null}
                </TableBody>
              </Table>
              {transactions?.length && transactions.length > 0 ? (
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
    value: "1",
  },
  {
    title: "Thất bại",
    value: "2",
  },
  {
    title: "Đã huỷ",
    value: "3",
  },
];
