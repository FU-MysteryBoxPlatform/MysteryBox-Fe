"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Product } from "@/types";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProductList() {
  const mockProducts: Product[] = [
    {
      productId: "1",
      name: "Cosmic Sword",
      description: "A legendary blade forged from stardust",
      price: 999.99,
      discount: 10,
      isDeleted: false,
      rarityStatusId: 1,
      rarityStatus: {
        id: 1,
        name: "Legendary",
        dropRate: "0.1%",
      },
      productStatusId: 1,
      productStatus: {
        id: 1,
        name: "Available",
      },
      imagePath:
        "https://product.hstatic.net/1000328919/product/nh-labubu-the-monsters-flip-with-me-vinyl-plush-doll-40cm-pop-mart__1__a843bbd538b44d61a7c312f34ad0d449_grande.jpg",
    },
    {
      productId: "2",
      name: "Crystal Shield",
      description: "Protective gear with mystical powers",
      price: 599.99,
      discount: 15,
      isDeleted: false,
      rarityStatusId: 2,
      rarityStatus: {
        id: 2,
        name: "Rare",
        dropRate: "1%",
      },
      productStatusId: 1,
      productStatus: {
        id: 1,
        name: "Available",
      },
      imagePath:
        "https://product.hstatic.net/1000328919/product/nh-labubu-the-monsters-flip-with-me-vinyl-plush-doll-40cm-pop-mart__1__a843bbd538b44d61a7c312f34ad0d449_grande.jpg",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mockProducts.map((product) => {
          const finalPrice = product.price * (1 - product.discount / 100);
          return (
            <Link key={product.productId} href={`/items/${product.productId}`}>
              <Card className="group h-full flex flex-col overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300">
                <div className="relative">
                  <img
                    src={product.imagePath}
                    alt={product.name}
                    className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {product.discount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute top-2 right-2 px-2 py-1"
                    >
                      -{product.discount}%
                    </Badge>
                  )}
                </div>

                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl font-semibold line-clamp-1">
                      {product.name}
                    </CardTitle>
                    <Badge
                      variant={
                        product.rarityStatus.name === "Legendary"
                          ? "default"
                          : "secondary"
                      }
                      className="ml-2"
                    >
                      {product.rarityStatus.name}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col justify-between p-4 pt-0">
                  <div>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {product.description}
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold text-primary">
                        ${finalPrice.toFixed(2)}
                      </span>
                      {product.discount > 0 && (
                        <span className="text-sm text-gray-500 line-through">
                          ${product.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 w-full group-hover:bg-primary group-hover:text-white transition-colors"
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
