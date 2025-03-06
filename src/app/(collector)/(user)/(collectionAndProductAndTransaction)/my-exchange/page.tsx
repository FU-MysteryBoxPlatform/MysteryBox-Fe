"use client";;
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
  XCircleIcon,
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
import { Tabs as TabsComponent } from "@/components/ui/tabs";
import { ExchangeRequest, OfferExchange } from "@/types";
import { useToast } from "@/hooks/use-toast";
import LoadingIndicator from "@/app/components/LoadingIndicator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
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
      0: {
        text: "Đang Chờ",
        className: "bg-yellow-50 text-yellow-700",
      },
      1: {
        text: "Đã Chấp Nhận",
        className: "bg-green-50 text-green-700",
      },
      2: {
        text: "Đã Từ Chối",
        className: "bg-red-50 text-red-700",
      },
    };

    const { text, className } = statusMap[status] || statusMap[0];

    return (
      <Badge variant="outline" className={`ml-auto ${className}`}>
        {text}
      </Badge>
    );
  };
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
        {getStatusBadge((offer?.offerExchangeStatusId as 0 | 1 | 2) || 0)}
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
              {offer?.offerExchangeStatusId === 0 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                    onClick={() => onReject(offer.offerExchangeId)}
                    disabled={isLoading}
                  >
                    {isLoading && <LoadingIndicator />}
                    <X className="h-4 w-4 mr-1" /> Từ Chối
                  </Button>
                  <Button
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => onAccept(offer.offerExchangeId)}
                    disabled={isLoading}
                  >
                    {isLoading && <LoadingIndicator />}
                    <Check className="h-4 w-4 mr-1" /> Chấp Nhận
                  </Button>
                </>
              )}
            </div>
          </div>
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
  const [activeTab, setActiveTab] = useState("offers");

  const requestItem = exchangeRequest.requestInventoryItem;
  const requester = exchangeRequest.createByAccount;

  const handleAcceptOffer = (offerId: string) => {
    confirm(offerId, true);
  };

  const handleRejectOffer = (offerId: string) => {
    confirm(offerId, true);
  };
  console.log(isLoading);

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
        <div className="px-6 py-4 bg-gray-50 border-y ">
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
              <div className="overflow-y-scroll max-h-[70vh]">
                {offers.map((offer) => (
                  <OfferCard
                    key={offer.offerExchangeId}
                    offer={offer}
                    onAccept={handleAcceptOffer}
                    onReject={handleRejectOffer}
                    isLoading={isLoading}
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

  const getStatusBadge = (statusId: ExchangeStatus) => {
    const statusMap = {
      [ExchangeStatus.PENDING]: {
        text: "Đang Chờ",
        className: "bg-yellow-100 text-yellow-700",
      },
      [ExchangeStatus.REJECTED]: {
        text: "Đã Từ Chối",
        className: "bg-red-100 text-red-700",
      },
      [ExchangeStatus.COMPLETED]: {
        text: "Đã Chấp Nhận",
        className: "bg-green-100 text-green-700",
      },
      [ExchangeStatus.CANCELLED]: {
        text: "Đã Hủy",
        className: "bg-gray-100 text-gray-700",
      },
    };

    const { text, className } =
      statusMap[statusId] || statusMap[ExchangeStatus.PENDING];

    return (
      <Badge
        variant="outline"
        className={`px-3 py-1 rounded-full text-xs font-semibold text-nowrap ${className}`}
      >
        {text}
      </Badge>
    );
  };

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

  if (isPending) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6 bg-background">
        <h1 className="text-3xl font-bold text-center mb-6 text-red-700">
          Trung Tâm Giao Dịch
        </h1>
        <p className="text-center text-muted-foreground mb-8">
          Trao đổi vật phẩm với người chơi khác trong chợ giao dịch
        </p>
        <div className="w-full flex items-center justify-center">
          <LoadingIndicator />
        </div>
      </div>
    );
  }
  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-background">
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
          <div>
            <Tabs defaultValue="tab1" className="w-full">
              <TabsList className="flex justify-start gap-4 border-b border-gray-300 mb-4">
                <TabsTrigger
                  value="tab1"
                  className="px-4 py-2 rounded-t-lg text-gray-600 hover:text-black transition-all duration-300 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
                >
                  Yêu cầu trao đổi
                </TabsTrigger>
                <TabsTrigger
                  value="tab2"
                  className="px-4 py-2 rounded-t-lg text-gray-600 hover:text-black transition-all duration-300 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
                >
                  Offer với người khác
                </TabsTrigger>
              </TabsList>
              <TabsContent value="tab1">
                <div className="rounded-2xl border shadow-lg border-black-100 overflow-hidden p-4">
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
                        <TableHead className="hidden md:table-cell">
                          Trạng thái
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
                                  request.requestInventoryItem.product
                                    .rarityStatus.name || "Common"
                                }
                                dropRate={
                                  request.requestInventoryItem.product
                                    .rarityStatus.dropRate
                                }
                              />
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                            {formatDate(request.createDate)}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Badge
                              variant="outline"
                              className={`px-3 py-1 rounded-full text-xs font-semibold text-nowrap ${
                                request.statusId === 0
                                  ? "bg-yellow-100 text-yellow-700"
                                  : request.statusId === 2
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {request.statusId === 0
                                ? "Đang Chờ"
                                : request.statusId === 1
                                ? "Đã Chấp Nhận"
                                : "Đã Từ Chối"}
                            </Badge>
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
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      handleOpenModal(request.exchangeRequestId)
                                    }
                                  >
                                    <Eye className="h-4 w-4 " />
                                  </Button>

                                  {request.statusId !==
                                    ExchangeStatus.CANCELLED && (
                                    <Button
                                      size="sm"
                                      style={{
                                        backgroundColor: "#F87171",
                                        color: "#fff",
                                        textAlign: "center",
                                      }}
                                      onClick={() => {
                                        setSelectedExchange(
                                          request.exchangeRequestId
                                        );
                                        cancelExchange.mutate(
                                          request.exchangeRequestId,
                                          {
                                            onSuccess: () => {
                                              toast({
                                                title: "Hủy yêu cầu thành công",
                                              });
                                              refetchGetAll();
                                            },
                                          }
                                        );
                                      }}
                                    >
                                      <XCircleIcon className="h-4 w-4" />
                                    </Button>
                                  )}
                                </>
                              </DialogTrigger>
                              {selectedExchangeRequest &&
                                offerData?.result?.items && (
                                  <TradeDetailsModal
                                    exchangeRequest={selectedExchangeRequest}
                                    offers={offerData.result.items}
                                    isLoading={isPendingConfirm}
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
              </TabsContent>

              <TabsContent value="tab2">
                <Table className="w-full border border-gray-300 shadow-sm rounded-lg overflow-hidden">
                  <TableHeader className="bg-gray-100 text-gray-700 uppercase text-sm">
                    <TableRow className="border-b border-gray-300">
                      <TableHead className="px-4 py-3 w-20">ID</TableHead>
                      <TableHead className="px-4 py-3">Người yêu cầu</TableHead>
                      <TableHead className="px-4 py-3">
                        Requested Item
                      </TableHead>
                      <TableHead className="px-4 py-3">
                        Vật phẩm offer
                      </TableHead>
                      <TableHead className="px-4 py-3">
                        Người được offer
                      </TableHead>
                      <TableHead className="px-4 py-3">Trạng thái</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {offerItems?.result.items.map((item, index) => (
                      <TableRow
                        key={item.offerExchangeId}
                        className={`border-b border-gray-200 ${
                          index % 2 === 0 ? "bg-gray-50" : "bg-white"
                        } hover:bg-gray-100 transition-colors`}
                      >
                        <TableCell className="px-4 py-3 font-mono text-sm text-gray-600">
                          {item.exchangeRequestId.substring(0, 8)}
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          <div className="flex items-center gap-2 text-gray-800 font-medium">
                            {
                              item.exchangeRequest.requestInventoryItem.account
                                .firstName
                            }{" "}
                            {
                              item.exchangeRequest.requestInventoryItem.account
                                .lastName
                            }
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <img
                              src={
                                item.exchangeRequest.requestInventoryItem
                                  .product.imagePath
                              }
                              alt={
                                item.exchangeRequest.requestInventoryItem
                                  .product.name
                              }
                              className="w-12 h-12 rounded-md shadow"
                            />
                            <span className="text-gray-700 font-medium">
                              {
                                item.exchangeRequest.requestInventoryItem
                                  .product.name
                              }
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <img
                              src={
                                item.exchangeRequest.offeredInventoryItem
                                  ?.product.imagePath
                              }
                              alt={
                                item.exchangeRequest.offeredInventoryItem
                                  ?.product.name
                              }
                              className="w-12 h-12 rounded-md shadow"
                            />
                            <span className="text-gray-700 font-medium">
                              {
                                item.exchangeRequest.offeredInventoryItem
                                  ?.product.name
                              }
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          <div className="flex items-center gap-2 text-gray-800 font-medium">
                            {
                              item.exchangeRequest.offeredInventoryItem?.account
                                .firstName
                            }{" "}
                            {
                              item.exchangeRequest.offeredInventoryItem?.account
                                .lastName
                            }
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3 font-semibold">
                          {getStatusBadge(item.exchangeRequest.statusId)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
