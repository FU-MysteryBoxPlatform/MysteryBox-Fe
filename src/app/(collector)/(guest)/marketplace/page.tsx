"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useGetAllExchangeRequest } from "@/hooks/api/useExchange";
import RarityColorBadge from "@/app/components/RarityColorBadge";
import { ExchangeRequest } from "@/types";
import LoadingIndicator from "@/app/components/LoadingIndicator";

export default function Home() {
  const getAllExchange = useGetAllExchangeRequest();
  const [data, setData] = useState<ExchangeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const fetchExchanges = async () => {
    try {
      const response = await getAllExchange.mutateAsync({
        pageNumber: 1,
        pageSize: 10,
        exchangeStatus: 0,
      });
      setData(response.result.items);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchExchanges();
  }, []);

  if (loading)
    return (
      <div className="w-screen h-[90vh] flex items-center justify-center">
        <LoadingIndicator />
      </div>
    );
  if (error)
    return <div className="text-center text-red-500">Failed to load data.</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-red-900">Thị Trường</h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {data?.map((item) => (
          <Link
            href={`/marketplace/trade/${item.exchangeRequestId}`}
            key={item.exchangeRequestId}
          >
            <Card className="overflow-hidden transition-all hover:shadow-md h-full">
              <div className="aspect-square relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    item.requestInventoryItem.product.imagePath ||
                    "/mock-images/image2.png"
                  }
                  alt={item.requestInventoryItem.product.name}
                  className="object-cover w-full h-[250px]"
                />
                <div className="absolute top-2 right-2">
                  <RarityColorBadge
                    rarityName={
                      item.requestInventoryItem.product.rarityStatus.name
                    }
                    dropRate={
                      item.requestInventoryItem.product.rarityStatus.dropRate
                    }
                  />
                </div>
              </div>
              <CardContent className="p-4 bg-white">
                <h3 className="font-semibold text-lg text-red-900">
                  {item.requestInventoryItem.product.name}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {item.requestInventoryItem.product.description}
                </p>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between bg-white mt-auto">
                <div className="text-sm">
                  <span className="text-gray-500">Người đăng: </span>
                  {item.createByAccount?.firstName}
                </div>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
