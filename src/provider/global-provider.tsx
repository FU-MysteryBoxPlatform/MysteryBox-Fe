"use client";
import { TAccount } from "@/types";
import cookie from "@/utils/cookie";
import { createContext, useEffect, useState } from "react";

type TProductInCart = {
  collectionId?: string;
  image: string;
  title: string;
  price: number;
  quantity: number;
  selected: boolean;
  saleId?: string;
};

type GlobalContextType = {
  isFetchingUser: boolean;
  isFetchingCart: boolean;
  user: TAccount | null;
  setUser: (user: TAccount | null) => void;
  cart: TProductInCart[] | null;
  setCart: (cart: TProductInCart[]) => void;
  addToCart: (product: Omit<TProductInCart, "quantity" | "selected">) => void;
  removeFromCart: (id: string) => void;
  toggleSelectProduct: (id: string) => void;
  toggleSelectAllProducts: () => void;
  removeFromCartBlindbox: (id: string) => void;
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
  removeFromCartBlindbox: () => null,
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
      if (product.saleId) {
        // Sale items always have quantity 1, avoid duplicates
        if (prevCart.some((item) => item.saleId === product.saleId)) {
          return prevCart;
        }
        return [...prevCart, { ...product, quantity: 1, selected: false }];
      }

      if (product.collectionId) {
        const existingProduct = prevCart.find(
          (item) => item.collectionId === product.collectionId
        );
        if (existingProduct) {
          return prevCart.map((item) =>
            item.collectionId === product.collectionId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
      }
      return [...prevCart, { ...product, quantity: 1, selected: false }];
    });
  };

  const removeFromCart = (id: string) => {
    debugger;
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.saleId === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCartBlindbox = (id: string) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.collectionId === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };
  const toggleSelectProduct = (id: string) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.collectionId === id || item.saleId === id
          ? { ...item, selected: !item.selected }
          : item
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
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    setIsFetchingCart(false);

    const savedUser = localStorage.getItem("user");
    const accessToken = cookie.get("ACCESS_TOKEN");

    if (!accessToken) {
      localStorage.removeItem("user");
    }
    if (savedUser && savedUser !== "null" && accessToken) {
      setUser(JSON.parse(savedUser));
    } else if (savedUser === "null" || !savedUser) {
      localStorage.removeItem("user");
      // remove access token
      cookie.delete("ACCESS_TOKEN");
      cookie.delete("REFRESH_TOKEN");
    }
    setIsFetchingUser(false);
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
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
        removeFromCartBlindbox,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
