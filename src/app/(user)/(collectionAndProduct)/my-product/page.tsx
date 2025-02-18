import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

export default function Page() {
  return (
    <div className="p-6 border border-gray-300 rounded-lg flex-1 max-md:w-full">
      <Button className="flex items-center gap-2">
        Tạo sản phẩm <PlusIcon />
      </Button>
    </div>
  );
}
