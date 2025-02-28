import Link from "next/link";
import { Compass } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto p-6 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-red-900">
          Thị Trường
        </h1>
       
      </div>
      <Tabs defaultValue="all" className="mb-6">
        <TabsList>
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-red-700 data-[state=active]:text-white"
          >
            Tất Cả
          </TabsTrigger>
          <TabsTrigger
            value="weapons"
            className="data-[state=active]:bg-red-700 data-[state=active]:text-white"
          >
            Vũ Khí
          </TabsTrigger>
          <TabsTrigger
            value="armor"
            className="data-[state=active]:bg-red-700 data-[state=active]:text-white"
          >
            Áo Giáp
          </TabsTrigger>
          <TabsTrigger
            value="consumables"
            className="data-[state=active]:bg-red-700 data-[state=active]:text-white"
          >
            Tiêu Hao
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {tradeItems.map((item) => (
              <Link href={`/marketplace/trade/${item.id}`} key={item.id}>
                <Card className="overflow-hidden transition-all hover:shadow-md">
                  <div className="aspect-square relative">
                    <img
                      src={item.image || "/mock-images/image2.png"}
                      alt={item.name}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute top-2 right-2 bg-red-700 text-white text-xs px-2 py-1 rounded-full">
                      {item.category}
                    </div>
                  </div>
                  <CardContent className="p-4 bg-white">
                    <h3 className="font-semibold text-lg text-red-900">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {item.description}
                    </p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex justify-between bg-white">
                    <div className="text-sm">
                      <span className="text-gray-500">Người đăng: </span>
                      {item.owner}
                    </div>
                    <div className="text-sm font-medium text-red-700">
                      {item.trades} lời đề nghị
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="weapons" className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {tradeItems
              .filter((item) => item.category === "Weapon")
              .map((item) => (
                <Link href={`/marketplace/trade/${item.id}`} key={item.id}>
                  <Card className="overflow-hidden transition-all hover:shadow-md">
                    <div className="aspect-square relative">
                      <img
                        src={item.image || "/mock-images/image2.png"}
                        alt={item.name}
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute top-2 right-2 bg-red-700 text-white text-xs px-2 py-1 rounded-full">
                        {item.category}
                      </div>
                    </div>
                    <CardContent className="p-4 bg-white">
                      <h3 className="font-semibold text-lg text-red-900">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {item.description}
                      </p>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex justify-between bg-white">
                      <div className="text-sm">
                        <span className="text-gray-500">Người đăng: </span>
                        {item.owner}
                      </div>
                      <div className="text-sm font-medium text-red-700">
                        {item.trades} lời đề nghị
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
          </div>
        </TabsContent>
        <TabsContent value="armor" className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {tradeItems
              .filter((item) => item.category === "Armor")
              .map((item) => (
                <Link href={`/marketplace/trade/${item.id}`} key={item.id}>
                  <Card className="overflow-hidden transition-all hover:shadow-md">
                    <div className="aspect-square relative">
                      <img
                        src={item.image || "/mock-images/image2.png"}
                        alt={item.name}
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute top-2 right-2 bg-red-700 text-white text-xs px-2 py-1 rounded-full">
                        {item.category}
                      </div>
                    </div>
                    <CardContent className="p-4 bg-white">
                      <h3 className="font-semibold text-lg text-red-900">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {item.description}
                      </p>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex justify-between bg-white">
                      <div className="text-sm">
                        <span className="text-gray-500">Người đăng: </span>
                        {item.owner}
                      </div>
                      <div className="text-sm font-medium text-red-700">
                        {item.trades} lời đề nghị
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
          </div>
        </TabsContent>
        <TabsContent value="consumables" className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {tradeItems
              .filter((item) => item.category === "Consumable")
              .map((item) => (
                <Link href={`/marketplace/trade/${item.id}`} key={item.id}>
                  <Card className="overflow-hidden transition-all hover:shadow-md">
                    <div className="aspect-square relative">
                      <img
                        src={item.image || "/mock-images/image2.png"}
                        alt={item.name}
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute top-2 right-2 bg-red-700 text-white text-xs px-2 py-1 rounded-full">
                        {item.category}
                      </div>
                    </div>
                    <CardContent className="p-4 bg-white">
                      <h3 className="font-semibold text-lg text-red-900">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {item.description}
                      </p>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex justify-between bg-white">
                      <div className="text-sm">
                        <span className="text-gray-500">Người đăng: </span>
                        {item.owner}
                      </div>
                      <div className="text-sm font-medium text-red-700">
                        {item.trades} lời đề nghị
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

const tradeItems = [
  {
    id: "1",
    name: "Enchanted Sword",
    description:
      "A powerful sword with magical properties. Deals extra damage against undead enemies.",
    category: "Weapon",
    image: "/mock-images/image2.png?height=300&width=300",
    owner: "DragonSlayer",
    trades: 5,
  },
  {
    id: "2",
    name: "Plate Armor",
    description:
      "Heavy armor that provides excellent protection against physical attacks.",
    category: "Armor",
    image: "/mock-images/image2.png?height=300&width=300",
    owner: "KnightOfTheRealm",
    trades: 3,
  },
  {
    id: "3",
    name: "Health Potion",
    description: "Restores 50 health points when consumed. Tastes like cherry.",
    category: "Consumable",
    image: "/mock-images/image2.png?height=300&width=300",
    owner: "AlchemistSupreme",
    trades: 12,
  },
  {
    id: "4",
    name: "Fire Staff",
    description:
      "A staff that can cast powerful fire spells. Be careful not to burn yourself.",
    category: "Weapon",
    image: "/mock-images/image2.png?height=300&width=300",
    owner: "WizardOfTheFlame",
    trades: 7,
  },
  {
    id: "5",
    name: "Leather Boots",
    description: "Light boots that increase movement speed and stealth.",
    category: "Armor",
    image: "/mock-images/image2.png?height=300&width=300",
    owner: "ShadowWalker",
    trades: 2,
  },
  {
    id: "6",
    name: "Mana Crystal",
    description:
      "Restores 30 mana points when consumed. Glows with a blue light.",
    category: "Consumable",
    image: "/mock-images/image2.png?height=300&width=300",
    owner: "MysticMage",
    trades: 8,
  },
  {
    id: "7",
    name: "Bow of Accuracy",
    description: "A finely crafted bow that increases accuracy and range.",
    category: "Weapon",
    image: "/mock-images/image2.png?height=300&width=300",
    owner: "ForestHunter",
    trades: 4,
  },
  {
    id: "8",
    name: "Shield of Protection",
    description:
      "A sturdy shield that provides protection against all types of damage.",
    category: "Armor",
    image: "/mock-images/image2.png?height=300&width=300",
    owner: "GuardianOfLight",
    trades: 6,
  },
];
