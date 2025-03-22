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
import LoadingIndicator from "./LoadingIndicator";

// Modal Component
const PolicyModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  auctionData: Auction;
  onOk?: () => void;
}> = ({ isOpen, onClose, auctionData, onOk }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
        <h2 className="text-2xl font-bold mb-6 text-center text-red-600">
          Chính Sách Đấu Giá MYBOX
        </h2>
        <ul className="text-gray-700 space-y-3 text-sm">
          <li>
            <span className="font-semibold">1. Giá cọc tối thiểu:</span>{" "}
            {formatPriceVND(auctionData.minimunBid)}
          </li>
          <li>
            <span className="font-semibold">2. Thời gian đấu giá:</span>{" "}
            {formatDate(auctionData.startTime)} -{" "}
            {formatDate(auctionData.endTime)}
          </li>
          <li>
            <span className="font-semibold">3. Tiền cọc tối thiểu:</span>{" "}
            {formatPriceVND(auctionData.inventory.product.price * 0.1)}
          </li>
          <li>
            <span className="font-semibold">4. Thanh toán sau thắng:</span>{" "}
            Trong vòng 24h
          </li>
          <li>
            <span className="font-semibold">5. Không thanh toán đúng hạn:</span>{" "}
            Mất cọc
          </li>
          <li>
            <span className="font-semibold">6. Hoàn cọc:</span> Nếu không thắng
          </li>
        </ul>
        <div className="flex flex-col items-center justify-center mt-6">
          <Button
            className="bg-red-600 w-fit text-white hover:bg-red-700 px-6 py-2 rounded-full transition-all duration-300"
            onClick={onOk}
          >
            Thanh Toán Cọc Ngay
          </Button>
          <Button
            className="my-2 bg-red-600 w-fit text-white hover:bg-red-700 px-6 py-2 rounded-full transition-all duration-300"
            onClick={onClose}
          >
            Đóng
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
      case 0:
        return "Sắp diễn ra";
      case 1:
        return "Đang diễn ra";
      case 2:
        return "Kết thúc";
      case 3:
        return "Huỷ";
      default:
        return "Unknown";
    }
  };

  // Determine status badge color
  const getStatusColor = (): string => {
    switch (auctionData.statusId) {
      case 0:
        return "bg-yellow-100 text-yellow-800";
      case 1:
        return "bg-green-100 text-green-800";
      case 2:
        return "bg-red-100 text-red-800";
      case 3:
        return "bg-red-100 text-red-800";
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
              router.push(`/auctions/auctions-boxes/${auctionData.auctionId}`);
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
      <Card className="w-full max-w-md shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg overflow-hidden bg-white">
        <CardHeader className="relative p-4 bg-gradient-to-r from-gray-50 to-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl font-bold text-gray-800">
                {auctionData.inventory.product.name}
              </CardTitle>
              <CardDescription className="flex items-center mt-1 text-gray-600">
                <User className="h-4 w-4 mr-1 opacity-70" />
                <span>Host: {auctionData.account?.firstName}</span>
              </CardDescription>
            </div>
            <Badge className={`px-3 py-1 font-semibold ${getStatusColor()}`}>
              {getStatusLabel()}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-lg mb-4">
            <img
              src={auctionData.inventory.product.imagePath}
              className="object-cover w-full h-full transition-transform duration-300 hover:scale-110"
              alt={auctionData.inventory.product.name}
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-sm text-gray-500 block">
                  Giá hiện tại
                </span>
                <span className="text-lg font-bold text-gray-800">
                  {formatPriceVND(auctionData.currentBid)}
                </span>
              </div>
              <div>
                <span className="text-sm text-gray-500 block">
                  Giá cọc tối thiểu
                </span>
                <span className="text-lg font-bold text-green-600">
                  {formatPriceVND(auctionData.minimunBid)}
                </span>
              </div>
            </div>
            <div>
              <span className="text-sm text-gray-500 flex items-center">
                <Clock className="h-4 w-4 mr-1 opacity-70" />
                Thời gian: {formatDate(auctionData.startTime)} -{" "}
                {formatDate(auctionData.endTime)}
              </span>
              <span className="text-sm font-medium text-amber-600 flex items-center mt-1">
                <Clock className="h-4 w-4 mr-1" />
                {calculateTimeRemaining()}
              </span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 border-t bg-gray-50">
          <Button
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-red-500 text-white hover:bg-red-600 rounded-full py-2 transition-all duration-300 flex items-center justify-center gap-2"
            disabled={isPending}
          >
            {isPending ? <LoadingIndicator /> : "Đấu Giá Ngay"}
            <Info className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>

      <PolicyModal
        isOpen={isModalOpen}
        onOk={handleDeposit}
        auctionData={auctionData}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default AuctionCard;
