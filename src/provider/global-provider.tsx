"use client";
import { createContext, useEffect, useState } from "react";

type TProductInCart = {
  id: number;
  image: string;
  title: string;
  price: number;
  quantity: number;
  selected: boolean;
};

type GlobalContextType = {
  cart: TProductInCart[] | null;
  setCart: (cart: TProductInCart[]) => void;
  addToCart: (product: Omit<TProductInCart, "quantity" | "selected">) => void;
  removeFromCart: (id: number, quantity?: number) => void;
  toggleSelectProduct: (id: number) => void;
  toggleSelectAllProducts: () => void;
};

const initialGlobalContext: GlobalContextType = {
  cart: null,
  setCart: () => null,
  addToCart: () => null,
  removeFromCart: () => null,
  toggleSelectProduct: () => null,
  toggleSelectAllProducts: () => null,
};

export const GlobalContext =
  createContext<GlobalContextType>(initialGlobalContext);

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<TProductInCart[]>([]);

  const addToCart = (
    product: Omit<TProductInCart, "quantity" | "selected">
  ) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === product.id);
      if (existingProduct) {
        // Nếu sản phẩm đã tồn tại, tăng số lượng
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Nếu sản phẩm chưa tồn tại, thêm mới với số lượng là 1
        return [...prevCart, { ...product, quantity: 1, selected: false }];
      }
    });
  };

  const removeFromCart = (id: number, quantity?: number) => {
    if (quantity) {
      const itemRemoved = cart.find((item) => item.id === id);
      if (itemRemoved?.quantity && itemRemoved?.quantity <= quantity) {
        setCart((prevCart) => {
          return prevCart.filter((item) => item.id !== id);
        });
        return;
      } else
        setCart((prevCart) => {
          return prevCart.map((item) =>
            item.id === id
              ? { ...item, quantity: item.quantity - quantity }
              : item
          );
        });
    } else {
      setCart((prevCart) => {
        return prevCart.filter((item) => item.id !== id);
      });
    }
  };

  const toggleSelectProduct = (id: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const toggleSelectAllProducts = () => {
    const allSelected = cart.every((item) => item.selected);
    setCart((prevCart) =>
      prevCart.map((item) => ({ ...item, selected: !allSelected }))
    );
  };

  useEffect(() => {
    // Lấy giỏ hàng từ localStorage khi component được mount
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    // Lưu giỏ hàng vào localStorage mỗi khi nó thay đổi
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  return (
    <GlobalContext.Provider
      value={{
        cart,
        setCart,
        addToCart,
        removeFromCart,
        toggleSelectProduct,
        toggleSelectAllProducts,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
