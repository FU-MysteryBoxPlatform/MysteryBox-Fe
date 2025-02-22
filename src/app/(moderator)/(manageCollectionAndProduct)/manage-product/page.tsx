"use client";

import LoadingIndicator from "@/app/components/LoadingIndicator";
import RequestSaleDetail from "@/app/components/RequestSaleDetail";
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
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Sale, useManageSale } from "@/hooks/api/useManageSale";
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
  //   const saleStatus = params["saleStatus"];

  const [saleData, setSaleData] = useState<Sale[]>([]);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [productSale, setProductSale] = useState<Sale>();

  const { mutate: mutateManageSale, isPending } = useManageSale();

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
    mutateManageSale(
      {
        keyword: keyword as string,
        pageNumber: +(page || 1),
        pageSize: 10,
        saleStatus: 0,
        minimumPrice: minPrice ? +minPrice : undefined,
        maximumPrice: maxPrice ? +maxPrice : undefined,
      },
      {
        onSuccess: (data) => {
          if (data.isSuccess) {
            setSaleData(data.result);
          }
        },
      }
    );
  }, [keyword, maxPrice, minPrice, mutateManageSale, page]);

  return (
    <div className="w-full">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 justify-between">
            Sản phẩm rao bán
          </CardTitle>
          <CardDescription>
            Quản lý tất cả các sản phẩm được người sưu tập rao bán
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-4">
            <Input
              placeholder="Tìm kiếm sản phẩm"
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
                    <TableHead>Tên sản phẩm</TableHead>
                    <TableHead>Số lượng</TableHead>
                    <TableHead>Người bán</TableHead>
                    <TableHead className="md:table-cell">Giá bán</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {saleData?.map((sale) => (
                    <TableRow key={sale.saleId}>
                      <TableCell className="sm:table-cell">
                        <img
                          alt="Product image"
                          className="aspect-square rounded-md object-cover w-12 h-12"
                          height="64"
                          src={sale.inventory.product.imagePath}
                          width="64"
                        />
                      </TableCell>
                      <TableCell className="md:table-cell font-medium line-clamp-2">
                        {sale.inventory.product.name}
                      </TableCell>
                      <TableCell className="md:table-cell">
                        {sale.quantitySold}
                      </TableCell>
                      <TableCell className="md:table-cell">
                        {sale.inventory.account.firstName +
                          " " +
                          sale.inventory.account.lastName}
                      </TableCell>
                      <TableCell className="md:table-cell">
                        {sale.unitPrice.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          className="bg-[#E12E43] text-white hover:bg-[#B71C32]"
                          onClick={() => {
                            setOpenDetailModal(true);
                            setProductSale(sale);
                          }}
                        >
                          Xem chi tiết
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {saleData?.length === 0 && (
                <div className="w-full text-center mt-10">
                  Không có sản phẩm nào
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
      <Dialog open={openDetailModal} onOpenChange={setOpenDetailModal}>
        <DialogContent className="max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Chi tiết sản phẩm</DialogTitle>
          </DialogHeader>
          {productSale && <RequestSaleDetail sale={productSale} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
