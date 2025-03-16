"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ChatMessage,
  useCreateChatMessage,
  useGetAllChatMessageByConversationId,
} from "@/hooks/api/useChatMessage";
import { toast } from "@/hooks/use-toast";
import { GlobalContext } from "@/provider/global-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import * as signalR from "@microsoft/signalr"; // Import SignalR
import dayjs from "dayjs";
import { CircleAlert, Send } from "lucide-react";
import { useParams } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const ReportUserSchema = z.object({
  reason: z.string().min(1, "Vui lòng nhập lý do báo cáo"),
});

type ReportUserForm = z.infer<typeof ReportUserSchema>;

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>();
  const [newMessage, setNewMessage] = useState<string>("");
  const { user } = useContext(GlobalContext);
  const { id } = useParams();
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null
  );
  const [openReportModal, setOpenReportModal] = useState(false);

  const { handleSubmit, register, formState } = useForm<ReportUserForm>({
    resolver: zodResolver(ReportUserSchema),
  });

  const { data, refetch } = useGetAllChatMessageByConversationId(
    id as string,
    0,
    0
  );

  const { mutate: sendMessage } = useCreateChatMessage();

  const partner = data?.result.converstationParticipants.find(
    (item) => item.account.id !== user?.id
  )?.account;

  // Reference to the chat messages container
  const chatMessagesRef = useRef<HTMLDivElement>(null);

  const onsubmit = (data: ReportUserForm) => {
    console.log(data);
  };

  // Scroll to the bottom whenever messages change
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages]);
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

  const handleSendMessage = () => {
    if (!newMessage) {
      toast({
        title: "Tin nhắn không được để trống",
      });
      return;
    }

    sendMessage(
      {
        accountId: user?.id || "",
        converstationId: id as string,
        message: newMessage,
      },
      {
        onSuccess: () => {
          setNewMessage("");
          refetch();
        },
      }
    );
  };

  useEffect(() => {
    refetch();
  }, [refetch, id]);

  useEffect(() => {
    setMessages(data?.result.chatMessages || []);
  }, [data]);

  return (
    <div className="h-full flex flex-col">
      {/* Chat header */}
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={partner?.avatar} alt={partner?.userName} />
            <AvatarFallback>{partner?.userName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-medium">
              {partner?.firstName} {partner?.lastName}
            </h2>
            <p className="text-xs text-muted-foreground">Online</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            title="Report"
            type="button"
            onClick={() => setOpenReportModal(true)}
          >
            <CircleAlert className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Chat messages */}
      <div
        ref={chatMessagesRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth max-md:max-h-[65vh]"
      >
        {messages?.map((message) => {
          const isMe = message.conversationParticipant.account.id === user?.id;
          return (
            <div
              key={message.chatMessageId}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  isMe ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                <p>{message.content}</p>
                <p
                  className={`text-xs mt-1 ${
                    isMe
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground"
                  }`}
                >
                  {dayjs(message.createDate).format("HH:mm")}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Message input */}
      <div className="border-t p-4">
        <form className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault(); // Prevent the default form submission
                handleSendMessage();
              }
            }}
            placeholder="Nhập tin nhắn..."
            className="flex-1"
          />
          <Button type="button" size="icon" onClick={handleSendMessage}>
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>

      <Dialog open={openReportModal} onOpenChange={setOpenReportModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Báo cáo người dùng</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <form>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="reason">Lý do báo cáo</Label>
                <Textarea
                  id="reason"
                  placeholder="Nhập lý do báo cáo"
                  {...register("reason")}
                />
                {formState.errors.reason && (
                  <p className="text-red-500 text-sm">
                    {formState.errors.reason.message}
                  </p>
                )}
              </div>
            </form>
            <Button
              className="bg-[#E12E43] text-white hover:bg-[#B71C32] w-full"
              onClick={handleSubmit(onsubmit)}
            >
              Báo cáo
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
