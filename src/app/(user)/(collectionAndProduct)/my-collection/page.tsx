"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  return (
    <div className="p-6 border border-gray-300 rounded-lg flex-1 max-md:w-full">
      <p className="text-lg md:text-xl font-bold mb-4 md:mb-6">
        Bộ sưu tập của tôi
      </p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {MOCK_COLLECTIONS.map((item) => {
          return (
            <div
              key={item.id}
              className="flex flex-col items-center gap-2 border border-gray-300 rounded-lg p-4 hover:bg-gray-100 cursor-pointer"
              onClick={() => router.push(`/my-collection/${item.id}`)}
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

const MOCK_COLLECTIONS = [
  {
    id: 1,
    thumbImg: "/mock-images/image1.png",
    name: "Attack on Titan",
  },
  {
    id: 2,
    thumbImg: "/mock-images/image2.png",
    name: "One punch man",
  },
  {
    id: 3,
    thumbImg: "/mock-images/image3.png",
    name: "Na Tra 2",
  },
];
