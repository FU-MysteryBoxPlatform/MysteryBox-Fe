"use client";
import LoadingIndicator from "@/app/components/LoadingIndicator";
import ProductCard from "@/app/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Sale, useManageSale } from "@/hooks/api/useManageSale";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const router = useRouter();
  const [saleData, setSaleData] = useState<Sale[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const { mutate: mutateManageSale, isPending } = useManageSale();

  useEffect(() => {
    mutateManageSale(
      {
        saleStatus: 1,
        pageNumber: pageNumber,
        pageSize: 6,
      },
      {
        onSuccess: (data) => {
          if (data.isSuccess) {
            setSaleData((preSale) => [...preSale, ...data.result.items]);
            setTotalPages(data.result.totalPages);
          }
        },
      }
    );
  }, [mutateManageSale, pageNumber]);

  return (
    <div className="">
      <div className="grid grid-cols-3 gap-4">
        {saleData.map((product) => (
          <div
            key={product.inventoryId}
            className="cursor-pointer"
            onClick={() =>
              router.push("/auctions/auctions-boxes/" + product.inventoryId)
            }
          >
            <ProductCard
              image={product.inventory?.product?.imagePath}
              price={product.totalAmount}
              title={product.inventory?.product?.name}
              saleId={product.saleId}
            />
          </div>
        ))}
      </div>
      {isPending && (
        <div className="w-full h-full flex items-center justify-center">
          <LoadingIndicator />
        </div>
      )}
      {pageNumber < totalPages && (
        <Button
          className="bg-[#E12E43] text-white hover:bg-[#B71C32] mt-6 ml-auto"
          onClick={() => setPageNumber((pageNumber) => pageNumber + 1)}
        >
          Xem thêm
        </Button>
      )}
    </div>
  );
}
