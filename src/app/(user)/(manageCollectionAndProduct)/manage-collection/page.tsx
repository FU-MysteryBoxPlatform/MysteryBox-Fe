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
import { debounce } from "@/utils/functions";
import { updateQueryParam } from "@/utils/query-params";
import dayjs from "dayjs";
import { MoreHorizontal, PlusIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const searchParams = useSearchParams();
  const keywordParam = searchParams.get("keyword");
  const pageParam = searchParams.get("page");
  const minPriceParam = searchParams.get("minPrice");
  const maxPriceParam = searchParams.get("maxPrice");
  const { mutate: mutateGetCollections, isPending } = useGetCollections(1, 10);

  const [openCreateCollectionModal, setOpenCreateCollectionModal] =
    useState(false);

  const [collections, setCollections] = useState<TCollection[]>([]);

  const [page, setPage] = useState(+(pageParam ?? 1));
  const [keyword, setKeyword] = useState(keywordParam ?? "");

  const [minPrice, setMinPrice] = useState(minPriceParam ?? "");
  const [maxPrice, setMaxPrice] = useState(maxPriceParam ?? "");

  const handleFilterByKeyword = (value: string) => {
    debounce(() => {
      updateQueryParam("keyword", value);
      updateQueryParam("page", 1);
      setPage(1);
      setKeyword(value);
    }, 1000)();
  };

  const handleFilterByMinPrice = (value: string) => {
    debounce(() => {
      updateQueryParam("minPrice", value);
      updateQueryParam("page", 1);
      setPage(1);
      setMinPrice(value);
    }, 1000)();
  };

  const handleFilterByMaxPrice = (value: string) => {
    debounce(() => {
      updateQueryParam("maxPrice", value);
      updateQueryParam("page", 1);
      setPage(1);
      setMaxPrice(value);
    }, 1000)();
  };

  useEffect(() => {
    mutateGetCollections(
      {
        keyword,
        minimumPrice: +minPrice,
        maximumPrice: +maxPrice,
      },
      {
        onSuccess: (data) => {
          if (data.isSuccess) {
            setCollections(data.result.items);
          }
        },
      }
    );
  }, [keyword, maxPrice, minPrice, mutateGetCollections]);

  console.log({ collections });

  return (
    <div className="w-full">
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
              defaultValue={keyword}
              onChange={(e) => handleFilterByKeyword(e.target.value)}
            />
            <Input
              placeholder="Giá nhỏ nhất"
              defaultValue={minPrice}
              onChange={(e) => handleFilterByMinPrice(e.target.value)}
            />
            <Input
              placeholder="Giá lớn nhất"
              defaultValue={maxPrice}
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
                  {collections.length > 0 ? (
                    collections.map((collection) => (
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
                          {dayjs(collection.endTime).format(
                            "YYYY-MM-DD HH:mm A"
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
                              <DropdownMenuItem>Sửa</DropdownMenuItem>
                              <DropdownMenuItem>Xóa</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <div>Không có bộ sưu tập nào</div>
                  )}
                </TableBody>
              </Table>

              <Paginator
                currentPage={page}
                totalPages={Math.ceil(SITES.length / 10)}
                onPageChange={(pageNumber) => {
                  setPage(pageNumber);
                  updateQueryParam("page", pageNumber);
                }}
                showPreviousNext
              />
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

const SITES = [
  {
    id: 1,
    name: "Site 1",
    slug: "site-1",
    img: "/mock-images/image1.png",
    createdAt: new Date(),
    status: "draft",
  },
  {
    id: 2,
    name: "Site 2",
    slug: "site-2",
    img: "/mock-images/image2.png",
    createdAt: new Date(),
    status: "draft",
  },
];
