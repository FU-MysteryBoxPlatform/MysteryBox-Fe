"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { Sale, useManageSale } from "@/hooks/api/useManageSale";
import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

export default function OurProductsSection() {
  const [saleData, setSaleData] = useState<Sale[]>([]);
  const { mutate: mutateManageSale } = useManageSale();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    mutateManageSale(
      {
        pageNumber: 1,
        pageSize: 8,
      },
      {
        onSuccess: (data) => {
          if (data.isSuccess) {
            setSaleData(data.result);
            setIsLoading(false);
          }
        },
      }
    );
  }, [mutateManageSale]);

  return (
    <div className="my-10 md:my-16">
      <p className="text-2xl md:text-4xl font-semibold text-center mb-2 md:mb-4">
        Bộ sưu tập của chúng tôi
      </p>
      <p className="text-center text-gray-500 mb-6">
        Khám phá những sản phẩm mới được ra mắt cùng cộng đồng
      </p>
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-10">
          {Array(8)
            .fill("0")
            .map((product) => (
              <div key={product} className="flex flex-col items-center">
                <Skeleton className="w-full h-[150px] mb-2" />
                <Skeleton className="w-1/2 mx-auto h-4" />
              </div>
            ))}
        </div>
      )}
      {saleData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-10">
          {saleData?.length > 0 &&
            saleData
              .slice(0, 8)
              ?.map((product) => (
                <ProductCard
                  image={product.inventory?.product?.imagePath}
                  price={product.unitPrice}
                  key={product.inventoryId}
                  title={product.inventory?.product?.name}
                  saleId={product.saleId}

                  
                />
              ))}
        </div>
      ) : (
        <div className="text-center">Chưa có sản phẩm nào được bán</div>
      )}
    </div>
  );
}
