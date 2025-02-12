import { Skeleton } from "@/components/ui/skeleton";

export default function Page() {
  return (
    <div>
      <div className="max-w-[1280px] mx-auto px-4 md:px-10 lg:px-16">
        <div className="flex gap-10 py-10 max-md:flex-col">
          <div className="md:min-w-[180px] lg:min-w-[250px]">
            <p className="text-xl font-semibold mb-6">Bộ lọc</p>
            <div>
              <div>
                <p className="text-base font-semibold">Danh mục</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mb-10 flex-1">
            {PRODUCTS.map((product) => (
              <div key={product.id} className="flex flex-col items-center">
                <Skeleton className="w-full h-[100px] mb-2" />
                <Skeleton className="w-1/2 mx-auto h-4" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const PRODUCTS = [
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
