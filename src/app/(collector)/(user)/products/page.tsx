"use client";
import { Skeleton } from "@/components/ui/skeleton";
import {
  TCollectionWithProgress,
  useGetCollections,
} from "@/hooks/api/useManageCollection";
import { formatPriceVND } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function Page() {
  const [items, setItems] = useState<TCollectionWithProgress[]>([]);
  const getData = useGetCollections();
  const router = useRouter();

  // State cho các bộ lọc
  const [filters, setFilters] = useState({
    keyword: "",
    minimumPrice: 0,
    maximumPrice: 0,
    startTime: "",
    endTime: "",
    pageNumber: 1,
    pageSize: 10,
  });

  // State để lưu giá trị hiển thị (formatted)
  const [displayPrices, setDisplayPrices] = useState({
    minimumPrice: "",
    maximumPrice: "",
  });

  // Hàm format số thành chuỗi có dấu chấm
  const formatNumber = (value: number | string) => {
    if (!value) return "";
    return Number(value).toLocaleString("vi-VN"); // Format kiểu 1.000.000
  };

  // Hàm fetch dữ liệu với bộ lọc
  const fetchData = async () => {
    try {
      const data = await getData.mutateAsync({
        ...filters,
        minimumPrice: Number(filters.minimumPrice) || 0,
        maximumPrice: Number(filters.maximumPrice) || 0,
        startTime: filters.startTime || undefined,
        endTime: filters.endTime || undefined,
      });
      setItems(data.result.items);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Gọi fetchData khi filters thay đổi
  useEffect(() => {
    fetchData();
  }, [filters.pageNumber, filters.pageSize]);

  // Xử lý thay đổi input
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "minimumPrice" || name === "maximumPrice") {
      // Loại bỏ dấu chấm để lấy giá trị số gốc
      const rawValue = value.replace(/\./g, "");
      const numericValue = rawValue ? Number(rawValue) : 0;

      // Cập nhật filters với giá trị số gốc
      setFilters((prev) => ({
        ...prev,
        [name]: numericValue,
      }));

      // Cập nhật giá trị hiển thị (formatted)
      setDisplayPrices((prev) => ({
        ...prev,
        [name]: formatNumber(rawValue),
      }));
    } else {
      // Các input khác (keyword, startTime, endTime)
      setFilters((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Xử lý áp dụng bộ lọc
  const applyFilters = () => {
    fetchData();
  };

  // Reset bộ lọc
  const resetFilters = () => {
    setFilters({
      keyword: "",
      minimumPrice: 0,
      maximumPrice: 0,
      startTime: "",
      endTime: "",
      pageNumber: 1,
      pageSize: 10,
    });
    setDisplayPrices({
      minimumPrice: "",
      maximumPrice: "",
    });
  };

  return (
    <div>
      <div className="max-w-[1280px] mx-auto px-4 md:px-10 lg:px-16">
        <div className="flex gap-10 py-10 max-md:flex-col">
          {/* Bộ lọc */}
          <div className="md:min-w-[250px] lg:min-w-[300px] bg-white p-6 rounded-lg shadow-md">
            <p className="text-xl font-semibold mb-6">Bộ lọc</p>

            {/* Keyword */}
            <div className="mb-4">
              <Label htmlFor="keyword" className="text-base font-semibold">
                Từ khóa
              </Label>
              <Input
                id="keyword"
                name="keyword"
                value={filters.keyword}
                onChange={handleFilterChange}
                placeholder="Nhập từ khóa..."
                className="mt-1"
              />
            </div>

            {/* Giá tối thiểu */}
            <div className="mb-4">
              <Label htmlFor="minimumPrice" className="text-base font-semibold">
                Giá tối thiểu (VND)
              </Label>
              <Input
                id="minimumPrice"
                name="minimumPrice"
                type="text" // Dùng text thay vì number để hiển thị dấu chấm
                value={displayPrices.minimumPrice}
                onChange={handleFilterChange}
                placeholder="0"
                className="mt-1"
                min={0}
              />
            </div>

            {/* Giá tối đa */}
            <div className="mb-4">
              <Label htmlFor="maximumPrice" className="text-base font-semibold">
                Giá tối đa (VND)
              </Label>
              <Input
                id="maximumPrice"
                name="maximumPrice"
                type="text" // Dùng text thay vì number để hiển thị dấu chấm
                value={displayPrices.maximumPrice}
                onChange={handleFilterChange}
                placeholder="0"
                className="mt-1"
                min={0}
              />
            </div>

            {/* Thời gian bắt đầu */}
            <div className="mb-4">
              <Label htmlFor="startTime" className="text-base font-semibold">
                Thời gian bắt đầu
              </Label>
              <Input
                id="startTime"
                name="startTime"
                type="datetime-local"
                value={filters.startTime}
                onChange={handleFilterChange}
                className="mt-1"
              />
            </div>

            {/* Thời gian kết thúc */}
            <div className="mb-6">
              <Label htmlFor="endTime" className="text-base font-semibold">
                Thời gian kết thúc
              </Label>
              <Input
                id="endTime"
                name="endTime"
                type="datetime-local"
                value={filters.endTime}
                onChange={handleFilterChange}
                className="mt-1"
              />
            </div>

            {/* Nút áp dụng và reset */}
            <div className="flex gap-4">
              <Button onClick={applyFilters} className="w-full">
                Áp dụng
              </Button>
              <Button
                onClick={resetFilters}
                variant="outline"
                className="w-full"
              >
                Đặt lại
              </Button>
            </div>
          </div>

          {/* Danh sách sản phẩm */}
          <div className="flex-1">
            {getData.isPending ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mb-10">
                {PRODUCTS.map((product) => (
                  <div key={product.id} className="flex flex-col items-center">
                    <Skeleton className="w-full h-[100px] mb-2" />
                    <Skeleton className="w-1/2 mx-auto h-4" />
                  </div>
                ))}
              </div>
            ) : (
              <>
                <h1 className="text-center text-red-600 text-3xl my-2 font-bold uppercase font-sans mb-10">
                  Túi mù tại MYBOX
                </h1>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mb-10">
                  {items.map((item) => (
                    <div
                      key={item.collection.collectionId}
                      className="bg-white rounded-lg shadow-md flex flex-col items-center overflow-hidden cursor-pointer"
                      onClick={() =>
                        router.push(`/products/${item.collection.collectionId}`)
                      }
                    >
                      <img
                        src={item.collection.imagePath || "/placeholder.svg"}
                        alt={item.collection.collectionName}
                        className="h-[150px] object-cover w-full"
                      />
                      <div className="p-4 w-full flex-1 flex flex-col">
                        <h2 className="font-semibold mb-1">
                          {item.collection.collectionName}
                        </h2>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Còn lại:</span>
                          <span className="text-sm font-bold text-red-500">
                            {item.collection.totalItem}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">
                            Giá túi mù:
                          </span>
                          <span className="text-sm">
                            {formatPriceVND(item.collection.blindBoxPrice ?? 0)}
                          </span>
                        </div>
                        {item.collection.discountBlindBoxPrice > 0 && (
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">
                              Giá giảm:
                            </span>
                            <span className="text-sm text-green-600">
                              {formatPriceVND(
                                item.collection.discountBlindBoxPrice ?? 0
                              )}
                            </span>
                          </div>
                        )}
                        <div className="mt-auto">
                          <span
                            className={`text-xs font-semibold px-2 py-1 rounded ${
                              item.collection.isActived
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {item.collection.isActived ? "Đang mở bán" : "Đóng"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const PRODUCTS = [
  { id: 1 },
  { id: 2 },
  { id: 3 },
  { id: 4 },
  { id: 5 },
  { id: 6 },
  { id: 7 },
  { id: 8 },
];
