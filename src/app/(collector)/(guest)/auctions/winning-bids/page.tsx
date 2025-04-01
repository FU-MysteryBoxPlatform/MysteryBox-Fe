// components/AuctionHistory.tsx
"use client";

import { useContext } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import Image from "next/image";
import { useGetAllAuctionHistory } from "@/hooks/api/useAuction";
import { GlobalContext } from "@/provider/global-provider";

export default function AuctionHistory({}: {}) {
  const { user } = useContext(GlobalContext);
  const { data } = useGetAllAuctionHistory(user?.id ?? "", 0, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy HH:mm:ss");
  };

  return (
    <div className="space-y-4 px-2 sm:px-0">
      {data?.result.map((item, index) => (
        <Card
          key={item.auction.auctionId}
          className="overflow-hidden mx-auto w-full max-w-4xl"
        >
          <CardHeader className="bg-muted/50 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Image
                src={item.auction.inventory.product.imagePath}
                alt={item.auction.inventory.product.name}
                width={80}
                height={80}
                className="rounded-md object-cover flex-shrink-0 w-20 h-20 sm:w-[80px] sm:h-[80px]"
              />
              <div className="flex-1 text-center sm:text-left">
                <CardTitle className="text-lg sm:text-xl">
                  {item.auction.inventory.product.name}
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {item.auction.inventory.product.description}
                </p>
                <div className="mt-2 flex flex-wrap justify-center sm:justify-start gap-2">
                  <Badge variant="secondary" className="text-xs">
                    Độ hiếm: {item.auction.inventory.product.rarityStatus.name}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Giá khởi điểm: {formatCurrency(item.auction.minimunBid)}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Giá hiện tại: {formatCurrency(item.auction.currentBid)}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value={`item-${index}`}>
                <AccordionTrigger className="text-sm sm:text-base">
                  Lịch sử đấu giá ({item.auctionHistories.length} lượt)
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3">
                    {item.auctionHistories
                      .sort(
                        (a, b) =>
                          new Date(b.createDate).getTime() -
                          new Date(a.createDate).getTime()
                      )
                      .map((history) => (
                        <div
                          key={history.auctionHistoryId}
                          className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-muted/20 rounded-md animate-in slide-in-from-top gap-2"
                        >
                          <div className="w-full sm:w-auto">
                            <p className="font-medium text-sm sm:text-base">
                              {history.account
                                ? `${history.account.firstName} ${history.account.lastName}`
                                : "Người dùng ẩn danh"}
                            </p>
                            <p className="text-xs sm:text-sm text-muted-foreground truncate max-w-[200px] sm:max-w-[300px]">
                              {history.account
                                ? history.account.email
                                : "Không có email"}
                            </p>
                            <p className="text-xs mt-1">
                              {formatDateTime(history.createDate)}
                            </p>
                          </div>
                          <div className="text-left sm:text-right w-full sm:w-auto">
                            <p className="font-medium text-sm sm:text-base">
                              {formatCurrency(history.amount)}
                            </p>
                            <Badge
                              variant={
                                history.statusId === 1
                                  ? "default"
                                  : "destructive"
                              }
                              className="mt-1 text-xs"
                            >
                              {history.auctionHistoryStatus
                                ? history.auctionHistoryStatus.name
                                : "Không rõ trạng thái"}
                            </Badge>
                          </div>
                        </div>
                      ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
