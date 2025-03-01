import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Page() {
  return (
    <div>
      <p className="text-xl md:text-2xl lg:text-3xl font-bold mb-6">
        Đăng ký và đấu thầu
      </p>
      <div>
        <Tabs defaultValue="register" className="w-full">
          <TabsList className="mb-6 grid grid-cols-2 w-full">
            <TabsTrigger
              value="register"
              className="flex items-center justify-center gap-2 data-[state=active]:bg-[#E12E43] data-[state=active]:text-primary-foreground"
            >
              <span>Đăng Ký</span>
            </TabsTrigger>
            <TabsTrigger
              value="bid"
              className="flex items-center justify-center gap-2 data-[state=active]:bg-[#E12E43] data-[state=active]:text-primary-foreground"
            >
              <span>Đấu Thầu</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}
