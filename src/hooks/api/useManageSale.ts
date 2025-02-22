import { useApiMutation } from "./useApi";

export interface SaleResponse {
  sale: Sale;
  collectionProduct: CollectionProduct;
}

export interface Sale {
  saleId: string;
  inventoryId: string;
  inventory: Inventory;
  quantitySold: number;
  unitPrice: number;
  saleDate: string;
  saleStatusId: number;
  saleStatus: SaleStatus;
}

export interface Inventory {
  inventoryId: string;
  productId: string;
  product: Product;
  quantity: number;
  accountId: string;
  account: Account;
  accquiredDate: string;
  itemStatusId: number;
  itemStatus: string;
}

export interface Product {
  productId: string;
  name: string;
  description: string;
  price: number;
  isDeleted: boolean;
  rarityStatusId: number;
  rarityStatus: RarityStatus;
  productStatusId: number;
  productStatus: ProductStatus;
  imagePath: string;
}

export interface RarityStatus {
  id: number;
  name: string;
  dropRate: string;
}

export interface ProductStatus {
  id: number;
  name: string;
}

export interface Account {
  firstName: string;
  lastName: string;
  dob: string;
  gender: boolean;
  address: string;
  verifyCode: string;
  isVerified: boolean;
  isDeleted: boolean;
  avatar: string;
  isManuallyCreated: boolean;
  refreshToken: string;
  refreshTokenExpiryTime: string;
  registeredDate: string;
  isBanned: boolean;
  id: string;
  userName: string;
  normalizedUserName: string;
  email: string;
  normalizedEmail: string;
  emailConfirmed: boolean;
  passwordHash: string;
  securityStamp: string;
  concurrencyStamp: string;
  phoneNumber: string;
  phoneNumberConfirmed: boolean;
  twoFactorEnabled: boolean;
  lockoutEnd: boolean;
  lockoutEnabled: boolean;
  accessFailedCount: number;
}

export interface SaleStatus {
  id: number;
  name: string;
}

export interface CollectionProduct {
  collectionProductId: string;
  productId: string;
  product: Product2;
  collectionId: string;
  collection: Collection;
}

export interface Product2 {
  productId: string;
  name: string;
  description: string;
  price: number;
  isDeleted: boolean;
  rarityStatusId: number;
  rarityStatus: RarityStatus2;
  productStatusId: number;
  productStatus: ProductStatus2;
  imagePath: string;
}

export interface RarityStatus2 {
  id: number;
  name: string;
  dropRate: string;
}

export interface ProductStatus2 {
  id: number;
  name: string;
}

export interface Collection {
  collectionId: string;
  collectionName: string;
  description: string;
  startTime: string;
  totalItem: number;
  isDeleted: boolean;
  isActived: boolean;
  rewards: string;
  imagePath: string;
  endTime: string;
  blindBoxPrice: number;
  discountBlindBoxPrice: number;
}

export type TManageSaleRequest = {
  keyword?: string;
  pageNumber: number;
  pageSize: number;
  saleStatus?: number;
  minimumPrice?: number;
  maximumPrice?: number;
  startTime?: string;
  endTime?: string;
};

export const useManageSale = () => {
  return useApiMutation<Sale[], TManageSaleRequest>(
    `sale/get-sale-by-filter`,
    "post"
  );
};
