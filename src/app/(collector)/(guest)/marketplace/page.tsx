"use client";;
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useGetAllExchangeRequest } from "@/hooks/api/useExchange";
import RarityColorBadge from "@/app/components/RarityColorBadge";

export default function Home() {
  const { data, isPending } = useGetAllExchangeRequest(1, 10);

  return (
    <div className="max-w-6xl mx-auto p-6 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-red-900">Thị Trường</h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {data?.result.items.map((item) => (
          <Link
            href={`/marketplace/trade/${item.exchangeRequestId}`}
            key={item.exchangeRequestId}
          >
            <Card className="overflow-hidden transition-all hover:shadow-md">
              <div className="aspect-square relative">
                <img
                  src={
                    item.requestInventoryItem.product.imagePath ||
                    "/mock-images/image2.png"
                  }
                  alt={item.requestInventoryItem.product.name}
                  className="object-cover w-full h-full"
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
              <CardFooter className="p-4 pt-0 flex justify-between bg-white">
                <div className="text-sm">
                  <span className="text-gray-500">Người đăng: </span>
                  {item.createByAccount.firstName}
                </div>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
