"use client";
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
            toast({ title: "Up role thành công" });
            refetch();
          } else toast({ title: data.messages[0] });
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
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 justify-between">
            Quản lý tài khoản
          </CardTitle>
          <CardDescription>
            Quản lý tất cả các tài khoản trên hệ thống
          </CardDescription>
          <Input
            placeholder="Tìm kiếm tài khoản"
            defaultValue={keyword as string}
            onChange={(e) => handleFilterByKeyword(e.target.value)}
          />
        </CardHeader>
        <CardContent>
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
                    <TableHead>Email</TableHead>
                    <TableHead>SĐT</TableHead>
                    <TableHead>Vai trò</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accounts?.length > 0 &&
                    accounts?.map((acc) => (
                      <TableRow key={acc.id}>
                        <TableCell>
                          {acc.firstName + " " + acc.lastName}
                        </TableCell>
                        <TableCell>{acc.email}</TableCell>

                        <TableCell>{acc.phoneNumber}</TableCell>
                        <TableCell>
                          <div
                            className={cn(
                              "px-2 py-1 text-sm text-white w-fit rounded-lg",
                              acc.mainRole === "MODERATORS"
                                ? "bg-orange-500"
                                : acc.mainRole === "COLLECTOR"
                                ? "bg-blue-500"
                                : "bg-red-500"
                            )}
                          >
                            {acc.mainRole}
                          </div>
                        </TableCell>

                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button className="bg-[#E12E43] hover:bg-[#B71C32]">
                                Up role
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {acc.mainRole !== "ADMIN" && (
                                <DropdownMenuItem
                                  onClick={handleUpRole(acc.id, "ADMIN")}
                                >
                                  {isPending ? <LoadingIndicator /> : "ADMIN"}
                                </DropdownMenuItem>
                              )}
                              {acc.mainRole !== "MODERATORS" && (
                                <DropdownMenuItem
                                  onClick={handleUpRole(acc.id, "ADMIN")}
                                >
                                  {isLoading ? (
                                    <LoadingIndicator />
                                  ) : (
                                    "MODERATORS"
                                  )}
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              {accounts.length > 0 ? (
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
                  Không có tài khoản nào
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
