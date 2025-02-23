import { Button } from "@/components/ui/button";
import NewProductsSection from "./components/NewProductsSection";
import OurProductsSection from "./components/OurProductsSection";

export default function Home() {
  return (
    <div>
      <div className="relative py-[136px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/background.png"
          alt="background"
          className="w-full absolute top-0 h-full object-cover"
        />
        <div className="relative z-10 w-fit max-w-[640px] py-[60px] px-10 bg-black/80 rounded-md mx-auto lg:ml-auto lg:mr-16">
          <p className="text-[#EFE8CE] font-semibold mb-2">Sắp diễn ra</p>
          <p className="text-[#EFE8CE] font-bold text-2xl md:text-3xl lg:text-5xl lg:leading-[65px] mb-2">
            Khám phá <br />
            Bộ sưu tập mới <br /> của chúng tôi
          </p>
          <p className="text-[#EFE8CE] mb-6">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit
            tellus, luctus nec ullamcorper mattis.
          </p>

          <Button className="bg-[#E12E43] hover:bg-[#B71C32] px-10 py-6 text-lg">
            Mua ngay
          </Button>
        </div>
      </div>
      <div className="max-w-[1280px] mx-auto px-4 md:px-10 lg:px-16">
        {/* <NewProductsSection /> */}
        <OurProductsSection />
      </div>
    </div>
  );
}
