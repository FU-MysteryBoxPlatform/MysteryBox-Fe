"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, User, Calendar, DollarSign, Loader2 } from "lucide-react";
import axiosClient from "@/axios-client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { formatPriceVND } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface saleData {
  saleId: string;
  inventoryId: string;
  inventory: {
    inventoryId: string;
    product: {
      name: string;
      description: string;
      price: number;
      discount: number;
      rarityStatus: {
        name: string;
        dropRate: string;
      };
      productStatus: {
        name: string;
      };
      imagePath: string;
    };
    quantity: number;
    account: {
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber: string;
    };
  };
  quantitySold: number;
  unitPrice: number;
  saleDate: string;
  saleStatus: {
    name: string;
  };
}


const SaleDetailsPage = () => {
  const params = useParams();
  const [sale, setsale] = React.useState<saleData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchsaleData = async () => {
      try {
        setLoading(true);
        // Replace with your actual API endpoint
        const response = await axiosClient.get(
          `/sale/get-sale-by-id/${params.id}`
        );
        console.log(response);

        setsale(response.data.result[0]);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch sale details"
        );
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchsaleData();
    }
  }, [params.id]);


  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center gap-2 bg-white p-4 rounded-lg shadow-md">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="text-lg font-medium text-gray-700">Loading ...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4 mt-8">
        <Alert
          variant="destructive"
          className="border border-red-200 shadow-sm"
        >
          <AlertTitle className="text-lg font-semibold">Error</AlertTitle>
          <AlertDescription className="text-sm">{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!sale) {
    return (
      <div className="max-w-4xl mx-auto p-4 mt-8">
        <Alert className="border border-yellow-200 shadow-sm">
          <AlertTitle className="text-lg font-semibold">Not Found</AlertTitle>
          <AlertDescription className="text-sm">
            This sale could not be found.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 bg-gray-50 min-h-screen">
      <Card className="shadow-lg border-none bg-white rounded-xl overflow-hidden">
        <CardHeader className=" text-black p-6">
          <CardTitle className="text-3xl font-bold uppercase">
            Chi tiết bộ sưu tập: {sale?.inventory?.product?.name}
          </CardTitle>
          {/* <Badge
            variant={
              sale?.saleStatus?.name === "OutOfStock"
                ? "destructive"
                : "secondary"
            }
            className="text-sm mt-2"
          >
            {sale?.saleStatus.name}
          </Badge> */}
        </CardHeader>

        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Product Information */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold flex items-center gap-2 text-primary">
                <Package className="w-6 h-6" />
                Hình ảnh sản phẩm
              </h3>

              <div className="aspect-square w-full relative rounded-lg overflow-hidden shadow-md">
                <Image
                  src={
                    sale?.inventory?.product?.imagePath || "/placeholder.svg"
                  }
                  alt={sale?.inventory?.product?.name}
                  className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                />
              </div>

              <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-lg text-primary">
                  {sale?.inventory?.product?.name}
                </h4>
                <p className="text-sm text-gray-600">
                  {sale?.inventory?.product?.description}
                </p>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="text-primary border-primary"
                  >
                    {sale?.inventory.product.rarityStatus.name}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    Độ hiếm: {sale?.inventory?.product.rarityStatus?.dropRate}%
                  </span>
                </div>
              </div>
            </div>

            {/* Sale Information */}
            <div className="space-y-8">
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold flex items-center gap-2 mb-4 text-primary">
                  <DollarSign className="w-6 h-6" />
                  Thông tin sản phẩm
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">Giá gốc:</span>
                    <span className="font-medium text-lg">
                      {formatPriceVND(sale?.inventory?.product?.price)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">Giảm:</span>
                    <span className="font-medium text-green-600">
                      {Math.floor(
                        Number(sale?.inventory.product.discount) * 100
                      )}
                      %
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">Giá sau khi giảm:</span>
                    <span className="font-bold text-xl text-primary">
                      {formatPriceVND(sale?.unitPrice)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Số lượng đã bán:</span>
                    <span className="font-medium text-lg">
                      {sale?.quantitySold}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold flex items-center gap-2 mb-4 text-primary">
                  <User className="w-6 h-6" />
                  Người bán
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">
                      {`${sale?.inventory?.account?.firstName} ${sale?.inventory?.account?.lastName}`}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">
                      {sale?.inventory?.account?.email}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium">
                      0{sale?.inventory?.account?.phoneNumber}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold flex items-center gap-2 mb-4 text-primary">
                  <Calendar className="w-6 h-6" />
                  Ngày đăng sản phẩm
                </h3>
                <span className="font-medium text-lg">{sale?.saleDate}</span>
              </div>
            </div>
          </div>
        </CardContent>

        <div className="flex justify-center my-4 ">
          <Button size={"lg"} className="bg-[#E12E43] text-white">
            Mua ngay
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default SaleDetailsPage;
