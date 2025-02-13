import { cn } from "@/lib/utils";
import { useState } from "react";

type GiftUnboxProps = {
  onOpen?: () => void;
};

export default function GiftUnbox({ onOpen }: GiftUnboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const handleClick = () => {
    setIsOpen(true);
    onOpen?.();
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {!isOpen && (
        <p className="text-lg font-semibold text-white">Chạm để mở túi mù</p>
      )}
      <div className="relative w-fit cursor-pointer" onClick={handleClick}>
        {/* Lid */}
        <div
          className={cn(
            "relative z-10",
            isOpen ? "animate-box-open" : "animate-wiggle"
          )}
        >
          <img src="/lid.png" alt="lid" className="w-[150px]" />
        </div>
        {/* Gift Box */}
        <div className="absolute left-1/2 -translate-x-1/2 w-[140px] z-1 top-[60px]">
          <img src="/box.png" alt="gift-box" className="w-[140px]" />
        </div>
      </div>
    </div>
  );
}
