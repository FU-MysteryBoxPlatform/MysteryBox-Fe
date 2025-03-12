import { useApiMutation, useApiQuery } from "./useApi";

type TCreateConversationRequest = {
  isGroupChat: boolean;
  converstationName: string;
  listMemberIds: string[];
  accountId: string;
};

type TCreateChatMessage = {
  accountId: string;
  message: string;
  converstationId: string;
  image?: string;
};

export const useGetAllInboxByAccount = (
  accountId: string,
  pageNumber: number,
  pageSize: number
) => {
  return useApiQuery<unknown>(
    `/chat/get-all-converstation-of-an-account/${accountId}?pageNumber=${pageNumber}&pageSize=${pageSize}`
  );
};

export const useGetAllChatMessageByConversationId = (
  converstationId: string,
  pageNumber: number,
  pageSize: number
) => {
  return useApiQuery<unknown>(
    `/chat/get-all-chat-of-a-converstation/${converstationId}?pageNumber=${pageNumber}&pageSize=${pageSize}`
  );
};

export const useGetChatByMessageId = (chatMessageId: string) => {
  return useApiQuery<unknown>(`/chat/get-chat-message-by-id/${chatMessageId}`);
};

export const useCreateConversation = () => {
  return useApiMutation<unknown, TCreateConversationRequest>(
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
