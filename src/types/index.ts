export type TBaseResponse<T> = {
  result: T;
  isSuccess: boolean;
  message: string[];
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
