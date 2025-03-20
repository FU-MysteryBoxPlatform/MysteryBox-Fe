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
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetAllAuctions } from "@/hooks/api/useAuction";
import { cn } from "@/lib/utils";
import { Auction } from "@/types";
import dayjs from "dayjs";
import { Ellipsis } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import queryString from "query-string";
import { useEffect, useRef, useState } from "react";
import DatePicker from "react-date-picker";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = queryString.parse(searchParams.toString());
  const page = params["page"] || 1;
  const status = params["status"] || "1";
  const keyword = params["keyword"];
  const startDate = params["startDate"];
  const endDate = params["endDate"];
  const ref = useRef<NodeJS.Timeout>(null);

  const [auctions, setAuctions] = useState<Auction[]>();
  const [totalPages, setTotalPages] = useState(0);

  const { mutate: mutateGetAuction, isPending } = useGetAllAuctions();

  const handleFilterByKeyword = (value: string) => {
    if (ref.current) {
      clearTimeout(ref.current);
    }
    ref.current = setTimeout(() => {
      params["keyword"] = value;
      params["page"] = "1";
      router.push(`?${queryString.stringify(params)}`);
    }, 1000);
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

  useEffect(() => {
    mutateGetAuction(
      {
        keyword: keyword as string,
        pageNumber: +(page as string),
        pageSize: 10,
        status: +status,
        startTime: startDate ? (startDate as string) : undefined,
        endTime: endDate ? (endDate as string) : undefined,
      },
      {
        onSuccess: (data) => {
          if (data.isSuccess) {
            setAuctions(data.result.items);
            setTotalPages(data.result.totalPages);
          }
        },
      }
    );
  }, [endDate, keyword, mutateGetAuction, page, startDate, status]);

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 justify-between">
            Quản lý đấu giá
          </CardTitle>
          <CardDescription>
            Quản lý tất cả các yêu cầu đấu giá trên hệ thống
          </CardDescription>
        </CardHeader>
        <div className="p-6">
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
                  router.push(`?${queryString.stringify(params)}`);
                }}
              >
                {tab.title}
              </div>
            ))}
          </div>
          <div className="flex gap-4 [&>*]:flex-1">
            <Input
              placeholder="Tìm kiếm từ khoá"
              defaultValue={keyword as string}
              onChange={(e) => handleFilterByKeyword(e.target.value)}
            />

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
        </div>
        <CardContent>
          {isPending ? (
            <div className="w-full flex items-center justify-center">
              <LoadingIndicator />
            </div>
          ) : (
            <>
              <Table className="mb-4">
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên</TableHead>
                    <TableHead>Vật phẩm</TableHead>
                    <TableHead>Giá bắt đầu</TableHead>
                    <TableHead>Giá hiện tại</TableHead>
                    <TableHead>Ngày bắt đầu</TableHead>
                    <TableHead>Ngày kết thúc</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auctions?.length &&
                    auctions?.length > 0 &&
                    auctions?.map((auc) => {
                      return (
                        <TableRow key={auc.auctionId}>
                          <TableCell>
                            {auc.account.firstName + " " + auc.account.lastName}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <img
                                src={auc.inventory.product.imagePath}
                                alt=""
                                className="w-12 h-12 rounded-md"
                              />
                              <p className="line-clamp-1">
                                {auc.inventory.product.name}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            {auc.minimunBid.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            {auc.currentBid.toLocaleString()}
                          </TableCell>

                          <TableCell>
                            {dayjs(auc.startTime).format("DD/MM/YYYY")}
                          </TableCell>
                          <TableCell>
                            {dayjs(auc.endTime).format("DD/MM/YYYY")}
                          </TableCell>

                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Ellipsis className="h-4 w-4" />
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
              {auctions?.length && auctions.length > 0 ? (
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
                  Không có đơn hàng nào
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
    title: "Hoàn thành",
    value: "1",
  },
  {
    title: "Chờ duyệt",
    value: "0",
  },
  {
    title: "Đã từ chối",
    value: "2",
  },
];
