// components/AuctionHistory.tsx
"use client";

import { useContext, useState } from "react";
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

// Define types based on your JSON structure

export default function AuctionHistory({}: {}) {

  const {user}= useContext(GlobalContext)
  const {data: data} = useGetAllAuctionHistory(user?.id ?? "", 0, 0);
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
    <div className="space-y-4">
      {data?.result.map((item, index) => (
        <Card key={item.auction.auctionId} className="overflow-hidden">
          <CardHeader className="bg-muted/50">
            <div className="flex items-center gap-4">
              <Image
                src={item.auction.inventory.product.imagePath}
                alt={item.auction.inventory.product.name}
                width={80}
                height={80}
                className="rounded-md object-cover"
              />
              <div className="flex-1">
                <CardTitle>{item.auction.inventory.product.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {item.auction.inventory.product.description}
                </p>
                <div className="mt-2 flex gap-2">
                  <Badge variant="secondary">
                    Độ hiếm: {item.auction.inventory.product.rarityStatus.name}
                  </Badge>
                  <Badge variant="outline">
                    Giá khởi điểm: {formatCurrency(item.auction.minimunBid)}
                  </Badge>
                  <Badge variant="outline">
                    Giá hiện tại: {formatCurrency(item.auction.currentBid)}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value={`item-${index}`}>
                <AccordionTrigger>
                  Auction History ({item.auctionHistories.length} bids)
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    {item.auctionHistories
                      .sort(
                        (a, b) =>
                          new Date(b.createDate).getTime() -
                          new Date(a.createDate).getTime()
                      )
                      .map((history) => (
                        <div
                          key={history.auctionHistoryId}
                          className="flex items-center justify-between p-3 bg-muted/20 rounded-md animate-in slide-in-from-top"
                        >
                          <div>
                            <p className="font-medium">
                              {history.account ? `${history.account.firstName} ${history.account.lastName}` : "Unknown User"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {history.account ? history.account.email : "Unknown Email"}
                            </p>
                            <p className="text-sm">
                              {formatDateTime(history.createDate)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              {formatCurrency(history.amount)}
                            </p>
                            <Badge
                              variant={
                                history.statusId === 1
                                  ? "default"
                                  : "destructive"
                              }
                            >
                              {history.auctionHistoryStatus ? history.auctionHistoryStatus.name : "Unknown Status"}
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
