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
  Eye,
  ShoppingBag,
  X,
} from "lucide-react";
import {
  useCancelExchangeRequest,
  useGetAllExchangeRequestByUserId,
} from "@/hooks/api/useExchange";
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
  useGetAllOfferByAccountId,
  useGetAllOfferByExchangeId,
} from "@/hooks/api/useOfferExchange";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExchangeRequest, OfferExchange } from "@/types";
import { useToast } from "@/hooks/use-toast";
import LoadingIndicator from "@/app/components/LoadingIndicator";
import { ExchangeStatus } from "@/types/enum";

interface TradeDetailsModalProps {
  exchangeRequest: ExchangeRequest;
  isLoading: boolean;
  offers: OfferExchange[];
  confirm: (offerId: string, isSucces: boolean) => void;
}

const OfferCard = ({
  offer,
  onAccept,
  onReject,
  isLoading,
}: {
  offer: OfferExchange;
  onAccept: (offerId: string) => void;
  onReject: (offerId: string) => void;
  isLoading: boolean;
}) => {
  const offeredItem = offer.offeredInventoryItem;
  const offerer = offer.createByAccount;

  const getStatusBadge = (status: 0 | 1 | 2) => {
    const statusMap = {
      0: { text: "Đang Chờ", className: "bg-yellow-100 text-yellow-800" },
      1: { text: "Đã Chấp Nhận", className: "bg-green-100 text-green-800" },
      2: { text: "Đã Từ Chối", className: "bg-red-100 text-red-800" },
    };
    const { text, className } = statusMap[status] || statusMap[0];
    return (
      <Badge className={`px-3 py-1 rounded-full font-semibold ${className}`}>
        {text}
      </Badge>
    );
  };

  return (
    <Card className="mb-4 shadow-md border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
      <CardHeader className="p-4 flex flex-row items-center gap-4 bg-gray-50 border-b border-gray-200">
        <Avatar className="h-12 w-12 border-2 border-gray-300">
          <AvatarImage src={offerer?.avatar ?? undefined} />
          <AvatarFallback>
            {offerer?.firstName?.charAt(0) || "U"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-gray-900">
            {offerer?.firstName} {offerer?.lastName}
          </h3>
          <p className="text-sm text-gray-600">{offerer?.email}</p>
        </div>
        {getStatusBadge((offer?.offerExchangeStatusId as 0 | 1 | 2) || 0)}
      </CardHeader>

      <CardContent className="p-4 flex flex-col md:flex-row gap-6">
        <div className="relative w-full md:w-1/3 h-48 rounded-lg overflow-hidden shadow-sm">
          <img
            src={offeredItem.product.imagePath || "/placeholder.svg"}
            alt={offeredItem.product.name}
            className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
          />
          <Badge className="absolute top-2 right-2 bg-emerald-600 text-white text-xs">
            {offeredItem.product.rarityStatus.name}
          </Badge>
        </div>

        <div className="flex-1 space-y-4">
          <h4 className="font-bold text-xl text-gray-900">
            {offeredItem.product.name}
          </h4>
          <p className="text-sm text-gray-600 line-clamp-2">
            {offeredItem.product.description}
          </p>
          <div className="grid grid-cols-2 gap-3 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <Coins className="h-4 w-4 text-amber-500" />
              <span>{offeredItem.product.price.toLocaleString()} VND</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-500" />
              <span>{formatDate(offeredItem.accquiredDate)}</span>
            </div>
          </div>
          {offer.content && offer.content !== "string" && (
            <div className="bg-gray-100 p-3 rounded-md text-sm text-gray-700">
              <span className="font-medium">Lời nhắn: </span>
              {offer.content}
            </div>
          )}
          {offer?.offerExchangeStatusId === 0 && (
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                className="border-red-300 text-red-600 hover:bg-red-50"
                onClick={() => onReject(offer.offerExchangeId)}
                disabled={isLoading}
              >
                <X className="h-4 w-4 mr-2" /> Từ Chối
              </Button>
              <Button
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={() => onAccept(offer.offerExchangeId)}
                disabled={isLoading}
              >
                <Check className="h-4 w-4 mr-2" /> Chấp Nhận
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const TradeDetailsModal = ({
  exchangeRequest,
  isLoading,
  offers,
  confirm,
}: TradeDetailsModalProps) => {
  const requestItem = exchangeRequest.requestInventoryItem;
  const requester = exchangeRequest.createByAccount;

  const handleAcceptOffer = (offerId: string) => confirm(offerId, true);
  const handleRejectOffer = (offerId: string) => confirm(offerId, false);

  return (
    <DialogContent className="max-w-4xl max-h-[90vh] p-0 bg-white rounded-xl shadow-xl">
      <DialogHeader className="p-6 bg-gray-50 border-b border-gray-200">
        <DialogTitle className="text-2xl font-bold text-gray-900 text-center">
          Chi Tiết Giao Dịch
        </DialogTitle>
        <DialogDescription className="text-gray-600 text-center">
          Xem thông tin và các đề nghị trao đổi
        </DialogDescription>
      </DialogHeader>

      <div className="p-6 bg-white">
        <div className="flex flex-col md:flex-row gap-6 items-center bg-gray-50 p-4 rounded-lg">
          <div className="relative w-32 h-32 rounded-lg overflow-hidden shadow-md">
            <img
              src={requestItem.product.imagePath || "/placeholder.svg"}
              alt={requestItem.product.name}
              className="object-cover w-full h-full"
            />
            <Badge className="absolute top-2 right-2 bg-red-600 text-white text-xs">
              {requestItem.product.rarityStatus.name}
            </Badge>
          </div>
          <div className="flex-1 text-center md:text-left space-y-2">
            <h3 className="font-bold text-xl text-gray-900">
              {requestItem.product.name}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2">
              {requestItem.product.description}
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <Coins className="h-4 w-4 text-amber-500" />
                <span>{requestItem.product.price.toLocaleString()} VND</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-500" />
                <span>{formatDate(requestItem.accquiredDate)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-purple-500" />
                <span>Đăng: {formatDate(exchangeRequest.createDate)}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-gray-300">
              <AvatarImage src={requester?.avatar ?? undefined} />
              <AvatarFallback>
                {requester?.firstName?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-gray-900">
                {requester?.firstName} {requester?.lastName}
              </p>
              <p className="text-xs text-gray-600">{requester?.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 flex-1 overflow-y-auto">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <ArrowLeftRight className="h-5 w-5 text-emerald-600" />
          Đề Nghị Trao Đổi ({offers.length})
        </h3>
        {offers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Chưa có đề nghị nào cho vật phẩm này
          </div>
        ) : (
          offers.map((offer) => (
            <OfferCard
              key={offer.offerExchangeId}
              offer={offer}
              onAccept={handleAcceptOffer}
              onReject={handleRejectOffer}
              isLoading={isLoading}
            />
          ))
        )}
      </div>
    </DialogContent>
  );
};

export default function Page() {
  const { user } = useContext(GlobalContext);
  const [selectedExchange, setSelectedExchange] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { mutate: confirm, isPending: isPendingConfirm } =
    useConfirmAcceptedOfffer();
  const { data: exchangeRequests, refetch: refetchGetAll } =
    useGetAllExchangeRequestByUserId(user?.id ?? "", 1, 10);
  const {
    data: offerData,
    refetch,
    isPending,
  } = useGetAllOfferByExchangeId(selectedExchange ?? "", 0, 0);
  const { data: offerItems } = useGetAllOfferByAccountId(user?.id ?? "", 0, 0);
  const cancelExchange = useCancelExchangeRequest(selectedExchange ?? "");
  const { toast } = useToast();

  const getStatusBadge = (statusId: ExchangeStatus) => {
    const statusMap = {
      [ExchangeStatus.PENDING]: {
        text: "Đang Chờ",
        className: "bg-yellow-100 text-yellow-800",
      },
      [ExchangeStatus.REJECTED]: {
        text: "Đã Từ Chối",
        className: "bg-red-100 text-red-800",
      },
      [ExchangeStatus.COMPLETED]: {
        text: "Đã Hoàn Tất",
        className: "bg-green-100 text-green-800",
      },
      [ExchangeStatus.CANCELLED]: {
        text: "Đã Hủy",
        className: "bg-gray-100 text-gray-800",
      },
    };
    const { text, className } =
      statusMap[statusId] || statusMap[ExchangeStatus.PENDING];
    return (
      <Badge className={`px-3 py-1 rounded-full font-semibold ${className}`}>
        {text}
      </Badge>
    );
  };

  useEffect(() => {
    if (selectedExchange) refetch();
  }, [selectedExchange, refetch]);

  const handleOpenModal = (exchangeRequestId: string) => {
    setSelectedExchange(exchangeRequestId);
    setIsModalOpen(true);
  };

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
          toast({ title: "Xác nhận thành công" });
          refetch();
        },
      }
    );
  };

  if (isPending) {
    return (
      <div className="w-full max-w-7xl mx-auto p-6 bg-gray-50">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-900">
          Trung Tâm Giao Dịch
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Trao đổi vật phẩm với người chơi khác
        </p>
        <div className="flex justify-center">
          <LoadingIndicator />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-white rounded-lg">
      <h1 className="text-3xl font-bold text-center mb-4 text-gray-900">
        Trung Tâm Giao Dịch
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Quản lý các yêu cầu và đề nghị trao đổi của bạn
      </p>

      <Card className="shadow-lg border border-gray-200 rounded-xl">
        <CardHeader className="p-6 bg-white border-b border-gray-200">
          <CardTitle className="flex items-center gap-2 text-2xl font-semibold text-gray-900">
            <ShoppingBag className="h-6 w-6 text-emerald-600" /> Giao Dịch Của
            Bạn
          </CardTitle>
          <CardDescription className="text-gray-600">
            Theo dõi các vật phẩm bạn đã đăng và các đề nghị từ người chơi khác
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue="tab1" className="w-full">
            <TabsList className="grid grid-cols-2 gap-4 mb-6 bg-gray-100 p-1 rounded-lg">
              <TabsTrigger
                value="tab1"
                className="py-2 rounded-md text-gray-700 font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
              >
                Yêu Cầu Trao Đổi
              </TabsTrigger>
              <TabsTrigger
                value="tab2"
                className="py-2 rounded-md text-gray-700 font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
              >
                Đề Nghị Đã Gửi
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tab1">
              <Table className="bg-white rounded-lg shadow-md border border-gray-200">
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="text-gray-900 font-semibold">
                      ID
                    </TableHead>
                    <TableHead className="text-gray-900 font-semibold">
                      Vật Phẩm
                    </TableHead>
                    <TableHead className="text-gray-900 font-semibold hidden md:table-cell">
                      Độ Hiếm
                    </TableHead>
                    <TableHead className="text-gray-900 font-semibold hidden md:table-cell">
                      Ngày Đăng
                    </TableHead>
                    <TableHead className="text-gray-900 font-semibold hidden md:table-cell">
                      Trạng Thái
                    </TableHead>
                    <TableHead className="text-gray-900 font-semibold text-right">
                      Thao Tác
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {exchangeRequests?.result.items.map((request) => (
                    <TableRow
                      key={request.exchangeRequestId}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <TableCell className="font-mono text-sm text-gray-700">
                        {request.exchangeRequestId.substring(0, 8)}
                      </TableCell>
                      <TableCell className="font-medium text-gray-900">
                        {request.requestInventoryItem.product.name} -{" "}
                        {request.requestInventoryItem.inventoryId.substring(
                          0,
                          8
                        )}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
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
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-gray-600 text-sm">
                        {formatDate(request.createDate)}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {getStatusBadge(request.statusId)}
                      </TableCell>
                      <TableCell className="text-right flex justify-end gap-2">
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
                              className="border-gray-300 text-gray-700 hover:bg-gray-100"
                              onClick={() =>
                                handleOpenModal(request.exchangeRequestId)
                              }
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          {selectedExchange && offerData?.result?.items && (
                            <TradeDetailsModal
                              exchangeRequest={
                                exchangeRequests.result.items.find(
                                  (item) =>
                                    item.exchangeRequestId === selectedExchange
                                )!
                              }
                              offers={offerData.result.items}
                              isLoading={isPendingConfirm}
                              confirm={handleConfirm}
                            />
                          )}
                        </Dialog>
                        {request.statusId !== ExchangeStatus.CANCELLED && (
                          <Button
                            size="sm"
                            className="bg-red-600 hover:bg-red-700 text-white"
                            onClick={() => {
                              setSelectedExchange(request.exchangeRequestId);
                              cancelExchange.mutate(request.exchangeRequestId, {
                                onSuccess: () => {
                                  toast({ title: "Hủy yêu cầu thành công" });
                                  refetchGetAll();
                                },
                              });
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="tab2">
              <Table className="bg-white rounded-lg shadow-md border border-gray-200">
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="text-gray-900 font-semibold">
                      ID
                    </TableHead>
                    <TableHead className="text-gray-900 font-semibold">
                      Người Yêu Cầu
                    </TableHead>
                    <TableHead className="text-gray-900 font-semibold">
                      Vật Phẩm Yêu Cầu
                    </TableHead>
                    <TableHead className="text-gray-900 font-semibold">
                      Vật Phẩm Đề Nghị
                    </TableHead>
                    <TableHead className="text-gray-900 font-semibold">
                      Người Nhận
                    </TableHead>
                    <TableHead className="text-gray-900 font-semibold">
                      Trạng Thái
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {offerItems?.result.items.map((item) => (
                    <TableRow
                      key={item.offerExchangeId}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <TableCell className="font-mono text-sm text-gray-700">
                        {item.exchangeRequestId.substring(0, 8)}
                      </TableCell>
                      <TableCell className="font-medium text-gray-900">
                        {
                          item.exchangeRequest.requestInventoryItem.account
                            .firstName
                        }{" "}
                        {
                          item.exchangeRequest.requestInventoryItem.account
                            .lastName
                        }
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              item.exchangeRequest.requestInventoryItem.product
                                .imagePath
                            }
                            alt={
                              item.exchangeRequest.requestInventoryItem.product
                                .name
                            }
                            className="w-12 h-12 rounded-md shadow-sm"
                          />
                          <span className="font-medium text-gray-900">
                            {
                              item.exchangeRequest.requestInventoryItem.product
                                .name
                            }
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            src={item.offeredInventoryItem?.product.imagePath}
                            alt={item.offeredInventoryItem?.product.name}
                            className="w-12 h-12 rounded-md shadow-sm"
                          />
                          <span className="font-medium text-gray-900">
                            {item.offeredInventoryItem?.product.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-gray-900">
                        {
                          item.exchangeRequest.offeredInventoryItem?.account
                            .firstName
                        }{" "}
                        {
                          item.exchangeRequest.offeredInventoryItem?.account
                            .lastName
                        }
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(item.exchangeRequest.statusId)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
