"use client";;
import axiosClient from "@/axios-client";
import { SalesData } from "@/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

export default function OurProductsSection() {
  const [products, setProducts] = useState<SalesData[]>([]);

  const fetchProducts = async () => {
    try {
      const response = await axiosClient.get("sale/get-all-sale/1/10");
      console.log({ response });
      setProducts(response.data.result);
      console.log(products);
    } catch (error) {
      console.log({ error });
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);
  console.log(products);
  return (
    <div className="my-10 md:my-16">
      <p className="text-2xl md:text-4xl font-semibold text-center mb-2 md:mb-4">
      Bộ sưu tập của chúng tôi
      </p>
      <p className="text-center text-gray-500 mb-6">
        Khám phá những sản phẩm mới được ra mắt cùng cộng đồng
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-10">
        {/* {NEW_PRODUCTS.slice(0, 8).map((product) => (
          <div key={product.id} className="flex flex-col items-center">
            <Skeleton className="w-full h-[100px] mb-2" />
            <Skeleton className="w-1/2 mx-auto h-4" />
          </div>
        ))} */}
        {products.map((product) => (
          <ProductCard
            image={product.collectionProduct.product.imagePath}
            price={product.sale.unitPrice}
            key={product.sale.saleId}
            title={product.collectionProduct.product.name}
            id={product.sale.saleId}

          />
        ))}
      </div>
      <Link href="/products" className="mx-auto px-10 w-fit underline block">
        Xem thêm
      </Link>
    </div>
  );
}

