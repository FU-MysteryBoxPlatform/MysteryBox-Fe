"use client";;
import { AnimatePresence, motion } from "framer-motion";
import { Star, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import HoloImageCard from "./HoloCard";
import { useRouter, useSearchParams } from "next/navigation";
import {
  TOpenBlindBoxResponse,
  useGetCollectionDetail,
  useOpenBlindBox,
} from "@/hooks/api/useUnboxBlindBox";
import { Button } from "@/components/ui/button";
import LoadingIndicator from "@/app/components/LoadingIndicator";
import { formatPriceVND } from "@/lib/utils";
export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isFlipped, setIsFlipped] = useState(false);
  const [result, setResult] = useState<  TOpenBlindBoxResponse | undefined>();
  const collectionId = searchParams.get("collectionId") as string;
  const inventoryId = searchParams.get("inventoryId") as string;
  const { data: collectionData } =
    useGetCollectionDetail(collectionId);

  const { mutate: mutateOpenBlindBox, isPending } =
    useOpenBlindBox(inventoryId);

  const handleFlipCard = () => {
    if (isFlipped) return;
    setIsFlipped(true);
  };

  useEffect(() => {
   if(isFlipped){
    mutateOpenBlindBox(
      {
        inventoryId: inventoryId,
      },
      {
        onSuccess: (data) => {
          setResult(data.result );
        },
      }
    );
   }
  }, [isFlipped]);


  return (
    <div className="fixed inset-0 w-full h-full z-[-1] overflow-hidden">
      {/* Background */}
      <img
        src="/images/unbox-bg.webp"
        alt="bg"
        className="absolute top-0 left-0 bottom-0 right-0 w-full h-full object-cover z-[-1]"
      />

      <div className="w-full h-full flex flex-col lg:flex-row">
        <div className="w-full  flex items-center justify-center">
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
                {isPending ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <LoadingIndicator />
                  </div>
                ) : (
                  <HoloImageCard img={result?.product.imagePath} />
                )}
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {isFlipped && (
            <div className="text-white text-center mt-6 animate-zoom-in">
              <p className="text-xl font-bold mb-2">Chúc mừng!</p>
              <p>
                Bạn đã nhận được{" "}
                <span className="text-[#E12E43] font-bold">
                  {result?.product.name}
                </span>
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

        <div className="w-full flex flex-col items-center justify-center p-10">
          <h2 className="text-white text-2xl font-bold text-center mb-4">
            Những vật phẩm bạn có thể nhận được
          </h2>
          <div className="grid grid-cols-2  gap-4 text-white h-[650px] overflow-y-auto">
            {collectionData?.result.products.map((product) => (
              <div
                key={product.productId}
                className="flex items-center justify-center"
              >
                <div className="flex flex-col justify-center items-center space-y-2">
                  <img
                    src={product.imagePath}
                    alt={product.name}
                    loading="lazy"
                    className="rounded-lg  w-64 h-64 aspect-square object-cover"
                  />
                  <p className="text-sm font-semibold line-clamp-1">
                    {product.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatPriceVND(product.price)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isFlipped && <Confetti numberOfPieces={500} recycle={false} />}
    </div>
  );
}
