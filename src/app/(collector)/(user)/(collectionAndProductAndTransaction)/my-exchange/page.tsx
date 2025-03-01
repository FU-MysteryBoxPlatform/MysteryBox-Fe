"use client";
import { useContext, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  ArrowLeftRight,
  Calendar,
  Check,
  Clock,
  Coins,
  ShoppingBag,
  X,
} from "lucide-react";
import { useGetAllExchangeRequestByUserId } from "@/hooks/api/useExchange";
import { GlobalContext } from "@/provider/global-provider";
import RarityColorBadge from "@/app/components/RarityColorBadge";
import { formatDate } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  useConfirmAcceptedOfffer,
  useGetAllOfferByExchangeId,
} from "@/hooks/api/useOfferExchange";
import { Tabs as TabsComponent } from "@/components/ui/tabs";
import { ExchangeRequest, OfferExchange } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface TradeDetailsModalProps {
  exchangeRequest: ExchangeRequest;
  offers: OfferExchange[];
  confirm: (offerId: string, isSucces: boolean) => void;
}

const OfferCard = ({
  offer,
  onAccept,
  onReject,
}: {
  offer: OfferExchange;
  onAccept: (offerId: string) => void;
  onReject: (offerId: string) => void;
}) => {
  const offeredItem = offer.offeredInventoryItem;
  const offerer = offer.createByAccount;

  return (
    <Card className="mb-4 overflow-hidden border-2 border-emerald-50 hover:border-emerald-100 transition-all">
      <CardHeader className="p-4 pb-2 flex flex-row items-center gap-3">
        <Avatar className="h-10 w-10 border-2 border-emerald-200">
          <AvatarImage
            src={offerer.avatar || undefined}
            alt={`${offerer.firstName} ${offerer.lastName}`}
          />
          <AvatarFallback>{offerer.firstName?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium text-base">
            {offerer.firstName} {offerer.lastName}
          </h3>
          <p className="text-xs text-muted-foreground">{offerer.email}</p>
        </div>
        <Badge
          variant="outline"
          className="ml-auto bg-yellow-50 text-yellow-700"
        >
          Đang Chờ
        </Badge>
      </CardHeader>

      <CardContent className="p-4 pt-2">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative aspect-square w-full md:w-1/3 overflow-hidden rounded-md bg-gray-100">
            <img
              src={offeredItem.product.imagePath || "/placeholder.svg"}
              alt={offeredItem.product.name}
              className="object-cover w-full h-full transition-all hover:scale-105"
            />
            <Badge className="absolute top-2 right-2 bg-emerald-600">
              {offeredItem.product.rarityStatus.name}
            </Badge>
          </div>

          <div className="w-full md:w-2/3">
            <h4 className="font-bold text-lg mb-1">
              {offeredItem.product.name}
            </h4>
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {offeredItem.product.description}
            </p>

            <div className="grid grid-cols-2 gap-2 text-sm mb-3">
              <div className="flex items-center gap-1">
                <Coins className="h-4 w-4 text-amber-500" />
                <span>{offeredItem.product.price.toLocaleString()} VND</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-blue-500" />
                <span>{formatDate(offeredItem.accquiredDate)}</span>
              </div>
            </div>

            {offer.content && offer.content !== "string" && (
              <div className="text-sm bg-gray-50 p-2 rounded-md mb-3">
                <span className="font-medium">Lời nhắn: </span>
                {offer.content}
              </div>
            )}

            <div className="flex gap-2 mt-2">
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                onClick={() => onReject(offer.offerExchangeId)}
              >
                <X className="h-4 w-4 mr-1" /> Từ Chối
              </Button>
              <Button
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={() => onAccept(offer.offerExchangeId)}
              >
                <Check className="h-4 w-4 mr-1" /> Chấp Nhận
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const TradeDetailsModal = ({
  exchangeRequest,
  offers,
  confirm,
}: TradeDetailsModalProps) => {

  const [activeTab, setActiveTab] = useState("offers");

  const requestItem = exchangeRequest.requestInventoryItem;
  const requester = exchangeRequest.createByAccount;

  const handleAcceptOffer = (offerId: string) => {
    confirm(offerId, true);
  };

  const handleRejectOffer = (offerId: string) => {
    confirm(offerId, true);
  };

  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
      <div className="flex flex-col h-full">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-2xl font-bold text-center">
            Chi Tiết Giao Dịch
          </DialogTitle>
          <DialogDescription className="text-center">
            Thông tin chi tiết về đề nghị trao đổi
          </DialogDescription>
        </DialogHeader>

        {/* Requested Item Section */}
        <div className="px-6 py-4 bg-gray-50 border-y">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative w-24 h-24 overflow-hidden rounded-md bg-white border">
              <img
                src={requestItem.product.imagePath || "/placeholder.svg"}
                alt={requestItem.product.name}
                className="object-cover w-full h-full"
              />
              <Badge className="absolute top-1 right-1 text-xs bg-red-600">
                {requestItem.product.rarityStatus.name}
              </Badge>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h3 className="font-bold text-lg">{requestItem.product.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-1 mb-1">
                {requestItem.product.description}
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-3 text-sm">
                <div className="flex items-center gap-1">
                  <Coins className="h-4 w-4 text-amber-500" />
                  <span>{requestItem.product.price.toLocaleString()} VND</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <span>{formatDate(requestItem.accquiredDate)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-purple-500" />
                  <span>Đăng: {formatDate(exchangeRequest.createDate)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 md:ml-auto">
              <Avatar className="h-10 w-10 border-2 border-red-200">
                <AvatarImage
                  src={requester.avatar || undefined}
                  alt={`${requester.firstName} ${requester.lastName}`}
                />
                <AvatarFallback>
                  {requester.firstName?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">
                  {requester.firstName} {requester.lastName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {requester.email}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs for Offers */}
        <TabsComponent
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 flex flex-col"
        >
          <div className="px-6 pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-emerald-700">
                <ArrowLeftRight className="h-5 w-5" />
                Danh Sách Đề Nghị ({offers.length})
              </h3>
            </div>
          </div>

          <div className="flex-1 px-6 py-4">
            {offers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Chưa có đề nghị trao đổi nào cho vật phẩm này
              </div>
            ) : (
              <div>
                {offers.map((offer) => (
                  <OfferCard
                    key={offer.offerExchangeId}
                    offer={offer}
                    onAccept={handleAcceptOffer}
                    onReject={handleRejectOffer}
                  />
                ))}
              </div>
            )}
          </div>
        </TabsComponent>
      </div>
    </DialogContent>
  );
};

export default function Page() {
  const { user } = useContext(GlobalContext);
  const [selectedExchange, setSelectedExchange] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { mutate: confirm } = useConfirmAcceptedOfffer();
  const { data: exchangeRequests } = useGetAllExchangeRequestByUserId(
    user?.id ?? "",
    1,
    10
  );

  const { data: offerData, refetch } = useGetAllOfferByExchangeId(
    selectedExchange ?? "",
    1,
    10
  );
  const { toast } = useToast();
  useEffect(() => {
    if (selectedExchange) {
      refetch();
    }
  }, [selectedExchange, refetch]);

  const handleOpenModal = (exchangeRequestId: string) => {
    setSelectedExchange(exchangeRequestId);
    setIsModalOpen(true);
  };

  // Find the selected exchange request
  const selectedExchangeRequest = exchangeRequests?.result.items.find(
    (item) => item.exchangeRequestId === selectedExchange
  );
  const handleConfirm = (offerId: string, isAccepted: boolean) => {
    confirm(
      {
        isAccepted,
        offerId,
        paymentMethod: 0,
        returnUrl: `${window.location.host}`.includes("localhost")
          ? `http://${window.location.host}/payment`
          : `https://${window.location.host}/payment`,
      },
      {
        onSuccess: () => {
          toast({
            title: "Xác nhận thành công",
          });
          refetch();
        },
      }
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-background">
      <h1 className="text-3xl font-bold text-center mb-6 text-red-700">
        Trung Tâm Giao Dịch
      </h1>
      <p className="text-center text-muted-foreground mb-8">
        Trao đổi vật phẩm với người chơi khác trong chợ giao dịch
      </p>

      <Card className="border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            Vật Phẩm Trao Đổi
          </CardTitle>
          <CardDescription>
            Những vật phẩm bạn đã đăng để trao đổi. Người chơi khác có thể đưa
            ra đề nghị cho những vật phẩm này.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-2xl border shadow-lg border-black-100 overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50 border border-black-100 shadow-md rounded-lg">
                <TableRow>
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead>Vật Phẩm - Mã ID</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Độ Hiếm
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    Đã Đăng
                  </TableHead>
                  <TableHead className="text-right">Thao Tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exchangeRequests?.result.items.map((request) => (
                  <TableRow
                    key={request.exchangeRequestId}
                    className="hover:bg-muted/50"
                  >
                    <TableCell className="font-medium">
                      {request.exchangeRequestId.substring(0, 8)}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {request.requestInventoryItem.product.name} -{" "}
                          {request.requestInventoryItem.inventoryId.substring(
                            0,
                            8
                          )}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="max-w-[200px] truncate">
                        <RarityColorBadge
                          rarityName={
                            request.requestInventoryItem.product.rarityStatus
                              .name || "Common"
                          }
                          dropRate={
                            request.requestInventoryItem.product.rarityStatus
                              .dropRate
                          }
                        />
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                      {formatDate(request.createDate)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog
                        open={
                          isModalOpen &&
                          selectedExchange === request.exchangeRequestId
                        }
                        onOpenChange={setIsModalOpen}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleOpenModal(request.exchangeRequestId)
                            }
                          >
                            Chi tiết
                          </Button>
                        </DialogTrigger>
                        {selectedExchangeRequest &&
                          offerData?.result?.items && (
                            <TradeDetailsModal
                              exchangeRequest={selectedExchangeRequest}
                              offers={offerData.result.items}
                              confirm={handleConfirm}
                            />
                          )}
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
