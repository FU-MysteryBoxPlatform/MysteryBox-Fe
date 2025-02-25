"use client";
import { AnimatePresence, motion } from "framer-motion";
import { Star, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import HoloImageCard from "../HoloCard";
import { useParams, useRouter } from "next/navigation";
import { useOpenBlindBox } from "@/hooks/api/useUnboxBlindBox";
import { TProductSale } from "@/hooks/api/useSale";
import { Button } from "@/components/ui/button";
import LoadingIndicator from "@/app/components/LoadingIndicator";

export default function Page() {
  const { id } = useParams();
  const router = useRouter();
  const [isFlipped, setIsFlipped] = useState(false);
  const [result, setResult] = useState<TProductSale | undefined>();

  const { mutate: mutateOpenBlindBox, isPending } = useOpenBlindBox(
    id as string
  );

  console.log({ id, result });

  const handleFlipCard = () => {
    if (isFlipped) return;
    setIsFlipped((isFlipped) => !isFlipped);
  };

  useEffect(() => {
    mutateOpenBlindBox(
      {},
      {
        onSuccess: (data) => {
          console.log({ data });
          setResult(data.result.product);
        },
      }
    );
  }, [mutateOpenBlindBox]);

  if (isPending)
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <LoadingIndicator />
      </div>
    );

  return (
    <div className="w-screen h-[calc(100vh-73px)] relative">
      <img
        src="/images/unbox-bg.webp"
        alt="bg"
        className="absolute top-0 left-0 w-full h-full object-cover z-[-1]"
      />
      {!isPending && !result ? (
        <div className="w-full h-full flex items-center justify-center flex-col">
          <p className="text-white text-center font-bold mb-6">
            Bạn đã mở túi mù này rồi!
          </p>
          <Button
            className="bg-[#E12E43] hover:bg-[#B71C32] mt-4"
            onClick={() => router.push("/my-product")}
          >
            Quay lại bộ sưu tập
          </Button>
        </div>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <AnimatePresence>
            <motion.div
              className="relative w-64 h-96 cursor-pointer"
              onClick={handleFlipCard}
              initial={{ scale: 0 }}
              animate={{
                scale: 1,
                rotateY: isFlipped ? 180 : 0,
                transition: {
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                },
              }}
              exit={{ scale: 0, opacity: 0 }}
              style={{
                perspective: 1000,
                transformStyle: "preserve-3d",
              }}
            >
              {/* Card Front */}
              <motion.div
                className="absolute w-full h-full rounded-xl shadow-xl overflow-hidden"
                style={{
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  zIndex: 2,
                  transform: "rotateY(0deg)",
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Holo Gradient Layer */}
                <div
                  className="absolute inset-0 rounded-xl overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(45deg, rgba(255, 0, 0, 0.5), rgba(0, 255, 0, 0.5), rgba(0, 0, 255, 0.5), rgba(255, 255, 0, 0.5), rgba(255, 0, 255, 0.5))",
                    animation: "holoEffect 5s infinite linear",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600">
                  <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-yellow-300 to-yellow-500 flex items-center justify-center">
                    <Trophy className="w-16 h-16 text-white" />
                  </div>
                  <div className="absolute bottom-0 left-0 w-full h-2/3 flex flex-col items-center justify-end p-6">
                    <Star className="w-20 h-20 text-yellow-300 mb-4" />
                    <p className="text-white text-2xl font-bold">Rare Player</p>
                    <p className="text-yellow-300 text-lg">Tap to reveal</p>
                  </div>
                </div>
              </motion.div>

              {/* Card Back */}
              <motion.div
                className="absolute w-full h-full rounded-xl shadow-xl"
                style={{
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  zIndex: 1,
                  transform: "rotateY(180deg)",
                  transformStyle: "preserve-3d",
                }}
              >
                <HoloImageCard img={result?.imagePath} />
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {isFlipped && (
            <div className="text-white text-center mt-6 animate-zoom-in">
              <p className="text-xl font-bold mb-2">Chúc mừng!</p>
              <p>
                Bạn đã nhận được{" "}
                <span className="text-[#E12E43] font-bold">{result?.name}</span>
              </p>
              <Button
                className="bg-[#E12E43] hover:bg-[#B71C32] mt-4"
                onClick={() => router.push("/my-product")}
              >
                Quay lại bộ sưu tập
              </Button>
            </div>
          )}
        </div>
      )}

      {isFlipped && <Confetti numberOfPieces={500} recycle={false} />}
    </div>
  );
}
