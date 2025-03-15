"use client";
import LoadingIndicator from "@/app/components/LoadingIndicator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import {
  TConverstation,
  useGetAllInboxByAccount,
} from "@/hooks/api/useChatMessage";
import { GlobalContext } from "@/provider/global-provider";
import dayjs from "dayjs";
import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr"; // Import SignalR
import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useContext(GlobalContext);
  const [conversations, setConversations] = useState<TConverstation[]>([]);
  const router = useRouter();
  const { id } = useParams();
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null
  );

  const { data, refetch, isLoading } = useGetAllInboxByAccount(
    user?.id || "",
    0,
    0
  );

  useEffect(() => {
    refetch();
  }, [refetch]);
  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${process.env.NEXT_PUBLIC_DOMAIN}/notifications`)
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);

    return () => {
      if (connection) {
        connection.stop();
      }
    };
  }, []);

  useEffect(() => {
    let retryCount = 0;
    const MAX_RETRIES = 5;
    const RETRY_DELAY = 3000; // 3 seconds

    const startConnection = async () => {
      if (connection) {
        try {
          await connection.start();
          connection.on("LOAD_NEW_CONVERSATION", async () => {
            await refetch(); // Fetch new bids when a new bid is placed
          });
        } catch (error) {
          console.log("SignalR connection failed. Retrying...", error);
          if (retryCount < MAX_RETRIES) {
            retryCount++;
            setTimeout(startConnection, RETRY_DELAY); // Retry connection
          } else {
            console.log("Max retries reached. Could not connect to SignalR.");
          }
        }
      }
    };
    startConnection();
  }, [connection]); // Ensure connection starts once it's set

  useEffect(() => {
    setConversations(data?.result.items || []);
  }, [data]);

  useEffect(() => {
    if (!isLoading && conversations.length > 0)
      router.push(`/messages/${conversations[0].converstation.conversationId}`);
  }, [conversations, isLoading, router]);

  console.log({ conversations });

  if (isLoading)
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <LoadingIndicator />
      </div>
    );

  return (
    <div className="flex h-[calc(100vh-74px)] bg-background [&>div]:min-h-full">
      <SidebarProvider>
        <Sidebar className="border-r max-md:hidden" collapsible="none">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Tin nhắn</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {conversations.length > 0 ? (
                    conversations.map((c) => {
                      const partner = c.converstationParticipants.find(
                        (item) => item.account.id !== user?.id
                      )?.account;
                      return (
                        <SidebarMenuItem key={c.converstation.conversationId}>
                          <SidebarMenuButton
                            isActive={c.converstation.conversationId === id}
                            onClick={() =>
                              router.push(
                                `/messages/${c.converstation.conversationId}`
                              )
                            }
                            className="flex items-center gap-3 h-16"
                          >
                            <div className="relative">
                              <Avatar>
                                <AvatarImage
                                  src={partner?.avatar}
                                  alt={partner?.userName}
                                />
                                <AvatarFallback>
                                  {partner?.userName.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                            </div>
                            <div className="flex flex-col flex-1 overflow-hidden">
                              <div className="flex justify-between">
                                <span className="font-semibold">
                                  {partner?.firstName} {partner?.lastName}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {dayjs(c.latestChatMessage.createDate).format(
                                    "DD/MM/YYYY"
                                  )}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground truncate">
                                {c.latestChatMessage.content}
                              </p>
                            </div>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })
                  ) : (
                    <div className="flex flex-col items-center justify-center mt-10 gap-4">
                      <img
                        src="/empty-inbox.png"
                        alt="empty inbox"
                        className="bject-cover w-20"
                      />
                      <p>Bạn chưa có tin nhắn nào</p>
                    </div>
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        {!isLoading && conversations.length === 0 ? (
          <div className="w-full h-ơ90vh flex items-center justify-center flex-col">
            <p className="text-center">Bạn chưa có tin nhắn</p>
            <Link href="/" className="underline block text-center">
              Về trang chủ
            </Link>
          </div>
        ) : (
          <div className="w-full">{children}</div>
        )}
      </SidebarProvider>
    </div>
  );
}
