"use client";

import type React from "react";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  ListPlus,
  MessageSquare,
  ShoppingBag,
  Tag,
} from "lucide-react";

// Sample data with enhanced properties
const tradeRequests = [
  {
    id: 1,
    item: "Dragon Sword",
    description: "Looking for a Mythril Shield",
    rarity: "Rare",
    level: 45,
    postedBy: "DragonSlayer",
    postedAt: "2 hours ago",
  },
  {
    id: 2,
    item: "Enchanted Helmet",
    description: "Want to trade for Elven Boots",
    rarity: "Epic",
    level: 30,
    postedBy: "MagicKnight",
    postedAt: "5 hours ago",
  },
  {
    id: 3,
    item: "Healing Potion Bundle",
    description: "Need mana potions, trading 20 healing potions",
    rarity: "Common",
    level: 10,
    postedBy: "AlchemyMaster",
    postedAt: "1 day ago",
  },
];

const tradeResponses = [
  {
    id: 1,
    requestedItem: "Mythril Shield",
    offeredItem: "Dragon Sword",
    respondent: "ShieldBearer",
    status: "Pending",
    responseTime: "1 hour ago",
  },
  {
    id: 2,
    requestedItem: "Elven Boots",
    offeredItem: "Enchanted Helmet",
    respondent: "ForestRanger",
    status: "Accepted",
    responseTime: "3 hours ago",
  },
  {
    id: 3,
    requestedItem: "Mana Potion Bundle",
    offeredItem: "Healing Potion Bundle",
    respondent: "WizardSupreme",
    status: "Rejected",
    responseTime: "12 hours ago",
  },
];

// Helper function to render rarity badge
const RarityBadge = ({ rarity }: { rarity: string }) => {
  const colorMap: Record<string, string> = {
    Common: "bg-slate-200 text-slate-800",
    Uncommon: "bg-green-100 text-green-800",
    Rare: "bg-blue-100 text-blue-800",
    Epic: "bg-purple-100 text-purple-800",
    Legendary: "bg-amber-100 text-amber-800",
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${
        colorMap[rarity] || "bg-gray-100 text-gray-800"
      }`}
    >
      {rarity}
    </span>
  );
};

// Helper function to render status badge
const StatusBadge = ({ status }: { status: string }) => {
  const statusMap: Record<string, { color: string; icon: React.ReactNode }> = {
    Pending: {
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      icon: <div className="w-2 h-2 rounded-full bg-yellow-400 mr-1" />,
    },
    Accepted: {
      color: "bg-green-100 text-green-800 border-green-200",
      icon: <div className="w-2 h-2 rounded-full bg-green-500 mr-1" />,
    },
    Rejected: {
      color: "bg-red-100 text-red-800 border-red-200",
      icon: <div className="w-2 h-2 rounded-full bg-red-500 mr-1" />,
    },
  };

  const { color, icon } = statusMap[status] || {
    color: "bg-gray-100 text-gray-800",
    icon: null,
  };

  return (
    <span
      className={`flex items-center px-2 py-1 rounded-full text-xs font-medium border ${color}`}
    >
      {icon}
      {status}
    </span>
  );
};

export default function TradeTabs() {
  const [tab, setTab] = useState("requests");

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-background">
      <h1 className="text-3xl font-bold text-center mb-6 text-red-700">
        Trung Tâm Giao Dịch
      </h1>
      <p className="text-center text-muted-foreground mb-8">
        Trao đổi vật phẩm với người chơi khác trong chợ giao dịch
      </p>

      <Tabs defaultValue={tab} onValueChange={setTab} className="w-full">
        <TabsList className="mb-6 grid grid-cols-2 w-full max-w-md mx-auto">
          <TabsTrigger
            value="requests"
            className="flex items-center justify-center gap-2 data-[state=active]:bg-red-700 data-[state=active]:text-primary-foreground"
          >
            <Tag className="h-4 w-4" />
            <span>Vật Phẩm Trao Đổi</span>
          </TabsTrigger>
          <TabsTrigger
            value="responses"
            className="flex items-center justify-center gap-2 data-[state=active]:bg-red-700 data-[state=active]:text-primary-foreground"
          >
            <MessageSquare className="h-4 w-4" />
            <span>Đề Nghị Trao Đổi</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="requests">
          <Card className="border shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-primary" />
                Vật Phẩm Trao Đổi
              </CardTitle>
              <CardDescription>
                Những vật phẩm bạn đã đăng để tTrao đổi. Người chơi khác có thể
                đưa ra đề nghị cho những vật phẩm này.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end mb-4">
                <Button
                  size="sm"
                  className="flex items-center gap-2 bg-red-700"
                >
                  <ListPlus className="h-4 w-4" />
                  Đăng Mới
                </Button>
              </div>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="w-[80px]">ID</TableHead>
                      <TableHead>Vật Phẩm</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Độ Hiếm
                      </TableHead>
                      <TableHead>Đang Tìm</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Đã Đăng
                      </TableHead>
                      <TableHead className="text-right">Thao Tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tradeRequests.map((request) => (
                      <TableRow key={request.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">
                          {request.id}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{request.item}</div>
                            <div className="text-xs text-muted-foreground">
                              Cấp {request.level}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <RarityBadge rarity={request.rarity} />
                        </TableCell>
                        <TableCell>
                          <div
                            className="max-w-[200px] truncate"
                            title={request.description}
                          >
                            {request.description}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                          {request.postedAt}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">
                            Chỉnh Sửa
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="responses">
          <Card className="border shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <ArrowLeftRight className="h-5 w-5 text-primary" />
                Đề Nghị Trao Đổi
              </CardTitle>
              <CardDescription>
                Đề nghị từ người chơi khác muốn Trao đổi với vật phẩm bạn đã
                đăng.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="w-[80px]">ID</TableHead>
                      <TableHead>Item cần đổi</TableHead>
                      <TableHead>Đề nghị</TableHead>
                      <TableHead className="hidden md:table-cell">Từ</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead className="text-right">Thao Tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tradeResponses.map((response) => (
                      <TableRow key={response.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">
                          {response.id}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            {response.offeredItem}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {response.responseTime}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {response.requestedItem}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {response.respondent}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={response.status} />
                        </TableCell>
                        <TableCell className="text-right">
                          {response.status === "Pending" ? (
                            <div className="flex gap-2 justify-end">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                              >
                                Chấp Nhận
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                Từ Chối
                              </Button>
                            </div>
                          ) : (
                            <Button variant="outline" size="sm">
                              Chi Tiết
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
