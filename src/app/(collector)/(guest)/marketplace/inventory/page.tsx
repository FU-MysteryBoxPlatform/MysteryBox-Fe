import Link from "next/link";
import { ArrowLeft, Package } from "lucide-react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function InventoryPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Package className="h-5 w-5" />
            <span>TradeHub</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-muted-foreground hover:text-primary"
            >
              Marketplace
            </Link>
            <Link
              href="/inventory"
              className="text-sm font-medium text-primary"
            >
              My Inventory
            </Link>
            <Link
              href="/trades"
              className="text-sm font-medium text-muted-foreground hover:text-primary"
            >
              My Trades
            </Link>
          </nav>
        </div>
      </header>
      <main className="container py-6">
        <div className="mb-6">
          <Link
            href="/"
            className="flex items-center text-sm text-muted-foreground hover:text-primary mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Marketplace
          </Link>
          <h1 className="text-2xl font-bold">My Inventory</h1>
          <p className="text-muted-foreground">
            Manage your items and see what you can trade
          </p>
        </div>

        <Tabs defaultValue="all" className="mb-6">
          <TabsList>
            <TabsTrigger value="all">All Items</TabsTrigger>
            <TabsTrigger value="weapons">Weapons</TabsTrigger>
            <TabsTrigger value="armor">Armor</TabsTrigger>
            <TabsTrigger value="consumables">Consumables</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {inventoryItems.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="aspect-square relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                      {item.category}
                    </div>
                  </div>
                  <CardHeader className="p-4 pb-0">
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {item.description}
                    </p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex justify-between">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Rarity: </span>
                      {item.rarity || "Common"}
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="weapons" className="mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {inventoryItems
                .filter((item) => item.category === "Weapon")
                .map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <div className="aspect-square relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                        {item.category}
                      </div>
                    </div>
                    <CardHeader className="p-4 pb-0">
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {item.description}
                      </p>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex justify-between">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Rarity: </span>
                        {item.rarity || "Common"}
                      </div>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </TabsContent>
          <TabsContent value="armor" className="mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {inventoryItems
                .filter((item) => item.category === "Armor")
                .map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <div className="aspect-square relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                        {item.category}
                      </div>
                    </div>
                    <CardHeader className="p-4 pb-0">
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {item.description}
                      </p>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex justify-between">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Rarity: </span>
                        {item.rarity || "Common"}
                      </div>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </TabsContent>
          <TabsContent value="consumables" className="mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {inventoryItems
                .filter((item) => item.category === "Consumable")
                .map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <div className="aspect-square relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                        {item.category}
                      </div>
                    </div>
                    <CardHeader className="p-4 pb-0">
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {item.description}
                      </p>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex justify-between">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Rarity: </span>
                        {item.rarity || "Common"}
                      </div>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

const inventoryItems = [
  {
    id: "inv1",
    name: "Dagger of Stealth",
    description: "A small but deadly dagger that grants stealth bonuses.",
    category: "Weapon",
    image: "/placeholder.svg?height=300&width=300",
    rarity: "Uncommon",
  },
  {
    id: "inv2",
    name: "Chainmail Armor",
    description: "Flexible armor made of interlocking metal rings.",
    category: "Armor",
    image: "/placeholder.svg?height=300&width=300",
    rarity: "Common",
  },
  {
    id: "inv3",
    name: "Strength Potion",
    description: "Temporarily increases strength by 10 points.",
    category: "Consumable",
    image: "/placeholder.svg?height=300&width=300",
    rarity: "Common",
  },
  {
    id: "inv4",
    name: "Warhammer",
    description:
      "A heavy hammer that deals massive damage to armored opponents.",
    category: "Weapon",
    image: "/placeholder.svg?height=300&width=300",
    rarity: "Rare",
  },
  {
    id: "inv5",
    name: "Helmet of Vision",
    description:
      "Enhances vision in dark places and protects against critical hits.",
    category: "Armor",
    image: "/placeholder.svg?height=300&width=300",
    rarity: "Uncommon",
  },
  {
    id: "inv6",
    name: "Invisibility Potion",
    description: "Makes the user invisible for 30 seconds.",
    category: "Consumable",
    image: "/placeholder.svg?height=300&width=300",
    rarity: "Rare",
  },
  {
    id: "inv7",
    name: "Crossbow",
    description: "A powerful ranged weapon with high accuracy.",
    category: "Weapon",
    image: "/placeholder.svg?height=300&width=300",
    rarity: "Common",
  },
  {
    id: "inv8",
    name: "Gauntlets of Power",
    description: "Increases melee damage and provides protection for hands.",
    category: "Armor",
    image: "/placeholder.svg?height=300&width=300",
    rarity: "Uncommon",
  },
];
