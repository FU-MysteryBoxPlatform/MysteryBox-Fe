"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSaleDetail } from "@/hooks/api/useSale";
import { toast } from "@/hooks/use-toast";
import { formatPriceVND } from "@/lib/utils";
import { GlobalContext } from "@/provider/global-provider";
import dayjs from "dayjs";
import { Loader2, Package, SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useContext } from "react";

const SaleDetailsPage = () => {
  const params = useParams();
  const { addToCart } = useContext(GlobalContext);

  const { data: sale, isLoading } = useSaleDetail((params.id as string) || "");

  const dataSale = sale?.result[0];

  const handleAddToCart = () => {
    addToCart({
      id: dataSale?.saleId || "",
      image: dataSale?.inventory?.product?.imagePath || "",
      title: dataSale?.inventory?.product?.name || "",
      price: dataSale?.unitPrice || 0,
    });
    toast({
      title: "Thêm vào giỏ hàng thành công!",
    });
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center gap-2 bg-white p-4 rounded-lg shadow-md">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="text-lg font-medium text-gray-700">Loading ...</span>
        </div>
      </div>
    );
  }

  if (!sale?.result) {
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
            Chi tiết bộ sưu tập: {dataSale?.inventory?.product?.name}
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
                <img
                  src={
                    dataSale?.inventory?.product?.imagePath ||
                    "/placeholder.svg"
                  }
                  alt={dataSale?.inventory?.product?.name}
                  className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                />
              </div>

              <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-lg text-primary">
                  {dataSale?.inventory?.product?.name}
                </h4>
                <p className="text-sm text-gray-600">
                  {dataSale?.inventory?.product?.description}
                </p>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="text-primary border-primary"
                  >
                    {dataSale?.inventory?.product?.rarityStatus.name}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    Độ hiếm:{" "}
                    {dataSale?.inventory?.product?.rarityStatus?.dropRate}%
                  </span>
                </div>
              </div>
            </div>

            {/* Sale Information */}
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Thông tin sản phẩm</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Giá gốc:</span>
                    <span className="font-medium text-lg">
                      {formatPriceVND(dataSale?.inventory?.product?.price || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Giảm:</span>
                    <span className="font-medium text-green-600">
                      {Math.floor(
                        Number(dataSale?.inventory?.product?.discount) * 100
                      )}
                      %
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Giá sau khi giảm:</span>
                    <span className="font-bold text-xl text-primary">
                      {formatPriceVND(dataSale?.unitPrice || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Số lượng đã bán:</span>
                    <span className="font-medium text-lg">
                      {dataSale?.quantitySold}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Ngày đăng sản phẩm:</span>
                    <span className="font-medium text-lg">
                      {dayjs(dataSale?.saleDate).format("DD/MM/YYYY")}
                    </span>
                  </div>
                  <Button
                    className="bg-[#E12E43] text-white w-full hover:bg-[#B71C32]"
                    onClick={handleAddToCart}
                  >
                    Thêm vào giỏ hàng
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <p>Thông tin người bán</p>
                    <Link href={`/profile`}>
                      <SquareArrowOutUpRight className="w-4 h-4" />
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tên người bán:</span>
                    <span className="font-medium font-semibold">
                      {`${dataSale?.inventory?.account?.firstName} ${dataSale?.inventory?.account?.lastName}`}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium font-semibold">
                      {dataSale?.inventory?.account?.email}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium font-semibold">
                      0{dataSale?.inventory?.account?.phoneNumber}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SaleDetailsPage;
