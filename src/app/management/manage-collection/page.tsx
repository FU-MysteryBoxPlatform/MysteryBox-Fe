"use client";
import FormCreateCollection from "@/app/components/FormCreateCollection";
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
} from "@/components/ui/dialog";
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
  TCollection,
  useGetCollections,
} from "@/hooks/api/useManageCollection";
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
  const page = params["page"];
  const minPrice = params["minPrice"];
  const maxPrice = params["maxPrice"];

  const [openCreateCollectionModal, setOpenCreateCollectionModal] =
    useState(false);

  const [collections, setCollections] = useState<TCollection[]>([]);
  const [totalPages, setTotalPages] = useState(0);

  const { mutate: mutateGetCollections, isPending } = useGetCollections();

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

  const handleFilterByMinPrice = (value: string) => {
    if (ref.current) {
      clearTimeout(ref.current);
    }
    ref.current = setTimeout(() => {
      params["minPrice"] = value;
      params["page"] = "1";

      router.push(`?${queryString.stringify(params)}`);
    }, 1000);
  };

  const handleFilterByMaxPrice = (value: string) => {
    if (ref.current) {
      clearTimeout(ref.current);
    }
    ref.current = setTimeout(() => {
      params["maxPrice"] = value;
      params["page"] = "1";

      router.push(`?${queryString.stringify(params)}`);
    }, 1000);
  };

  useEffect(() => {
    mutateGetCollections(
      {
        keyword: keyword as string,
        pageNumber: +(page || 1),
        pageSize: 10,
        minimumPrice: minPrice ? +minPrice : undefined,
        maximumPrice: maxPrice ? +maxPrice : undefined,
      },
      {
        onSuccess: (data) => {
          if (data.isSuccess) {
            setCollections(data.result.items);
            setTotalPages(data.result.totalPages);
          }
        },
      }
    );
  }, [keyword, maxPrice, minPrice, mutateGetCollections, page]);

  return (
    <div className="w-full p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 justify-between">
            Bộ sưu tập
            <Button
              className="bg-[#E12E43] text-white hover:bg-[#B71C32]"
              onClick={() => setOpenCreateCollectionModal(true)}
            >
              <PlusIcon className="h-4 w-4" />
              Tạo bộ sưu tập
            </Button>
          </CardTitle>
          <CardDescription>Quản lý tất cả các bộ sưu tập</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-4">
            <Input
              placeholder="Tìm kiếm bộ sưu tập"
              defaultValue={keyword as string}
              onChange={(e) => handleFilterByKeyword(e.target.value)}
            />
            <Input
              placeholder="Giá nhỏ nhất"
              defaultValue={minPrice as string}
              onChange={(e) => handleFilterByMinPrice(e.target.value)}
            />
            <Input
              placeholder="Giá lớn nhất"
              defaultValue={maxPrice as string}
              onChange={(e) => handleFilterByMaxPrice(e.target.value)}
            />
          </div>
          {isPending ? (
            <div className="w-full flex items-center justify-center">
              <LoadingIndicator />
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px] sm:table-cell">
                      Ảnh
                    </TableHead>
                    <TableHead>Tên bộ sưu tập</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Tổng vật phẩm</TableHead>
                    <TableHead className="md:table-cell">
                      Thời gian bắt đầu
                    </TableHead>
                    <TableHead className="md:table-cell">
                      Thời gian kết thúc
                    </TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {collections.map((collection) => (
                    <TableRow key={collection.collectionId}>
                      <TableCell className="sm:table-cell">
                        <img
                          alt="Product image"
                          className="aspect-square rounded-md object-cover w-12 h-12"
                          height="64"
                          src={collection.imagePath}
                          width="64"
                        />
                      </TableCell>
                      <TableCell className="md:table-cell font-medium line-clamp-2">
                        {collection.collectionName}
                      </TableCell>
                      <TableCell className="md:table-cell">
                        {collection.isActived ? "Đã bắt đầu" : "Chưa bắt đầu"}
                      </TableCell>
                      <TableCell className="md:table-cell">
                        {collection.totalItem}
                      </TableCell>
                      <TableCell className="md:table-cell">
                        {dayjs(collection.startTime).format(
                          "YYYY-MM-DD HH:mm A"
                        )}
                      </TableCell>
                      <TableCell className="md:table-cell">
                        {dayjs(collection.endTime).format("YYYY-MM-DD HH:mm A")}
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
                            <DropdownMenuItem>Sửa</DropdownMenuItem>
                            <DropdownMenuItem>Xóa</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {collections.length > 0 ? (
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
                  Không có bộ sưu tập nào
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={openCreateCollectionModal}
        onOpenChange={setOpenCreateCollectionModal}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tạo bộ sưu tập</DialogTitle>
          </DialogHeader>
          <FormCreateCollection />
        </DialogContent>
      </Dialog>
    </div>
  );
}
