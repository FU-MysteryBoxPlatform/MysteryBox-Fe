import { TAccount } from "@/types";
import { useApiMutation, useApiQuery } from "./useApi";

type TCreateConversationRequest = {
  converstationName?: string;
  receiverId: string;
  message?: string;
  image?: string;
  senderId: string;
};

type TCreateChatMessage = {
  accountId: string;
  message: string;
  converstationId: string;
  image?: string;
};

export type TConverstation = {
  converstation: Converstation;
  converstationParticipants: ConversationParticipant[];
  latestChatMessage: LatestChatMessage;
};

export interface Converstation {
  conversationId: string;
  conversationName: string;
  isGroupChat: boolean;
  numberOfPeople: number;
  converstationStatusId: number;
  converstationStatus: ConverstationStatus;
  createDate: string;
  updateDate: string;
  createBy: string;
}

export interface ConverstationStatus {
  id: number;
  name: string;
}

export interface ConversationParticipant {
  account: TAccount;
}

export interface LatestChatMessage {
  chatMessageId: string;
  conversationParticipantId: string;
  messageTypeId: number;
  messageType: MessageType;
  content: string;
  image: string;
  status: number;
  chatMessageStatus: ChatMessageStatus;
  createDate: string;
  updateDate: string;
  createBy: string;
}
export interface ConverstationStatus3 {
  id: number;
  name: string;
}

export interface MessageType {
  id: number;
  name: string;
}

export interface ChatMessageStatus {
  id: number;
  name: string;
}

export interface ChatMessage {
  chatMessageId: string;
  conversationParticipantId: string;
  conversationParticipant: ConversationParticipant;
  messageType: {
    id: number;
    name: string;
  };
  content: string;
  image?: string;
  chatMessageStatus: {
    id: number;
    name: string;
  };
  createDate: string;
  updateDate: string;
  createBy: string;
}

export type TChatMessageResponse = {
  chatMessages: ChatMessage[];
  converstationParticipants: ConversationParticipant[];
};

export type TCreateReportRequest = {
  accountId: string;
  saleAccountId: string;
  reason: string;
};

export const useGetAllInboxByAccount = (
  accountId: string,
  pageNumber: number,
  pageSize: number
) => {
  return useApiQuery<{
    items: TConverstation[];
    totalPages: number;
  }>(
    `/chat/get-all-converstation-of-an-account/${accountId}?pageNumber=${pageNumber}&pageSize=${pageSize}`
  );
};

export const useGetAllChatMessageByConversationId = (
  converstationId: string,
  pageNumber: number,
  pageSize: number
) => {
  return useApiQuery<TChatMessageResponse>(
    `/chat/get-all-chat-of-a-converstation/${converstationId}?pageNumber=${pageNumber}&pageSize=${pageSize}`
  );
};

export const useGetChatByMessageId = (chatMessageId: string) => {
  return useApiQuery<unknown>(`/chat/get-chat-message-by-id/${chatMessageId}`);
};

export const useCreateConversation = () => {
  return useApiMutation<Converstation, TCreateConversationRequest>(
    "/chat/create-converstation",
    "post"
  );
};

export const useCreateChatMessage = () => {
  return useApiMutation<unknown, TCreateChatMessage>(
    "/chat/create-chat-message",
    "post"
  );
};

export const useCreateReport = () => {
  return useApiMutation<unknown, TCreateReportRequest>(
    "/report/create-report",
    "post"
  );
};
