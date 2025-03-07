import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User, Tag } from "lucide-react";
import { Auction } from "@/types";
import { formatDate, formatPriceVND } from "@/lib/utils";

// Type definitions for the auction data
interface AuctionCardProps {
  auction: Auction;
}

// Function to convert a full Auction object to the simplified format needed by the card

const AuctionCard: React.FC<AuctionCardProps> = ({ auction }) => {
  // Convert the auction data to our simplified format
  const auctionData = auction;

  // Calculate time remaining
  const calculateTimeRemaining = (): string => {
    const now = new Date();
    const end = new Date(auctionData.endTime);
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) {
      return "Auction ended";
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m remaining`;
  };

  // Determine auction status label
  const getStatusLabel = (): string => {
    switch (auctionData.statusId) {
      case 1:
        return "Pending";
      case 2:
        return "Cancelled";
      case 3:
        return "Active";
      case 4:
        return "Completed";
      case 5:
        return "Failed";
      default:
        return "Unknown";
    }
  };

  // Determine status badge color
  const getStatusColor = (): string => {
    switch (auctionData.statusId) {
      case 1:
        return "bg-yellow-100 text-yellow-800";
      case 2:
        return "bg-red-100 text-red-800";
      case 3:
        return "bg-green-100 text-green-800";
      case 4:
        return "bg-blue-100 text-blue-800";
      case 5:
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold">
              {auctionData.inventory.product.name}
            </CardTitle>
            <CardDescription className="flex items-center mt-1">
              <User className="h-4 w-4 mr-1 opacity-70" />
              <span>Listed by {auctionData.account?.firstName}</span>
            </CardDescription>
          </div>
          <Badge
            variant="secondary"
            className={`px-2 py-1 ${getStatusColor()}`}
          >
            {getStatusLabel()}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pb-2">
        <div className="relative aspect-square w-full overflow-hidden rounded-md mb-4">
          <img
            src={auctionData.inventory.product.imagePath}
            className="object-cover w-full h-full"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Current Bid</span>
            <span className="text-lg font-semibold">
              {formatPriceVND(auctionData.currentBid)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Original Price</span>
            <span className="text-lg font-semibold">
              {formatPriceVND(auctionData.inventory.product.price)}
            </span>
          </div>
          <div className="flex flex-col col-span-2">
            <span className="text-sm text-gray-500">Auction Period</span>
            <div className="flex items-center text-sm">
              <Clock className="h-4 w-4 mr-1 opacity-70" />
              <span>
                {formatDate(auctionData.startTime)} -{" "}
                {formatDate(auctionData.endTime)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between pt-2 border-t">
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-1 text-amber-500" />
          <span className="text-sm font-medium text-amber-500">
            {calculateTimeRemaining()}
          </span>
        </div>
        <div className="flex items-center">
          <Tag className="h-4 w-4 mr-1 text-green-600" />
          <span className="text-sm font-medium text-green-600">
            Min Bid: {formatPriceVND(auctionData.minimunBid)}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AuctionCard;
