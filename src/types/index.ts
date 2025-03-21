export type TBaseResponse<T> = {
  result: T;
  isSuccess: boolean;
  messages: string[];
};

export type BaseEntity = {
  createDate: string;
  updateDate: string;
  createBy: string | null;
  updateBy: string | null;
  createByAccount: Account | null;
  updateByAccount: Account | null;
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
  mainRole: "COLLECTOR" | "MODERATORS" | "ADMIN";
  isBanned: boolean;
  bankAccountNumber?: string;
  bankName?: string;
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
export type OrderStatus = {
  id: number;
  name: string;
};

export type Order = {
  orderId: string;
  orderDate: string;
  totalAmount: number;
  paymentMethodId: number;
  paymentMethod: string | null;
  statusId: number;
  orderStatus: OrderStatus;
  note: string;
  accountId: string;
  account: Account;
};

export type OrderDetail = {
  orderDetailId: string;
  inventoryId: string;
  inventory: Inventory | null;
  collectionId: string | null;
  collection: Collection | null;
  orderId: string;
  order: Order;
  quantity: number;
  unitPrice: number;
  note: string;
  orderDetailStatusId: number;
  isRated: boolean;
};
export type PaymentMethod = {
  id: number;
  name: string;
};

export type TransactionStatus = {
  id: number;
  name: string;
};

export type TransactionType = {
  id: number;
  name: string;
};

export type OrderType = {
  id: number;
  name: string;
};

export type PaymentHistory = {
  paymentHistoryId: string;
  amount: number;
  date: string;
  paidDate: string | null;
  paymentMethodId: number;
  paymentMethod: PaymentMethod;
  transactionStatusId: number;
  transationStatus: TransactionStatus; // Note: keeping the typo from original data
  transactionTypeId: number;
  transactionType: TransactionType;
  orderId: string;
  order: Order;
  accountId: string;
  account: TAccount;
  walletTransactionId: string | null;
  walletTransaction: unknown | null;
};
export type InventoryItem = {
  inventoryId: string;
  productId: string;
  product: Product;
  accountId: string;
  account: Account;
  collectionId: string | null;
  collection: Collection | null;
  accquiredDate: string;
  itemStatusId: number;
  itemStatus: unknown | null;
};

export type ExchangeRequest = BaseEntity & {
  exchangeRequestId: string;
  requestInventoryItemId: string;
  requestInventoryItem: InventoryItem;
  offeredInventoryItemId: string | null;
  offeredInventoryItem: InventoryItem | null;
  statusId: number;
  status: unknown | null;
  content: string | null;
};

export type OfferExchange = BaseEntity & {
  offerExchangeId: string;
  exchangeRequestId: string;
  exchangeRequest: ExchangeRequest;
  offeredInventoryItemId: string;
  offeredInventoryItem: InventoryItem;
  offerExchangeStatusId: number;
  offerExchangeStatus: unknown | null;
  content: string;
};

export type AuctionStatus = {
  id: number;
  name: string;
  dropRate?: string;
};
export type Auction = {
  auctionId: string;
  inventoryId: string;
  inventory: Inventory;
  accountId: string;
  account: Account;
  startTime: string;
  endTime: string;
  minimunBid: number;
  currentBid: number;
  statusId: number;
  auctionStatus: AuctionStatus;
};

export type AuctionParticipantRequestStatus = {
  id: number;
  name: string;
};

export type AuctionParticipantRequest = BaseEntity & {
  auctionParticipantRequestId: string;
  auctionId: string;
  auction: Auction;
  statusId: number;
  status: AuctionParticipantRequestStatus;
};

export type AuctionHistoryStatus = {
  id: number;
  name: string;
};

export type AuctionHistory = BaseEntity & {
  auctionHistoryId: string;
  auctionId: string;
  auction: Auction;
  accountId: string;
  account: null | Account;
  amount: number;
  statusId: number;
  auctionHistoryStatus: AuctionHistoryStatus | null;
};
export type TransferType = {
  id: number;
  name: string;
};
export type TransferItem = {
  transferItemHistoryId: string;
  transferDate: string;
  senderId: string;
  sender: Account;
  receiverId: string;
  receiver: Account;
  auctionHistoryId: string | null;
  auctionHistory: any | null; // Replace 'any' with specific type if auctionHistory structure is known
  exchangeRequestId: string | null;
  exchangeRequest: any | null; // Replace 'any' with specific type if exchangeRequest structure is known
  inventoryId: string;
  inventory: Inventory;
  transferTypeId: number;
  transferType: TransferType;
};
