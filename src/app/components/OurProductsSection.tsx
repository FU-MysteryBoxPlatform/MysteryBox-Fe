"use client";;
import { Skeleton } from "@/components/ui/skeleton";
import { Sale, useManageSale } from "@/hooks/api/useManageSale";
import { useEffect, useState } from "react";

export default function OurProductsSection() {
  const [saleData, setSaleData] = useState<Sale[]>([]);
  const { mutate: mutateManageSale, isPending } = useManageSale();

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
          }
        },
      }
    );
  }, [mutateManageSale]);
  console.log({ saleData });

  return (
    <div className="my-10 md:my-16">
      <p className="text-2xl md:text-4xl font-semibold text-center mb-2 md:mb-4">
        Bộ sưu tập của chúng tôi
      </p>
      <p className="text-center text-gray-500 mb-6">
        Khám phá những sản phẩm mới được ra mắt cùng cộng đồng
      </p>
      {isPending && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-10">
          {Array(8)
            .fill("0")
            .slice(0, 8)
            .map((product) => (
              <div key={product} className="flex flex-col items-center">
                <Skeleton className="w-full h-[150px] mb-2" />
                <Skeleton className="w-1/2 mx-auto h-4" />
              </div>
            ))}
        </div>
      )}
      {!isPending && saleData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-10">
          {/* {saleData?.result?.map((product) => (
            <ProductCard
              image={product.collectionProduct.product.imagePath}
              price={product.sale.unitPrice}
              key={product.sale.saleId}
              title={product.collectionProduct.product.name}
              id={product.sale.saleId}
            />
          ))} */}
        </div>
      ) : (
        <div className="text-center">Chưa có sản phẩm nào được bán</div>
      )}
    </div>
  );
}
