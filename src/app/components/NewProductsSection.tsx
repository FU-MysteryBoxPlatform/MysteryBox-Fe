import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

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
          <div key={product.id} className="flex flex-col items-center">
            <Skeleton className="w-full h-[100px] mb-2" />
            <Skeleton className="w-1/2 mx-auto h-4" />
          </div>
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
  },
  {
    id: 2,
  },
  {
    id: 3,
  },
  {
    id: 4,
  },
  {
    id: 5,
  },
  {
    id: 6,
  },
  {
    id: 7,
  },
  {
    id: 8,
  },
];
