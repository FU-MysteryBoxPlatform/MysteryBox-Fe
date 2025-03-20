"use client";
import LoadingIndicator from "@/app/components/LoadingIndicator";
import Paginator from "@/app/components/Paginator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetAllAccount, useUpRole } from "@/hooks/api/useAccount";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { TAccount } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import queryString from "query-string";
import { useEffect, useRef, useState } from "react";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = queryString.parse(searchParams.toString());
  const page = params["page"] || 1;
  const keyword = params["keyword"] || "";
  const ref = useRef<NodeJS.Timeout>(null);

  const [accounts, setAccounts] = useState<TAccount[]>([]);
  const [totalPages, setTotalPages] = useState(0);

  const { data, refetch, isLoading } = useGetAllAccount(
    +(page as string),
    10,
    keyword as string
  );

  const { mutate: mutateUpRole, isPending } = useUpRole();

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

  const handleUpRole = (id: string, role: string) => () => {
    mutateUpRole(
      {
        accountId: id,
        roleName: role,
      },
      {
        onSuccess: (data) => {
          if (data.isSuccess) {
            toast({ title: "Up role thành công", variant: "default" });
            refetch();
          } else {
            toast({
              title: "Lỗi",
              description: data.messages[0],
              variant: "destructive",
            });
          }
        },
        onError: () => {
          toast({
            title: "Lỗi",
            description: "Đã có lỗi xảy ra khi up role",
            variant: "destructive",
          });
        },
      }
    );
  };

  useEffect(() => {
    refetch();
  }, [refetch, keyword, page]);

  useEffect(() => {
    setAccounts(data?.result.items || []);
    setTotalPages(data?.result.totalPages || 0);
  }, [data]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Card className="shadow-lg border-0">
        <CardHeader className="border-b bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-semibold text-gray-800">
                Quản lý tài khoản
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                Quản lý tất cả các tài khoản trên hệ thống
              </p>
            </div>
            <Input
              placeholder="Tìm kiếm tài khoản..."
              defaultValue={keyword as string}
              onChange={(e) => handleFilterByKeyword(e.target.value)}
              className="w-64 rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <LoadingIndicator />
            </div>
          ) : accounts.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              Không tìm thấy tài khoản nào
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-100">
                      <TableHead className="font-semibold text-gray-700">
                        Tên
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700">
                        Email
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700">
                        SĐT
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700">
                        Vai trò
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700">
                        Thao tác
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {accounts.map((acc) => (
                      <TableRow
                        key={acc.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <TableCell className="font-medium text-gray-900">
                          {acc.firstName + " " + acc.lastName}
                        </TableCell>
                        <TableCell>{acc.email}</TableCell>
                        <TableCell>{acc.phoneNumber || "N/A"}</TableCell>
                        <TableCell>
                          <span
                            className={cn(
                              "inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full",
                              acc.mainRole === "MODERATORS"
                                ? "bg-orange-100 text-orange-800"
                                : acc.mainRole === "COLLECTOR"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-red-100 text-red-800"
                            )}
                          >
                            {acc.mainRole}
                          </span>
                        </TableCell>
                        <TableCell>
                          {acc.mainRole === "COLLECTOR" && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  className="bg-red-600 hover:bg-red-700 transition-colors"
                                  disabled={isPending}
                                >
                                  {isPending ? "Đang xử lý..." : "Up role"}
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem
                                  onClick={handleUpRole(acc.id, "MODERATORS")}
                                  className="flex items-center gap-2"
                                >
                                  {isPending ? (
                                    <LoadingIndicator />
                                  ) : (
                                    "MODERATORS"
                                  )}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="mt-6 flex justify-end">
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
    </div>
  );
}
