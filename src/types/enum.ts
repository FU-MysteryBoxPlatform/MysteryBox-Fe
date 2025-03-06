export enum ExchangeStatus {
  PENDING = 0, // Request submitted, awaiting review
  REJECTED = 1, // Exchange request rejected
  COMPLETED = 2, // Exchange successfully completed
  CANCELLED = 3, // Exchange request cancelled
}
