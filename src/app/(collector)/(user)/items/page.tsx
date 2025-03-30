"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Product } from "@/types";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetAllProduct } from "@/hooks/api/useCollection";
import { useEffect, useState } from "react";
import { formatPriceVND } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const { mutateAsync: getAll, isPending } = useGetAllProduct();

  // State cho các bộ lọc
  const [filters, setFilters] = useState({
    keyword: "",
    rarityStatus: "0",
    pageNumber: 1,
    pageSize: 10,
  });

  const fetchProducts = async () => {
    try {
      const response = await getAll(
        {
          keyword: filters.keyword,
          rarityStatus:
            filters.rarityStatus === "ALL"
              ? undefined
              : parseInt(filters.rarityStatus),
          productStatus: 0,
          pageNumber: filters.pageNumber,
          pageSize: filters.pageSize,
        },
        {
          onSuccess: (data) => {
            setProducts(data.result.items);
          },
          onError: (error) => {
            console.error("Error fetching products:", error);
          },
        }
      );
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const handleFilterChange = (name: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Bộ lọc bên trái */}

        <div className="lg:w-1/4">
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Bộ lọc</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Tìm kiếm
                </label>
                <Input
                  placeholder="Nhập từ khóa..."
                  value={filters.keyword}
                  onChange={(e) =>
                    handleFilterChange("keyword", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Độ hiếm
                </label>
                <Select
                  value={filters.rarityStatus}
                  onValueChange={(value) =>
                    handleFilterChange("rarityStatus", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn độ hiếm" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Common</SelectItem>
                    <SelectItem value="1">Rare</SelectItem>
                    <SelectItem value="2">Legendary</SelectItem>
                    <SelectItem value="ALL">All</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Danh sách sản phẩm bên phải */}
        <div className="lg:w-3/4">
          <h1 className="text-3xl font-bold mb-6 text-red-700">
            Danh sách sản phẩm
          </h1>
          {isPending ? (
            <div className="text-center">Đang tải...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.length === 0 ? (
                <p className="col-span-full text-center text-gray-500">
                  Không tìm thấy sản phẩm nào
                </p>
              ) : (
                products.map((product) => (
                  <Link
                    key={product.productId}
                    href={`/items/${product.productId}`}
                  >
                    <Card className="group h-full flex flex-col overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300">
                      <div className="relative">
                        <img
                          src={product.imagePath}
                          alt={product.name}
                          className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        {product.discount > 0 && (
                          <Badge
                            variant="destructive"
                            className="absolute top-2 right-2 px-2 py-1"
                          >
                            -{product.discount}%
                          </Badge>
                        )}
                      </div>

                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-xl font-semibold line-clamp-1">
                            {product.name}
                          </CardTitle>
                          <Badge
                            variant={
                              product.rarityStatus.name === "Legendary"
                                ? "default"
                                : "secondary"
                            }
                            className="ml-2"
                          >
                            {product.rarityStatus.name}
                          </Badge>
                        </div>
                      </CardHeader>

                      <CardContent className="flex-1 flex flex-col justify-between p-4 pt-0">
                        <div>
                          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                            {product.description}
                          </p>
                          <div className="flex items-baseline gap-2">
                            <span className="text-xl font-bold text-primary">
                              {formatPriceVND(product.price)}
                            </span>
                          </div>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-4 w-full text-white bg-red-600 transition-colors"
                        >
                          Xem chi tiết
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
