import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatPriceVND } from "@/lib/utils";

interface Collection {
  collectionId: string;
  collectionName: string;
  description: string;
  startTime: string;
  endTime: string;
  totalItem: number;
  isActived: boolean;
  rewards: string;
  imagePath: string;
  blindBoxPrice: number;
  discountBlindBoxPrice: number;
}

interface CollectionCardProps {
  collection: Collection;
}

export function CollectionCard({ collection }: CollectionCardProps) {
  const startDate = new Date(collection.startTime);
  const endDate = new Date(collection.endTime);
  const isValidEndDate = endDate.getFullYear() > 2000; // Check if end date is valid

  const discountPercentage = Math.round(
    ((collection.blindBoxPrice - collection.discountBlindBoxPrice) /
      collection.blindBoxPrice) *
      100
  );

  return (
    <Card className="overflow-hidden">
      <div className="relative h-48 w-full">
        <Image
          src={collection.imagePath || "/placeholder.svg"}
          alt={collection.collectionName}
          fill
          className="object-cover"
        />
        {collection.isActived && (
          <Badge className="absolute right-2 top-2 bg-green-500 hover:bg-green-600">
            Đang hoạt động
          </Badge>
        )}
        {!collection.isActived && (
          <Badge className="absolute right-2 top-2 bg-gray-500 hover:bg-gray-600">
            Chưa hoạt động
          </Badge>
        )}
      </div>
      <CardHeader className="p-4">
        <CardTitle className="line-clamp-1 text-lg">
          {collection.collectionName}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="line-clamp-2 text-sm text-muted-foreground mb-2">
          {collection.description}
        </p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-muted-foreground">Giá gốc:</p>
            <p className="font-medium line-through">
              {formatPriceVND(collection.blindBoxPrice)}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Giá ưu đãi:</p>
            <p className="font-medium text-green-600">
              {formatPriceVND(collection.discountBlindBoxPrice)}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Số lượng:</p>
            <p className="font-medium">{collection.totalItem}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Giảm giá:</p>
            <p className="font-medium text-orange-500">{discountPercentage}%</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex flex-col items-start">
        <p className="text-xs text-muted-foreground">
          Bắt đầu: {startDate?.toLocaleDateString("vi-VN")}
        </p>
        {isValidEndDate && (
          <p className="text-xs text-muted-foreground">
            Kết thúc: {endDate?.toLocaleDateString("vi-VN")}
          </p>
        )}
      </CardFooter>
    </Card>
  );
}
