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

    setIsSubmitting(true);

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
    } else {
      toast({
        title: response.data.messages[0],
      });
    }

    // Reset form
    setRating(null);
    setComment("");
    onFinish();
    setIsSubmitting(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Đánh giá đơn hàng</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(null)}
                  aria-label={`${star} star${star !== 1 ? "s" : ""}`}
                >
                  <Star
                    className={`h-8 w-8 ${
                      (
                        hoveredRating !== null
                          ? star <= hoveredRating
                          : star <= (rating || 0)
                      )
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-muted-foreground"
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="comment" className="text-sm font-medium">
              Đánh giá
            </label>
            <Textarea
              id="comment"
              placeholder="Viết đánh giá đơn hàng..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[120px]"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? <LoadingIndicator /> : "Gửi đánh giá"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
