"use client";
import InventoryCard from "@/app/components/InventoryCard";

export default function Page() {
  return (
    <div className="p-6 border border-gray-300 rounded-lg flex-1 max-md:w-full">
      <p className="text-lg md:text-xl font-bold mb-4 md:mb-6">
        Kho vật phẩm của tôi
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-10">
        {MOCK_PRODUCTS.map((product) => (
          <InventoryCard
            key={product.id}
            {...product}
            isPersonal
            showPrice={false}
          />
        ))}
      </div>
    </div>
  );
}

const MOCK_PRODUCTS = [
  {
    id: "1",
    image: "/mock-images/image1.png",
    title: "Itar",
    price: 100,
  },
  {
    id: "2",
    image: "/mock-images/image2.png",
    title: "White Cap",
    price: 100,
  },
  {
    id: "3",
    image: "/mock-images/image3.png",
    title: "Jae Namaz",
    price: 100,
  },
  {
    id: "4",
    image: "/mock-images/image4.png",
    title: "Dates",
    price: 100,
  },
  {
    id: "5",
    image: "/mock-images/image5.png",
    title: "Miswak",
    price: 100,
  },
];
