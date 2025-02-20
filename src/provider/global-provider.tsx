"use client";
import { TAccount } from "@/types";
import { createContext, useEffect, useState } from "react";

type TProductInCart = {
  id: string;
  image: string;
  title: string;
  price: number;
  quantity: number;
  selected: boolean;
};

type GlobalContextType = {
  isFetchingUser: boolean;
  isFetchingCart: boolean;
  user: TAccount | null;
  setUser: (user: TAccount | null) => void;
  cart: TProductInCart[] | null;
  setCart: (cart: TProductInCart[]) => void;
  addToCart: (product: Omit<TProductInCart, "quantity" | "selected">) => void;
  removeFromCart: (id: string, quantity?: number) => void;
  toggleSelectProduct: (id: string) => void;
  toggleSelectAllProducts: () => void;
};

const initialGlobalContext: GlobalContextType = {
  isFetchingUser: true,
  isFetchingCart: true,
  user: null,
  setUser: () => null,
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
  const [user, setUser] = useState<TAccount | null>(null);
  const [isFetchingUser, setIsFetchingUser] = useState(true);
  const [isFetchingCart, setIsFetchingCart] = useState(true);

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

  const removeFromCart = (id: string, quantity?: number) => {
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

  const toggleSelectProduct = (id: string) => {
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
    setIsFetchingCart(false);

    // Lấy người dùng từ localStorage khi component được mount
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    setIsFetchingUser(false);
  }, []);

  useEffect(() => {
    // Lưu giỏ hàng vào localStorage mỗi khi nó thay đổi
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    // Lưu người dùng vào localStorage mỗi khi nó thay đổi
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  return (
    <GlobalContext.Provider
      value={{
        isFetchingUser,
        isFetchingCart,
        user,
        setUser,
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
