"use client";

import LoadingIndicator from "@/app/components/LoadingIndicator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateConversation } from "@/hooks/api/useChatMessage";
import { useSaleDetail } from "@/hooks/api/useSale";
import { toast } from "@/hooks/use-toast";
import { formatPriceVND } from "@/lib/utils";
import { GlobalContext } from "@/provider/global-provider";
import dayjs from "dayjs";
import {
  Loader2,
  Mail,
  MessageCircle,
  Phone,
  ShoppingCart,
  StarIcon,
  Tag,
  User,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useContext } from "react";

const SaleDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const { user, addToCart } = useContext(GlobalContext);

  const { data: sale, isLoading } = useSaleDetail((params.id as string) || "");
  const { mutate: mutateCreateConversation, isPending } =
    useCreateConversation();

  const dataSale = sale?.result;

  const handleAddToCart = () => {
    addToCart({
      saleId: dataSale?.saleId || "",
      image: dataSale?.inventory?.product?.imagePath || "",
      title: dataSale?.inventory?.product?.name || "",
      price: dataSale?.totalAmount || 0,
    });
    toast({
      title: "Thêm vào giỏ hàng thành công!",
      description: "Sản phẩm đã được thêm vào giỏ hàng của bạn",
    });
  };

  const handleSendMessage = () => {
    mutateCreateConversation(
      {
        receiverId: dataSale?.inventory?.account?.id || "",
        senderId: user?.id || "",
        message: "Xin chào bạn",
      },
      {
        onSuccess: (data) => {
          if (data.isSuccess) {
            router.push(`/messages/${data.result?.conversationId}`);
          } else
            toast({
              title: data.messages[0],
            });
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center gap-3 bg-white p-6 rounded-xl shadow-lg">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="text-xl font-medium text-gray-700">
            Đang tải dữ liệu...
          </span>
        </div>
      </div>
    );
  }

  if (!sale?.result) {
    return (
      <div className="max-w-4xl mx-auto p-8 mt-12">
        <Alert className="border-2 border-yellow-300 shadow-md bg-yellow-50">
          <AlertTitle className="text-xl font-bold text-yellow-800">
            Không tìm thấy
          </AlertTitle>
          <AlertDescription className="text-base text-yellow-700 mt-2">
            Không thể tìm thấy sản phẩm này. Có thể sản phẩm đã bị xóa hoặc
            không tồn tại.
          </AlertDescription>
          <Button className="mt-4 bg-primary hover:bg-primary/90" asChild>
            <Link href="/collections">Xem các bộ sưu tập khác</Link>
          </Button>
        </Alert>
      </div>
    );
  }

  const discountedPrice = dataSale?.totalAmount || 0;

  return (
    <div className="max-w-6xl mx-auto p-6 min-h-screen">
      {/* Breadcrumb navigation */}
      <nav className="flex items-center text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-primary transition-colors">
          Trang chủ
        </Link>
        <span className="mx-2">/</span>
        <Link
          href="/collections"
          className="hover:text-primary transition-colors"
        >
          Bộ sưu tập
        </Link>
        <span className="mx-2">/</span>
        <span className="text-primary font-medium">
          {dataSale?.inventory?.product?.name}
        </span>
      </nav>

      <Card className="shadow-xl border-none bg-white rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 text-black p-8 border-b">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-3xl font-bold">
                {dataSale?.inventory?.product?.name}
              </CardTitle>
              <p className="text-gray-600 mt-2">
                Bộ sưu tập độc đáo từ VeriCollect
              </p>
            </div>
            <Badge
              variant="outline"
              className="text-primary border-primary px-4 py-1.5 text-sm font-medium rounded-full self-start"
            >
              {dataSale?.inventory?.product?.rarityStatus.name}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          <div className="grid md:grid-cols-2 gap-10">
            {/* Product Information */}
            <div className="space-y-8">
              <div className="aspect-square w-full relative rounded-2xl overflow-hidden shadow-lg border-4 border-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    dataSale?.inventory?.product?.imagePath ||
                    "/placeholder.svg"
                  }
                  alt={dataSale?.inventory?.product?.name}
                  className="object-cover w-full h-full transition-all duration-500 hover:scale-110"
                />
                <div className="absolute top-4 right-4">
                  <Badge className="bg-primary/90 hover:bg-primary text-white px-3 py-1.5 rounded-full">
                    <StarIcon className="w-4 h-4 mr-1" />
                    {dataSale?.inventory?.product?.rarityStatus?.dropRate}%
                    rarity
                  </Badge>
                </div>
              </div>

              <div className="space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-100">
                <h3 className="font-semibold text-xl text-gray-800 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-primary" />
                  Chi tiết sản phẩm
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {dataSale?.inventory?.product?.description ||
                    "Không có mô tả cho sản phẩm này."}
                </p>
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center flex-wrap gap-3">
                    <Badge
                      variant="outline"
                      className="text-primary border-primary"
                    >
                      {dataSale?.inventory?.product?.rarityStatus.name}
                    </Badge>
                    <span className="text-sm px-3 py-1 bg-gray-200 rounded-full text-gray-700">
                      Độ hiếm:{" "}
                      {dataSale?.inventory?.product?.rarityStatus?.dropRate}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sale Information */}
            <div className="space-y-8">
              <Card className="shadow-md border-gray-100">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl text-primary">
                    Thông tin giá
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                    <span className="text-gray-600">Giá gốc:</span>
                    <span className={`font-medium text-lg `}>
                      {formatPriceVND(discountedPrice)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                    <span className="text-gray-600">Giá cuối:</span>
                    <span className="font-bold text-2xl text-primary">
                      {formatPriceVND(discountedPrice)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Ngày đăng bán:</span>
                    <span className="font-medium text-gray-800">
                      {dayjs(dataSale?.saleDate).format("DD/MM/YYYY")}
                    </span>
                  </div>

                  <Button
                    size="lg"
                    className="bg-red-700 text-white w-full hover:bg-primary/90 mt-4 text-lg h-14 rounded-xl transition-all duration-300 shadow-md hover:shadow-xl"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Thêm vào giỏ hàng
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-md border-gray-100">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl text-primary flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Thông tin người bán
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center p-3 rounded-lg bg-gray-50">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-3 text-primary">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">
                        {`${dataSale?.inventory?.account?.firstName || ""} ${
                          dataSale?.inventory?.account?.lastName || ""
                        }`}
                      </div>
                      <div className="text-sm text-gray-500">
                        Nhà cung cấp sản phẩm
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center p-3 rounded-lg bg-gray-50">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-3 text-primary">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-800 break-all">
                        {dataSale?.inventory?.account?.email || "N/A"}
                      </div>
                      <div className="text-sm text-gray-500">Email liên hệ</div>
                    </div>
                  </div>

                  <div className="flex items-center p-3 rounded-lg bg-gray-50">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-3 text-primary">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">
                        {dataSale?.inventory?.account?.phoneNumber
                          ? `0${dataSale?.inventory?.account?.phoneNumber}`
                          : "N/A"}
                      </div>
                      <div className="text-sm text-gray-500">Số điện thoại</div>
                    </div>
                  </div>
                  {user?.id !== dataSale?.inventory?.account?.id && (
                    <div
                      className="flex items-center p-3 rounded-lg bg-gray-50 cursor-pointer"
                      onClick={handleSendMessage}
                    >
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-3 text-primary">
                        <MessageCircle className="w-6 h-6" />
                      </div>
                      <p>Nhắn tin</p>
                      {isPending && (
                        <div className="ml-auto">
                          <LoadingIndicator />
                        </div>
                      )}
                    </div>
                  )}
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
