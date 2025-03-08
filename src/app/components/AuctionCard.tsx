import React, { useContext, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User, Tag, Info } from "lucide-react";
import { Auction } from "@/types";
import { formatDate, formatPriceVND } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useJoinAuction } from "@/hooks/api/useAuction";
import { GlobalContext } from "@/provider/global-provider";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

// Modal Component
const PolicyModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  auctionData: Auction;
}> = ({ isOpen, onClose, auctionData }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <h2 className="text-xl font-bold mb-4 text-center text-red-600">
          Chính sách đấu giá tại MYBOX
        </h2>
        <p className="font-sans text-base text-gray-600 font-bold">
          1. Giá cọc tối thiểu khởi đầu:{" "}
          {formatPriceVND(auctionData.minimunBid)} <br />
          2. Thời gian đấu giá từ {formatDate(auctionData.startTime)} đến{" "}
          {formatDate(auctionData.endTime)} <br />
          3. Khi tham gia đấu giá phải cọc số tiền tối thiểu là{" "}
          {formatPriceVND(auctionData.inventory.product.price * 0.1)} <br />
          4. Sau khi kết thúc phiên đấu giá, người chiến thắng sẽ phải thanh
          toán số tiền còn lại trong vòng 24h <br />
          5. Nếu không thanh toán đúng hạn, số tiền cọc sẽ không được hoàn{" "}
          <br />
          6. Nếu trường hợp bạn không phải làngười chiến thắng, số tiền cọc sẽ
          được hoàn lại cho người tham gia
        </p>
        <div className="flex justify-center">
          <Button
            className="bg-red-600 text-white px-4 py-2 rounded mt-4"
            onClick={onClose}
          >
            Thanh toán cọc ngay
          </Button>
        </div>
      </div>
    </div>
  );
};

// Type definitions for the auction data
interface AuctionCardProps {
  auction: Auction;
}

// Function to convert a full Auction object to the simplified format needed by the card

const AuctionCard: React.FC<AuctionCardProps> = ({ auction }) => {
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const { mutateAsync: joinAuction, isPending } = useJoinAuction();
  const auctionData = auction;
  const { user } = useContext(GlobalContext);
  const router = useRouter();
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

  const handleDeposit = async () => {
    if (!user) {
      toast({
        title: "Đăng nhập để tham gia đấu giá",
        description: "Vui lòng đăng nhập để tham gia đấu giá",
      });
      return;
    }

    joinAuction(
      {
        accountId: user?.id ?? "",
        auctionId: auctionData.auctionId,
        paymentMethod: 0,
        returnUrl: `${window.location.host}`.includes("localhost")
          ? `http://${window.location.host}/payment?auctionId=${auctionData.auctionId}`
          : `https://${window.location.host}/payment?auctionId=${auctionData.auctionId}`,
      },
      {
        onSuccess: (data) => {
          if (data.isSuccess) {
            if (typeof data.result === "string") {
              window.location.href = data.result;
            } else {
              setTimeout(() => {
                toast({
                  title: "Bạn đã đặt cọc, tiếp tục phiên đấu giá",
                  description: "Vui lòng thanh toán cọc để tham gia đấu giá",
                });
              }, 3000);
              router.push(
                `/auctions/auctions-boxes/${auctionData.inventoryId}`
              );
            }
          } else {
            toast({
              title: "Đăng ký thất bại",
              description: data.messages[0],
            });
          }
        },
        onError: (data) => {
          toast({
            title: "Đăng ký thất bại",
            description: data.message,
          });
        },
      }
    );
    setIsModalOpen(false);
  };

  return (
    <>
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl font-bold">
                {auctionData.inventory.product.name}
              </CardTitle>
              <CardDescription className="flex items-center mt-1">
                <User className="h-4 w-4 mr-1 opacity-70" />
                <span>Host: {auctionData.account?.firstName}</span>
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
              <span className="text-sm text-gray-500">Giá đặt hiện tại</span>
              <span className="text-lg font-semibold">
                {formatPriceVND(auctionData.currentBid)}
              </span>
            </div>
            <div className="flex flex-col col-span-2">
              <span className="text-sm text-gray-500">
                Thời gian của phiên:
              </span>
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
              Giá cọc tối thiểu khởi đầu:{" "}
              {formatPriceVND(auctionData.minimunBid)}
            </span>
          </div>
        </CardFooter>

        {/* Button to open the policy modal */}
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex animate-pulse font-bold items-center text-red-600 hover:text-red-800"
          >
            Đấu giá ngay
            <Info className="h-4 w-4 ml-2" />
          </button>
        </div>
      </Card>

      {/* Modal */}
      <PolicyModal
        isOpen={isModalOpen}
        onClose={() => handleDeposit()}
        auctionData={auctionData}
      />
    </>
  );
};

export default AuctionCard;
