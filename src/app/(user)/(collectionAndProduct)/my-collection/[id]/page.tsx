"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useParams } from "next/navigation";

export default function Page() {
  const { id } = useParams();
  console.log({ id });

  return (
    <div className="flex-1">
      <p className="text-lg md:text-xl font-bold mb-4 md:mb-6">
        Bộ sưu tập <span className="text-[#E12E43]">Attack on Titan</span>
      </p>
      <p className="font-semibold mb-4">
        Bạn đã sưu tập được{" "}
        <span className="text-[#E12E43]">
          3/{PRODUCTS_IN_COLLECTION.length}
        </span>{" "}
        vật phẩm trong bộ sưu tập này
      </p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 w-full">
        {PRODUCTS_IN_COLLECTION.map((item) => {
          return (
            <div
              key={item.id}
              className={cn(
                "relative flex flex-col items-center gap-2 border rounded-lg p-4 cursor-pointer",
                !item.isOwned
                  ? "opacity-50 border-red-300"
                  : "border-green-400 hover:bg-green-100"
              )}
            >
              <Image
                src={item.thumbImg}
                alt="thumb"
                className="w-full h-40 object-cover rounded-lg"
              />
              <p className="text-sm font-semibold">{item.name}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const PRODUCTS_IN_COLLECTION = [
  {
    id: 1,
    thumbImg: "/mock-images/image1.png",
    name: "Levi Ackerman",
    isOwned: true,
  },
  {
    id: 2,
    thumbImg: "/mock-images/image2.png",
    name: "Eren Yeager",
    isOwned: false,
  },
  {
    id: 3,
    thumbImg: "/mock-images/image3.png",
    name: "Mikasa Ackerman",
    isOwned: true,
  },
  {
    id: 4,
    thumbImg: "/mock-images/image4.png",
    name: "Reiner",
    isOwned: false,
  },
  {
    id: 5,
    thumbImg: "/mock-images/image5.png",
    name: "Cony",
    isOwned: false,
  },
  {
    id: 6,
    thumbImg: "/mock-images/image1.png",
    name: "Annie",
    isOwned: true,
  },
];
