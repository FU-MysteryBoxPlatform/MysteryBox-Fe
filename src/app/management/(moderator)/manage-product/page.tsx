"use client";
import LoadingIndicator from "@/app/components/LoadingIndicator";
import RequestSaleDetail from "@/app/components/RequestSaleDetail";
import SaleStatusBadge from "@/app/components/SaleStatusBadge";
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
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import queryString from "query-string";
import { useEffect, useRef, useState } from "react";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = queryString.parse(searchParams.toString());
  const ref = useRef<NodeJS.Timeout>(null);

  const currTab = params["tab"] || "1";
  const keyword = params["keyword"];
  const page = params["page"] || "1";
  const minPrice = params["minPrice"];
  const maxPrice = params["maxPrice"];

  const [saleData, setSaleData] = useState<Sale[]>([]);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [productSale, setProductSale] = useState<Sale>();

  const { mutate: mutateManageSale, isPending } = useManageSale();

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

  const refetchSaleData = () => {
    setOpenDetailModal(false);
    mutateManageSale(
      {
        keyword: keyword as string,
        pageNumber: +page,
        pageSize: 10,
        saleStatus: +currTab,
        minimumPrice: minPrice ? +minPrice : undefined,
        maximumPrice: maxPrice ? +maxPrice : undefined,
      },
      {
        onSuccess: (data) => {
          if (data.isSuccess) {
            setSaleData(data.result.items || []);
          }
        },
      }
    );
  };

  useEffect(() => {
    mutateManageSale(
      {
        keyword: keyword as string,
        pageNumber: +page,
        pageSize: 10,
        saleStatus: +currTab,
        minimumPrice: minPrice ? +minPrice : undefined,
        maximumPrice: maxPrice ? +maxPrice : undefined,
      },
      {
        onSuccess: (data) => {
          if (data.isSuccess) {
            setSaleData(data.result.items || []);
          }
        },
      }
    );
  }, [currTab, keyword, maxPrice, minPrice, mutateManageSale, page]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="shadow-lg border border-gray-200 rounded-xl">
          <CardHeader className="bg-white border-b border-gray-200">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Quản Lý Sản Phẩm Rao Bán
            </CardTitle>
            <CardDescription className="text-gray-600 mt-1">
              Xem và quản lý tất cả sản phẩm được người sưu tập rao bán
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-6 bg-gray-100 p-2 rounded-lg">
              {TABS.map((tab, idx) => (
                <button
                  key={idx}
                  className={cn(
                    "flex-1 py-2 px-4 text-center rounded-md text-sm font-medium transition-colors min-w-[100px]",
                    tab.value === currTab
                      ? "bg-red-600 text-white"
                      : "text-gray-700 hover:bg-gray-200"
                  )}
                  onClick={() => {
                    params["tab"] = tab.value;
                    params["page"] = "1";
                    router.push(`?${queryString.stringify(params)}`);
                  }}
                >
                  {tab.title}
                </button>
              ))}
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <Input
                placeholder="Tìm kiếm sản phẩm"
                defaultValue={keyword as string}
                onChange={(e) => handleFilterByKeyword(e.target.value)}
                className="bg-white border-gray-300"
              />
              <Input
                placeholder="Giá nhỏ nhất"
                defaultValue={minPrice as string}
                onChange={(e) => handleFilterByMinPrice(e.target.value)}
                type="number"
                className="bg-white border-gray-300"
              />
              <Input
                placeholder="Giá lớn nhất"
                defaultValue={maxPrice as string}
                onChange={(e) => handleFilterByMaxPrice(e.target.value)}
                type="number"
                className="bg-white border-gray-300"
              />
            </div>

            {isPending ? (
              <div className="flex justify-center py-12">
                <LoadingIndicator />
              </div>
            ) : saleData.length === 0 ? (
              <div className="text-center py-12 text-gray-600">
                Không có sản phẩm nào phù hợp với bộ lọc.
              </div>
            ) : (
              <Table className="bg-white rounded-lg shadow-md border border-gray-200">
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="w-[100px] font-semibold text-gray-900">
                      Ảnh
                    </TableHead>
                    <TableHead className="font-semibold text-gray-900">
                      Tên Sản Phẩm
                    </TableHead>
                    <TableHead className="font-semibold text-gray-900">
                      Người Bán
                    </TableHead>
                    <TableHead className="md:table-cell font-semibold text-gray-900">
                      Giá Bán
                    </TableHead>
                    <TableHead className="md:table-cell font-semibold text-gray-900">
                      Phí Sàn
                    </TableHead>
                    <TableHead className="md:table-cell font-semibold text-gray-900">
                      Tổng Cộng
                    </TableHead>
                    <TableHead className="font-semibold text-gray-900">
                      Trạng Thái
                    </TableHead>
                    <TableHead className="font-semibold text-gray-900">
                      Thao Tác
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {saleData.map((sale) => (
                    <TableRow
                      key={sale.saleId}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <TableCell>
                        <img
                          alt={sale.inventory?.product?.name}
                          className="aspect-square rounded-md object-cover w-12 h-12 border border-gray-200"
                          src={
                            sale.inventory?.product?.imagePath ||
                            "/placeholder.svg"
                          }
                        />
                      </TableCell>
                      <TableCell className="font-medium text-gray-900 line-clamp-2">
                        {sale.inventory?.product?.name || "Không xác định"}
                      </TableCell>
                      <TableCell className="text-gray-700">
                        {sale.inventory?.account?.firstName}{" "}
                        {sale.inventory?.account?.lastName}
                      </TableCell>
                      <TableCell className="md:table-cell text-gray-700">
                        {sale.unitPrice.toLocaleString()} VND
                      </TableCell>
                      <TableCell className="md:table-cell text-gray-700">
                        {sale.totalFee.toLocaleString()} VND
                      </TableCell>
                      <TableCell className="md:table-cell text-gray-700">
                        {sale.totalAmount.toLocaleString()} VND
                      </TableCell>
                      <TableCell>
                        <SaleStatusBadge status={sale.saleStatus.name} />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          className="border-red-600 text-red-600 hover:bg-red-50"
                          onClick={() => {
                            setOpenDetailModal(true);
                            setProductSale(sale);
                          }}
                        >
                          Xem Chi Tiết
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Dialog open={openDetailModal} onOpenChange={setOpenDetailModal}>
          <DialogContent className="max-w-2xl rounded-xl">
            <DialogHeader>
              <DialogTitle className="text-xl text-gray-900">
                Chi Tiết Sản Phẩm
              </DialogTitle>
            </DialogHeader>
            {productSale && (
              <RequestSaleDetail
                sale={productSale}
                onApprove={refetchSaleData}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

const TABS = [
  { title: "Có Sẵn", value: "1" },
  { title: "Chờ Duyệt", value: "0" },
  { title: "Hết Hàng", value: "2" },
  { title: "Đã Ngưng", value: "3" },
  { title: "Đã Hủy", value: "4" },
];
