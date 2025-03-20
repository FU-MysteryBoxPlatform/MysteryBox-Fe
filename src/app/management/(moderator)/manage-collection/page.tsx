"use client";
import LoadingIndicator from "@/app/components/LoadingIndicator";
import Paginator from "@/app/components/Paginator";
import axiosClient from "@/axios-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DialogContent, DialogHeader } from "@/components/ui/dialog";
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
import {
  TCollectionWithProgress,
  useGetCollections,
} from "@/hooks/api/useManageCollection";
import { toast } from "@/hooks/use-toast";
import { Dialog } from "@radix-ui/react-dialog";
import dayjs from "dayjs";
import { MoreHorizontal, PlusIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import queryString from "query-string";
import { useEffect, useRef, useState } from "react";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = queryString.parse(searchParams.toString());
  const ref = useRef<NodeJS.Timeout>(null);

  const keyword = params["keyword"];
  const page = params["page"] || 1;
  const minPrice = params["minPrice"];
  const maxPrice = params["maxPrice"];

  const [open, setOpen] = useState(false);
  const [collectionDeleteId, setCollectionDeleteId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [collections, setCollections] = useState<TCollectionWithProgress[]>([]);
  const [totalPages, setTotalPages] = useState(0);

  const { mutate: mutateGetCollections, isPending } = useGetCollections();

  const handleFilterByKeyword = (value: string) => {
    if (ref.current) clearTimeout(ref.current);
    ref.current = setTimeout(() => {
      params["keyword"] = value || null;
      params["page"] = "1";
      router.push(`?${queryString.stringify(params)}`);
    }, 1000);
  };

  const handleFilterByMinPrice = (value: string) => {
    if (ref.current) clearTimeout(ref.current);
    ref.current = setTimeout(() => {
      params["minPrice"] = value || null;
      params["page"] = "1";
      router.push(`?${queryString.stringify(params)}`);
    }, 1000);
  };

  const handleFilterByMaxPrice = (value: string) => {
    if (ref.current) clearTimeout(ref.current);
    ref.current = setTimeout(() => {
      params["maxPrice"] = value || null;
      params["page"] = "1";
      router.push(`?${queryString.stringify(params)}`);
    }, 1000);
  };

  const handleDeleteCollection = async () => {
    try {
      setIsLoading(true);
      const response = await axiosClient.delete(
        `/collection/delete-colleciton?collectionId=${collectionDeleteId}`
      );
      setIsLoading(false);

      if (response.data.isSuccess) {
        toast({ title: "Đã xóa thành công" });
        mutateGetCollections(
          {
            keyword: keyword as string,
            pageNumber: +page,
            pageSize: 10,
            minimumPrice: minPrice ? +minPrice : undefined,
            maximumPrice: maxPrice ? +maxPrice : undefined,
          },
          {
            onSuccess: (data) => {
              if (data.isSuccess) {
                setCollections(data.result.items || []);
                setTotalPages(data.result.totalPages || 0);
              }
            },
          }
        );
      } else {
        toast({ title: response.data.messages[0], variant: "destructive" });
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      toast({ title: "Đã xảy ra lỗi khi xóa", variant: "destructive" });
    }
  };

  useEffect(() => {
    mutateGetCollections(
      {
        keyword: keyword as string,
        pageNumber: +page,
        pageSize: 10,
        minimumPrice: minPrice ? +minPrice : undefined,
        maximumPrice: maxPrice ? +maxPrice : undefined,
      },
      {
        onSuccess: (data) => {
          if (data.isSuccess) {
            setCollections(data.result.items || []);
            setTotalPages(data.result.totalPages || 0);
          }
        },
      }
    );
  }, [keyword, maxPrice, minPrice, mutateGetCollections, page]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className=" px-4 sm:px-6 lg:px-8 py-12">
        <Card className="shadow-lg border border-gray-200 rounded-xl">
          <CardHeader className="bg-white border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Quản Lý Bộ Sưu Tập
                </CardTitle>
                <CardDescription className="text-gray-600 mt-1">
                  Xem và quản lý tất cả các bộ sưu tập
                </CardDescription>
              </div>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={() =>
                  router.push("/management/manage-collection/create")
                }
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Tạo Bộ Sưu Tập
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <Input
                placeholder="Tìm kiếm bộ sưu tập"
                defaultValue={keyword as string}
                onChange={(e) => handleFilterByKeyword(e.target.value)}
                className="bg-white border-gray-300"
              />
              <Input
                placeholder="Giá nhỏ nhất"
                defaultValue={minPrice as string}
                onChange={(e) => handleFilterByMinPrice(e.target.value)}
                className="bg-white border-gray-300"
                type="number"
              />
              <Input
                placeholder="Giá lớn nhất"
                defaultValue={maxPrice as string}
                onChange={(e) => handleFilterByMaxPrice(e.target.value)}
                className="bg-white border-gray-300"
                type="number"
              />
            </div>

            {isPending ? (
              <div className="flex justify-center py-12">
                <LoadingIndicator />
              </div>
            ) : collections.length === 0 ? (
              <div className="text-center py-12 text-gray-600">
                Không có bộ sưu tập nào phù hợp với bộ lọc.
              </div>
            ) : (
              <>
                <Table className="bg-white rounded-lg shadow-md border border-gray-200">
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="w-[100px] font-semibold text-gray-900">
                        Ảnh
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900">
                        Tên Bộ Sưu Tập
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900">
                        Trạng Thái
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900">
                        Tổng Vật Phẩm
                      </TableHead>
                      <TableHead className="md:table-cell font-semibold text-gray-900">
                        Thời Gian Bắt Đầu
                      </TableHead>
                      <TableHead className="md:table-cell font-semibold text-gray-900">
                        Thời Gian Kết Thúc
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900">
                        Thao Tác
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {collections.map((collection) => (
                      <TableRow
                        key={collection.collection.collectionId}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <TableCell>
                          <img
                            alt={collection.collection.collectionName}
                            className="aspect-square rounded-md object-cover w-12 h-12 border border-gray-200"
                            src={
                              collection.collection.imagePath ||
                              "/placeholder.svg"
                            }
                          />
                        </TableCell>
                        <TableCell className="font-medium text-gray-900 line-clamp-2">
                          {collection.collection.collectionName}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              collection.collection.isActived
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {collection.collection.isActived
                              ? "Đang hoạt động"
                              : "Chưa hoạt động"}
                          </span>
                        </TableCell>
                        <TableCell className="text-gray-700">
                          {collection.collection.totalItem}
                        </TableCell>
                        <TableCell className="md:table-cell text-gray-700">
                          {dayjs(collection.collection.startTime).format(
                            "DD/MM/YYYY HH:mm"
                          )}
                        </TableCell>
                        <TableCell className="md:table-cell text-gray-700">
                          {dayjs(collection.collection.endTime).format(
                            "DD/MM/YYYY HH:mm"
                          )}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                aria-haspopup="true"
                                size="icon"
                                variant="ghost"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() =>
                                  router.push(
                                    `/management/manage-collection/${collection.collection.collectionId}`
                                  )
                                }
                              >
                                Sửa
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setOpen(true);
                                  setCollectionDeleteId(
                                    collection.collection.collectionId
                                  );
                                }}
                              >
                                Xóa
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
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

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-md rounded-xl">
            <DialogHeader>
              <h2 className="text-xl font-bold text-gray-900">
                Xóa Bộ Sưu Tập
              </h2>
            </DialogHeader>
            <p className="text-gray-600">
              Bạn có chắc chắn muốn xóa bộ sưu tập này? Hành động này không thể
              hoàn tác.
            </p>
            <div className="flex items-center gap-4 mt-4">
              <Button
                variant="outline"
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100"
                onClick={() => setOpen(false)}
              >
                Hủy
              </Button>
              <Button
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={handleDeleteCollection}
                disabled={isLoading}
              >
                {isLoading ? <LoadingIndicator /> : "Xác Nhận"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
