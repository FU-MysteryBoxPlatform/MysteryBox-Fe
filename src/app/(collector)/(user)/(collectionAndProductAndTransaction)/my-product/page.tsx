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

  const fetchData = async () => {
    if (!user?.id) return;
    mutateGetInventory(
      {
        accountId: user.id,
        pageNumber: +page,
        pageSize: 12,
      },
      {
        onSuccess: (data) => {
          setInventories(data.result.listProduct.items || []);
          setTotalPages(data.result.listProduct.totalPages || 0);
        },
        onError: () => {
          console.error("Error fetching inventory");
        },
      }
    );
  };
  useEffect(() => {
    if (!user?.id) return;
    fetchData();
  }, [mutateGetInventory, page, user?.id]);

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-white rounded-lg">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Kho Vật Phẩm Của Tôi
      </h1>

      {isPending ? (
        <div className="flex justify-center py-12">
          <LoadingIndicator />
        </div>
      ) : inventories.length === 0 ? (
        <div className="text-center py-12 text-gray-600">
          Bạn chưa sở hữu vật phẩm nào trong kho.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {inventories.map((product) => (
              <InventoryCard
                key={product.product?.name || product.collection.collectionId}
                id={
                  product.inventories[0]?.inventoryId ||
                  product.collection.collectionId
                }
                image={
                  product.product?.imagePath || product.collection.imagePath
                }
                title={
                  product.product
                    ? product.product.name
                    : `Túi mù ${product.collection.collectionName}`
                }
                price={product.product?.price}
                stock={Number(product.inventories.length)}
                status={product.inventories[0]?.itemStatus.id}
                isPersonal
                showPrice={false}
                collectionId={product.collection?.collectionId}
                fetchData={fetchData}
              />
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <Paginator
              currentPage={+(page as string)}
              totalPages={totalPages}
              onPageChange={(pageNumber) => {
                params["page"] = pageNumber.toString();
                router.push(`?${queryString.stringify(params)}`);
              }}
              showPreviousNext
            />
          </div>
        </>
      )}
    </div>
  );
}
