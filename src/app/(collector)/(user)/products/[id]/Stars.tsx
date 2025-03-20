import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarsProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Stars({
  rating,
  maxRating = 5,
  size = "md",
  className,
}: StarsProps) {
  // Ensure rating is within bounds
  const safeRating = Math.max(0, Math.min(rating, maxRating));

  // Determine star size based on prop
  const starSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const starSize = starSizes[size];

  return (
    <div className={cn("flex items-center", className)}>
      {[...Array(maxRating)].map((_, index) => (
        <Star
          key={index}
          className={cn(
            starSize,
            "transition-colors",
            index < safeRating
              ? "text-yellow-400 fill-yellow-400"
              : "text-muted-foreground"
          )}
          aria-hidden="true"
        />
      ))}
      <span className="sr-only">
        {safeRating} out of {maxRating} stars
      </span>
    </div>
  );
}
