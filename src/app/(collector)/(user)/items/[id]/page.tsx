"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useGetProductById } from "@/hooks/api/useCollection";
import { formatPriceVND } from "@/lib/utils";
import { Product } from "@/types";
import { useParams } from "next/navigation";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

interface PriceData {
  date: string;
  price: number;
}

const generatePriceHistory = (basePrice: number): PriceData[] => {
  const data: PriceData[] = [];
  const today = new Date();

  for (let i = 0; i < 12; i++) {
    const date = new Date(today);
    date.setMonth(date.getMonth() - i);
    const variation = Math.random() * 200 - 100; // ±100 variation
    data.push({
      date: date.toLocaleString("default", { month: "short", year: "numeric" }),
      price: Math.max(0, basePrice + variation),
    });
  }
  return data.reverse();
};

export default function ProductDetail() {
  const { id } = useParams();
  const { data: data } = useGetProductById(id as string);

  const product = data?.result.product as Product;
  if (!data?.result.product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-6">
          <p className="text-center text-gray-500">Product not found</p>
        </Card>
      </div>
    );
  }

  const priceHistory = data.result.salesDataPoints;
  console.log("priceHistory", priceHistory);
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <Card className="shadow-lg border-none overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
          <div className="flex justify-between items-center">
            <CardTitle className="text-3xl font-bold">{product.name}</CardTitle>
            <Badge
              variant={
                product.rarityStatus.name === "Legendary"
                  ? "default"
                  : "secondary"
              }
              className="text-sm"
            >
              {product.rarityStatus.name}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="relative group">
              <img
                src={product.imagePath}
                alt={product.name}
                className="w-full h-[400px] object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4">
                {product.discount > 0 && (
                  <Badge variant="destructive" className="px-2 py-1">
                    -{product.discount}% OFF
                  </Badge>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-primary">
                    {formatPriceVND(product.price)}
                  </span>
                </div>

                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-semibold">Rarity:</span>{" "}
                    {product.rarityStatus.name} ({product.rarityStatus.dropRate}
                    )
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Status:</span>{" "}
                    <span
                      className={
                        product.productStatus.name === "Available"
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {product.productStatus.name}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <h3 className="text-xl font-semibold mb-6 text-gray-800">
             Giá trị biến động trong năm qua
            </h3>
            <ChartContainer
              className="h-[400px] bg-gray-50 rounded-lg p-4 w-full"
              config={{
                price: {
                  label: "Price",
                  color: "hsl(var(--primary))",
                },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={priceHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="date"
                    stroke="#6b7280"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#6b7280"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="unitPrice"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
