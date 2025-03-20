"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Star } from "lucide-react";
import { useContext, useState } from "react";
import LoadingIndicator from "@/app/components/LoadingIndicator";
import axiosClient from "@/axios-client";
import { GlobalContext } from "@/provider/global-provider";

export default function RatingForm({
  orderDetailId,
  onFinish,
}: {
  orderDetailId: string;
  onFinish: () => void;
}) {
  const { user } = useContext(GlobalContext);
  const [rating, setRating] = useState<number | null>(null);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!rating) {
      toast({
        title: "Vui lòng chọn số sao",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axiosClient.post("rating/create-rating", {
        accountId: user?.id,
        orderDetailId,
        point: rating,
        content: comment,
      });

      if (response.data.isSuccess) {
        toast({
          title: "Đã gửi đánh giá",
          description: "Cảm ơn đánh giá của bạn!",
        });
        setRating(null);
        setComment("");
        onFinish();
      } else {
        toast({
          title: response.data.messages[0],
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Đã xảy ra lỗi",
        description: "Vui lòng thử lại sau.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto shadow-md border-none">
      <form onSubmit={handleSubmit}>
        <CardHeader className="bg-gray-50 rounded-t-lg">
          <CardTitle className="text-xl font-semibold text-gray-800 text-center">
            Đánh giá đơn hàng
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Rating Stars */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Đánh giá sao
            </label>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="p-1 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-transform hover:scale-110"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(null)}
                  aria-label={`${star} sao`}
                >
                  <Star
                    className={`h-10 w-10 ${
                      (
                        hoveredRating !== null
                          ? star <= hoveredRating
                          : star <= (rating || 0)
                      )
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>
            {rating === null && (
              <p className="text-sm text-gray-500 text-center">
                Chọn số sao để đánh giá
              </p>
            )}
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <label
              htmlFor="comment"
              className="text-sm font-medium text-gray-700"
            >
              Nhận xét
            </label>
            <Textarea
              id="comment"
              placeholder="Viết nhận xét của bạn về đơn hàng..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[120px] border-gray-200 shadow-sm focus:ring-red-500 focus:border-red-500"
            />
          </div>
        </CardContent>
        <CardFooter className="p-6">
          <Button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded-md transition-colors disabled:bg-gray-400"
            disabled={isSubmitting || !rating}
          >
            {isSubmitting ? <LoadingIndicator /> : "Gửi đánh giá"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
