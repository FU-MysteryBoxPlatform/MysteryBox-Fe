"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  TCollectionWithProgress,
  useGetCollections,
} from "@/hooks/api/useManageCollection";
import { formatPriceVND } from "@/lib/utils";
import dayjs from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import queryString from "query-string";
import { useEffect, useRef, useState } from "react";
import DatePicker from "react-date-picker";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = queryString.parse(searchParams.toString());
  const ref = useRef<NodeJS.Timeout>(null);

  const keyword = params["keyword"];
  const page = params["page"] || 1;
  const minPrice = params["minPrice"];
  const maxPrice = params["maxPrice"];
  const startDate = params.startDate as string | undefined;
  const endDate = params.endDate as string | undefined;

  const [items, setItems] = useState<TCollectionWithProgress[]>([]);
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

  const handleFilterByDate = (key: "startDate" | "endDate", date?: Date) => {
    const newParams: { [key: string]: any } = { ...params, page: "1" };
    newParams[key] = date ? dayjs(date).toISOString() : null;
    router.push(`?${queryString.stringify(newParams)}`);
  };

  useEffect(() => {
    mutateGetCollections(
      {
        keyword: keyword as string,
        pageNumber: +page,
        pageSize: 1000,
        minimumPrice: minPrice ? +minPrice : undefined,
        maximumPrice: maxPrice ? +maxPrice : undefined,
        startTime: startDate ? dayjs(startDate).toISOString() : undefined,
        endTime: endDate ? dayjs(endDate).toISOString() : undefined,
      },
      {
        onSuccess: (data) => {
          if (data.isSuccess) {
            setItems(data.result.items || []);
            setTotalPages(data.result.totalPages || 0);
          }
        },
      }
    );
  }, [
    keyword,
    maxPrice,
    minPrice,
    mutateGetCollections,
    page,
    startDate,
    endDate,
  ]);

  return (
    <div>
      <div className="max-w-[1280px] mx-auto px-4 md:px-10 lg:px-16">
        <div className="flex gap-10 py-10 max-md:flex-col">
          <div className="md:min-w-[180px] lg:min-w-[250px]">
            <p className="text-xl font-semibold mb-6">Bộ lọc</p>
            <div>
              <div className="grid gap-4 mb-6">
                <div>
                  <Label>Tìm kiếm bộ sưu tập</Label>
                  <Input
                    placeholder="Tìm kiếm bộ sưu tập"
                    defaultValue={keyword as string}
                    onChange={(e) => handleFilterByKeyword(e.target.value)}
                    className="bg-white border-gray-300"
                  />
                </div>
                <div>
                  <Label>Giá nhỏ nhất</Label>
                  <Input
                    placeholder="Giá nhỏ nhất"
                    defaultValue={minPrice as string}
                    onChange={(e) => handleFilterByMinPrice(e.target.value)}
                    className="bg-white border-gray-300"
                    type="number"
                  />
                </div>
                <div>
                  <Label>Giá lớn nhất</Label>
                  <Input
                    placeholder="Giá lớn nhất"
                    defaultValue={maxPrice as string}
                    onChange={(e) => handleFilterByMaxPrice(e.target.value)}
                    className="bg-white border-gray-300"
                    type="number"
                  />
                </div>
                <div>
                  <Label>Ngày bắt đầu</Label>
                  <DatePicker
                    className="w-full h-10 rounded-lg border-gray-200"
                    value={startDate ? new Date(startDate) : null}
                    onChange={(value) =>
                      handleFilterByDate("startDate", value as Date)
                    }
                    clearIcon={null}
                  />
                </div>
                <div>
                  <Label>Ngày kết thúc</Label>
                  <DatePicker
                    className="w-full h-10 rounded-lg border-gray-200"
                    value={endDate ? new Date(endDate) : null}
                    onChange={(value) =>
                      handleFilterByDate("endDate", value as Date)
                    }
                    clearIcon={null}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="">
            {isPending ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mb-10 flex-1">
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
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mb-10 flex-1">
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
  {
    id: 1,
  },
  {
    id: 2,
  },
  {
    id: 3,
  },
  {
    id: 4,
  },
  {
    id: 5,
  },
  {
    id: 6,
  },
  {
    id: 7,
  },
  {
    id: 8,
  },
];
