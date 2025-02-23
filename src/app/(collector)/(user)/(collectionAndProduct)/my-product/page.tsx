"use client";
import InventoryCard from "@/app/components/InventoryCard";
import LoadingIndicator from "@/app/components/LoadingIndicator";
import Paginator from "@/app/components/Paginator";
import { TInventoryItem, useGetInventory } from "@/hooks/api/useInventory";
import { GlobalContext } from "@/provider/global-provider";
import { useRouter, useSearchParams } from "next/navigation";
import queryString from "query-string";
import { useContext, useEffect, useState } from "react";

export default function Page() {
  const { user } = useContext(GlobalContext);
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = queryString.parse(searchParams.toString());
  const page = params["page"] || 1;

  const [totalPages, setTotalPages] = useState(0);
  const [inventories, setInventories] = useState<TInventoryItem[]>([]);
  const { mutate: mutateGetInventory, isPending } = useGetInventory();

  useEffect(() => {
    mutateGetInventory(
      {
        accountId: user?.id || "",
        pageNumber: +page,
        pageSize: 12,
      },
      {
        onSuccess: (data) => {
          console.log(data);
          setInventories(data.result.listProduct.items);
          setTotalPages(data.result.listProduct.totalPages);
        },
      }
    );
  }, [mutateGetInventory, page, user?.id]);

  return (
    <div className="p-6 border border-gray-300 rounded-lg flex-1 max-md:w-full">
      <p className="text-lg md:text-xl font-bold mb-4 md:mb-6">
        Kho vật phẩm của tôi
      </p>
      {isPending ? (
        <div className="w-full flex items-center justify-center mb-10">
          <LoadingIndicator />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-10">
          {inventories.map((product) => (
            <InventoryCard
              key={product.product.name}
              id={product.product.productId || ""}
              image={product.product.imagePath}
              title={product.product.name}
              price={product.product.price}
              stock={Number(product.inventories.length)}
              status={product.inventories[0].itemStatus.id}
              isPersonal
              showPrice={false}
            />
          ))}
        </div>
      )}
      {inventories.length > 0 ? (
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
        <div className="w-full text-center mt-10">Không có bộ sưu tập nào</div>
      )}
    </div>
  );
}
