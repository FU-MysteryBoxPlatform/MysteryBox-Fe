export type TBaseResponse<T> = {
  result: T;
  isSuccess: boolean;
  messages: string[];
};

export type TAccount = {
  id: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  gender: boolean;
  dob: string;
  isVerified: boolean;
  userName: string;
  email: string;
  avatar: string;
  isDeleted: boolean;
  isDelivering: boolean;
  storeCreditExpireDay: string;
  isManuallyCreated: boolean;
  roles: TRole[];
  mainRole: "COLLECTOR" | "MODERATOR";
  isBanned: boolean;
};

export type TRole = {
  id: string;
  name: string;
  normalizedName: string;
  concurrencyStamp: string;
};

export type SaleStatus = {
  id: number;
  name: string;
};

export type RarityStatus = {
  id: number;
  name: string;
  dropRate: string;
};

export type ProductStatus = {
  id: number;
  name: string;
};

export type Account = {
  firstName: string;
  lastName: string;
  dob: string | null;
  gender: boolean;
  address: string | null;
  verifyCode: string;
  isVerified: boolean;
  isDeleted: boolean;
  avatar: string | null;
  isManuallyCreated: boolean;
  refreshToken: string | null;
  refreshTokenExpiryTime: string;
  registeredDate: string;
  isBanned: boolean;
  mobileDeviceToken: string | null;
  webDeviceToken: string | null;
  id: string;
  userName: string;
  normalizedUserName: string;
  email: string;
  normalizedEmail: string;
  emailConfirmed: boolean;
  passwordHash: string | null;
  securityStamp: string;
  concurrencyStamp: string;
  phoneNumber: string;
  phoneNumberConfirmed: boolean;
  twoFactorEnabled: boolean;
  lockoutEnd: string | null;
  lockoutEnabled: boolean;
  accessFailedCount: number;
};

export type Product = {
  productId: string;
  name: string;
  description: string;
  price: number;
  discount: number;
  isDeleted: boolean;
  rarityStatusId: number;
  rarityStatus: RarityStatus;
  productStatusId: number;
  productStatus: ProductStatus;
  imagePath: string;
};

export type Inventory = {
  inventoryId: string;
  productId: string;
  product: Product;
  quantity: number;
  accountId: string;
  account: Account;
  accquiredDate: string;
  itemStatusId: number;
  itemStatus: string | null;
};

export type Sale = {
  saleId: string;
  inventoryId: string;
  inventory: Inventory;
  quantitySold: number;
  unitPrice: number;
  saleDate: string;
  saleStatusId: number;
  saleStatus: SaleStatus;
};

export type Collection = {
  collectionId: string;
  collecitonName: string;
  description: string;
  startTime: string;
  totalItem: number;
  isDeleted: boolean;
  isActived: boolean;
  rewards: string;
  imagePath: string;
  endTime: string;
  blindBoxPrice: number;
};

export type CollectionProduct = {
  collectionProductId: string;
  productId: string;
  product: Product;
  collectionId: string;
  collection: Collection;
};

export type SalesData = {
  sale: Sale;
  collectionProduct: CollectionProduct;
};

