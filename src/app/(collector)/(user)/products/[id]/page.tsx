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

export default function Page() {
  const { id } = useParams();
  // const [count, setCount] = useState(0);
  // const [openDialog, setOpenDialog] = useState(false);
  const { addToCart } = useContext(GlobalContext);
  const { toast } = useToast();
  const { data: data, isLoading } = useGetCollectionById(id as string);
  const collection = data?.result.collection;
  const products = data?.result.products;

  const handleBuyBlindBox = () => {
    // Implement your blind box purchase logic here
    // setTimeout(() => {
    //   alert("Blind box purchased successfully!");
    // }, 2000);
    if (!collection) return;
    addToCart({
      price: collection.blindBoxPrice,
      collectionId: collection.collectionId,
      image: collection.imagePath,
      title:  `Túi mù ${collection.collectionName}`,
    });
    toast({
      title: "Túi mù đã được thêm vào giỏ hàng!",
    });
  };

  const getRarityColor = (rarityName: string) => {
    switch (rarityName) {
      case "COMMON":
        return "bg-gray-500";
      case "RARE":
        return "bg-blue-500";
      case "EPIC":
        return "bg-purple-500";
      case "LEGENDARY":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center gap-2 bg-white p-4 rounded-lg shadow-md">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="text-lg font-medium text-gray-700">Loading ...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div>
          <img
            src={collection?.imagePath || "/placeholder.svg"}
            alt={collection?.collectionName}
            width={600}
            height={400}
            className="rounded-lg object-cover w-full h-[400px]"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-4 text-red-600 font-sans uppercase">
            {collection?.collectionName}
          </h1>
          <p className="text-gray-600 mb-4">{collection?.description}</p>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="font-semibold">Ngày mở bán:</p>
              <p>
                {collection?.startTime
                  ? formatDate(collection.startTime)
                  : "N/A"}
              </p>
            </div>
            {collection?.endTime !== "0001-01-01T00:00:00" && (
              <div>
                <p className="font-semibold">Ngày đóng bán:</p>
                <p>
                  {collection?.endTime ? formatDate(collection.endTime) : "N/A"}
                </p>
              </div>
            )}
            <div>
              <p className="font-semibold">Tổng số túi mù:</p>
              <p>{collection?.totalItem}</p>
            </div>
            <div>
              <p className="font-semibold">Trạng thái:</p>
              {collection && (
                <Badge
                  variant={collection.isActived ? "default" : "destructive"}
                >
                  {collection.isActived ? "Đang mở bán" : "Đóng bán"}
                </Badge>
              )}
            </div>
          </div>
          <div className="mb-6">
            <p className="font-semibold mb-2">
              Phần thưởng khi sưu tập đủ bộ sưu tập:
            </p>
            <p className="text-gray-600">{collection?.rewards}</p>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Mua Túi Mù (Blind Box)</CardTitle>
              <CardDescription>
                Get a random product from this collection!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold mb-2">
                {formatPriceVND(collection?.blindBoxPrice ?? 0)}
              </p>
              {(collection?.discountBlindBoxPrice ?? 0) > 0 && (
                <p className="text-sm text-gray-500 line-through">
                  {formatPriceVND(collection?.blindBoxPrice ?? 0)}
                </p>
              )}
            </CardContent>
            <CardFooter>
              <Button
                className="bg-red-600"
                onClick={handleBuyBlindBox}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Mua túi mù"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6">Bộ sưu tập</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products &&
          products?.length > 0 &&
          products?.map((product, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="relative h-48">
                  <img
                    src={product.imagePath || "/placeholder.svg"}
                    alt={product.name}
                    className="rounded-lg w-full h-full object-cover"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="mb-2">{product.name}</CardTitle>
                <CardDescription className="mb-4">
                  {product.description}
                </CardDescription>
                <div className="flex justify-between items-center">
                  <p className="font-semibold">
                    {formatPriceVND(product.price)}
                  </p>
                  <Badge className={getRarityColor(product.rarityStatus.name)}>
                    {product.rarityStatus.name} ({product.rarityStatus.dropRate}
                    %)
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
}
