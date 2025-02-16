"use client";
import Link from "next/link";
import ProductCard from "./ProductCard";

export default function NewProductsSection() {
  return (
    <div className="my-10 md:my-16">
      <p className="text-2xl md:text-4xl font-semibold text-center mb-2 md:mb-4">
        Sản phẩm mới nhất
      </p>
      <p className="text-center text-gray-500 mb-6">
        Khám phá những sản phẩm mới được ra mắt cùng cộng đồng
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-10">
        {NEW_PRODUCTS.slice(0, 8).map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
      <Link href="/products" className="mx-auto px-10 w-fit underline block">
        Xem thêm
      </Link>
    </div>
  );
}

const NEW_PRODUCTS = [
  {
    id: 1,
    image: "/mock-images/image1.png",
    title: "Itar",
    price: 100,
  },
  {
    id: 2,
    image: "/mock-images/image2.png",
    title: "White Cap",
    price: 100,
  },
  {
    id: 3,
    image: "/mock-images/image3.png",
    title: "Jae Namaz",
    price: 100,
  },
  {
    id: 4,
    image: "/mock-images/image4.png",
    title: "Dates",
    price: 100,
  },
  {
    id: 5,
    image: "/mock-images/image5.png",
    title: "Miswak",
    price: 100,
  },
];
