"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  TReport,
  useGetAllReport,
  useUpdateStatusReport,
} from "@/hooks/api/useReport";
import { GlobalContext } from "@/provider/global-provider";
import { useRouter, useSearchParams } from "next/navigation";
import queryString from "query-string";
import { useContext, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import LoadingIndicator from "@/app/components/LoadingIndicator";
import Paginator from "@/app/components/Paginator";
import dayjs from "dayjs";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

export default function Page() {
  const { user } = useContext(GlobalContext);
  const [reports, setReports] = useState<TReport[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = queryString.parse(searchParams.toString());
  const page = params["page"] || "1";
  const status = params["status"] || "0";
  const [totalPages, setTotalPages] = useState(0);

  const { mutate: mutateGetAllReport, isPending } = useGetAllReport();
  const { mutate: mutateUpdateStatusReport } = useUpdateStatusReport();

  const handleUpdateStatusReport = (reportId: string, statusUpdate: number) => {
    mutateUpdateStatusReport(
      {
        accountId: user?.id || "",
        reportId: reportId,
        reportStatus: statusUpdate,
      },
      {
        onSuccess: (data) => {
          if (data.isSuccess) {
            toast({
              title: "Đã cập nhật trạng thái thành công",
            });
            mutateGetAllReport(
              {
                reportStatus: status ? +status : undefined,
                pageNumber: +page,
                pageSize: 10,
              },
              {
                onSuccess: (data) => {
                  if (data.isSuccess) {
                    setReports(data.result.items);
                    setTotalPages(data.result.totalPages);
                  }
                },
              }
            );
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
    mutateGetAllReport(
      {
        reportStatus: status ? +status : undefined,
        pageNumber: +page,
        pageSize: 10,
      },
      {
        onSuccess: (data) => {
          if (data.isSuccess) {
            setReports(data.result.items);
            setTotalPages(data.result.totalPages);
          }
        },
      }
    );
  }, [mutateGetAllReport, user?.id, status, page]);

  console.log({ reports });

  return (
    <Card className="shadow-lg border border-gray-200 rounded-xl">
      <CardHeader className="bg-white border-b border-gray-200">
        <CardTitle className="text-2xl font-bold text-gray-900">
          Quản Lý Báo Cáo
        </CardTitle>
        <CardDescription className="text-gray-600 mt-1">
          Xem và quản lý tất cả các báo cáo trên hệ thống
        </CardDescription>
      </CardHeader>

      <div className="p-6">
        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6 bg-gray-100 p-2 rounded-lg">
          {TABS.map((tab, idx) => (
            <button
              key={idx}
              className={cn(
                "flex-1 py-2 text-center rounded-md text-sm font-medium transition-colors",
                tab.value === status
                  ? "bg-red-600 text-white"
                  : "text-gray-700 hover:bg-gray-200"
              )}
              onClick={() => {
                params["status"] = tab.value;
                params["page"] = "1";
                router.push(`?${queryString.stringify(params)}`);
              }}
            >
              {tab.title}
            </button>
          ))}
        </div>
      </div>

      <CardContent className="p-6 pt-0">
        {isPending ? (
          <div className="flex justify-center py-12">
            <LoadingIndicator />
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            Không có báo cáo nào
          </div>
        ) : (
          <>
            <Table className="bg-white rounded-lg shadow-md border border-gray-200">
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="font-semibold text-gray-900">
                    Người báo cáo
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900">
                    Nguời bán
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900">
                    Lý do
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900">
                    Trạng thái
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900">
                    Ngày báo cáo
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900">
                    Thao Tác
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((r) => {
                  return (
                    <TableRow
                      key={r.reportId}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <TableCell className="text-gray-900">
                        {r.createByAccount?.firstName}{" "}
                        {r.createByAccount?.lastName}
                      </TableCell>
                      <TableCell className="text-gray-700">
                        {r.saleAccount?.firstName} {r.saleAccount?.lastName}
                      </TableCell>
                      <TableCell className="text-gray-700">
                        {r.reason}
                      </TableCell>
                      <TableCell
                        className={cn(
                          r.reportStatusId === 0
                            ? "text-yellow-500"
                            : r.reportStatusId === 1
                            ? "text-green-500"
                            : "text-red-500"
                        )}
                      >
                        {r.reportStatusId === 0
                          ? "Chờ xác nhận"
                          : r.reportStatusId === 1
                          ? "Đã xác nhận"
                          : "Đã hủy"}
                      </TableCell>
                      <TableCell className="text-gray-700">
                        {dayjs(r.createDate).format("DD/MM/YYYY HH:mm")}
                      </TableCell>
                      <TableCell>
                        {r.reportStatusId === 0 ? (
                          <div className="flex items-center gap-2">
                            <Button
                              variant="secondary"
                              onClick={() =>
                                handleUpdateStatusReport(r.reportId, 1)
                              }
                            >
                              Xác nhận
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() =>
                                handleUpdateStatusReport(r.reportId, 2)
                              }
                            >
                              Hủy
                            </Button>
                          </div>
                        ) : (
                          "--"
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            <div className="mt-6 flex justify-center">
              <Paginator
                currentPage={+page}
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
  );
}

const TABS = [
  { title: "Đang chờ duyệt", value: "0" },
  { title: "Đã duyệt", value: "1" },
  { title: "Đã Hủy", value: "2" },
];
