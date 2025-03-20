"use client";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate, formatPriceVND } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useGetCollectionById } from "@/hooks/api/useManageCollection";
import { Button } from "@/components/ui/button";
import { useContext } from "react";
import { GlobalContext } from "@/provider/global-provider";
import { useToast } from "@/hooks/use-toast";
import dayjs from "dayjs";
import { Stars } from "./Stars";

export default function Page() {
  const { id } = useParams();
  const { addToCart } = useContext(GlobalContext);
  const { toast } = useToast();
  const { data, isLoading } = useGetCollectionById(id as string);
  const collection = data?.result.collection;
  const products = data?.result.products;
  const ratings = data?.result.ratings;

  const handleBuyBlindBox = () => {
    if (!collection) return;
    if (collection.totalItem === 0 || !collection.isActived) {
      toast({ title: "Túi mù đã hết hàng!", variant: "destructive" });
      return;
    }
    addToCart({
      price: collection.discountBlindBoxPrice || collection.blindBoxPrice,
      collectionId: collection.collectionId,
      image: collection.imagePath,
      title: `Túi mù ${collection.collectionName}`,
    });
    toast({ title: "Túi mù đã được thêm vào giỏ hàng!" });
  };

  const getRarityColor = (rarityName: string) => {
    switch (rarityName) {
      case "COMMON":
        return "bg-gray-200 text-gray-800";
      case "RARE":
        return "bg-blue-100 text-blue-800";
      case "EPIC":
        return "bg-purple-100 text-purple-800";
      case "LEGENDARY":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3 bg-white p-6 rounded-xl shadow-lg">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          <span className="text-xl font-semibold text-gray-700">
            Đang tải...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Section */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Collection Image */}
          <div className="relative">
            <img
              src={collection?.imagePath || "/placeholder.svg"}
              alt={collection?.collectionName}
              className="rounded-xl object-cover w-full h-[500px] shadow-lg transition-transform duration-300 hover:scale-[1.02]"
            />
          </div>

          {/* Collection Info */}
          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
              {collection?.collectionName}
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed">
              {collection?.description}
            </p>

            {/* Collection Details */}
            <Card className="bg-white border border-gray-200 shadow-md rounded-xl">
              <CardContent className="p-6 grid grid-cols-2 gap-6">
                <div>
                  <p className="font-semibold text-gray-900">Ngày mở bán:</p>
                  <p className="text-gray-700">
                    {collection?.startTime
                      ? formatDate(collection.startTime)
                      : "N/A"}
                  </p>
                </div>
                {collection?.endTime !== "0001-01-01T00:00:00" && (
                  <div>
                    <p className="font-semibold text-gray-900">
                      Ngày đóng bán:
                    </p>
                    <p className="text-gray-700">
                      {collection?.endTime
                        ? formatDate(collection.endTime)
                        : "N/A"}
                    </p>
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-900">Tổng số túi mù:</p>
                  <p className="text-gray-700">{collection?.totalItem}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Trạng thái:</p>
                  <Badge
                    className={
                      collection?.isActived ? "bg-emerald-600" : "bg-red-600"
                    }
                  >
                    {collection?.isActived ? "Đang mở bán" : "Đóng bán"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Rewards */}
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="font-semibold text-gray-900 mb-2">
                Phần thưởng khi sưu tập đủ:
              </p>
              <p className="text-gray-700">{collection?.rewards}</p>
            </div>

            {/* Buy Blind Box Card */}
            <Card className="border border-gray-200 shadow-lg rounded-xl">
              <CardHeader className="bg-white border-b border-gray-200">
                <CardTitle className="text-xl text-gray-900">
                  Mua Túi Mù
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Nhận ngẫu nhiên một sản phẩm từ bộ sưu tập!
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <p className="text-3xl font-bold text-red-600">
                    {formatPriceVND(
                      collection?.discountBlindBoxPrice ||
                        collection?.blindBoxPrice ||
                        0
                    )}
                  </p>
                  {collection?.discountBlindBoxPrice && (
                    <p className="text-sm text-gray-500 line-through">
                      {formatPriceVND(collection.blindBoxPrice || 0)}
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-red-600 hover:bg-red-700 text-white text-lg py-6 rounded-lg transition-all"
                  onClick={handleBuyBlindBox}
                  disabled={
                    isLoading ||
                    collection?.totalItem === 0 ||
                    !collection?.isActived
                  }
                >
                  {isLoading ? "Đang xử lý..." : "Mua Ngay"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>

        {/* Ratings Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Đánh Giá</h2>
          {ratings && ratings.length > 0 ? (
            <div className="grid gap-6">
              {ratings.map((rating, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <img
                      src={rating.createByAccount.avatar || "/placeholder.svg"}
                      alt="avatar"
                      className="w-10 h-10 rounded-full border border-gray-200"
                    />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {rating.createByAccount.firstName}{" "}
                        {rating.createByAccount.lastName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {dayjs(rating.createDate).format("DD/MM/YYYY")}
                      </p>
                    </div>
                  </div>
                  <Stars rating={rating.point} />
                  <p className="text-sm text-gray-700 mt-2">{rating.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-6">
              Chưa có đánh giá nào cho bộ sưu tập này.
            </p>
          )}
        </div>

        {/* Products Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Các Sản Phẩm Trong Bộ Sưu Tập
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products && products.length > 0 ? (
              products.map((product, index) => (
                <Card
                  key={index}
                  className="border border-gray-200 shadow-md hover:shadow-lg transition-all rounded-xl overflow-hidden"
                >
                  <div className="relative h-56">
                    <img
                      src={product.imagePath || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-4">
                    <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
                      {product.name}
                    </CardTitle>
                    <CardDescription className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {product.description}
                    </CardDescription>
                    <div className="flex justify-between items-center">
                      <p className="font-semibold text-emerald-600">
                        {formatPriceVND(product.price)}
                      </p>
                      <Badge
                        className={getRarityColor(product.rarityStatus.name)}
                      >
                        {product.rarityStatus.name} (
                        {product.rarityStatus.dropRate}%)
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-gray-600 col-span-full text-center py-6">
                Không có sản phẩm nào trong bộ sưu tập này.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
