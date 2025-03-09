"use client";

import type React from "react";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Send, Phone, Video, MoreVertical } from "lucide-react";

// Sample data for inbox messages
const inboxData = [
  {
    id: 1,
    name: "John Doe",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Hey, how are you doing?",
    time: "10:30 AM",
    unread: 2,
  },
  {
    id: 2,
    name: "Jane Smith",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Can we meet tomorrow?",
    time: "Yesterday",
    unread: 0,
  },
  {
    id: 3,
    name: "Mike Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "I've sent you the files",
    time: "Yesterday",
    unread: 0,
  },
  {
    id: 4,
    name: "Sarah Williams",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Thanks for your help!",
    time: "Monday",
    unread: 0,
  },
  {
    id: 5,
    name: "David Brown",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Let's discuss the project",
    time: "Sunday",
    unread: 3,
  },
];

// Sample chat messages for a conversation
const sampleMessages = [
  {
    id: 1,
    sender: 1, // John Doe
    content: "Hey, how are you doing?",
    timestamp: "10:30 AM",
  },
  {
    id: 2,
    sender: "me",
    content: "I'm good, thanks! How about you?",
    timestamp: "10:32 AM",
  },
  {
    id: 3,
    sender: 1,
    content: "Doing well. Did you get a chance to look at the proposal I sent?",
    timestamp: "10:33 AM",
  },
  {
    id: 4,
    sender: "me",
    content: "Yes, I did. It looks great! I have a few questions though.",
    timestamp: "10:35 AM",
  },
  {
    id: 5,
    sender: 1,
    content: "Sure, what questions do you have?",
    timestamp: "10:36 AM",
  },
];

export default function ChatPage() {
  const [selectedContact, setSelectedContact] = useState(inboxData[0]);
  const [messages, setMessages] = useState(sampleMessages);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(false);

  // Reference to the chat messages container
  const chatMessagesRef = useRef<HTMLDivElement>(null);

  // Scroll to the bottom whenever messages change
  useEffect(() => {
    if (chatMessagesRef.current && shouldScrollToBottom) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages, shouldScrollToBottom]);

  // Function to load older messages
  const loadMoreMessages = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);

    // Simulate an API call to fetch older messages
    setTimeout(() => {
      // TODO: Load more messages from API, remove this setTimeout
      const olderMessages = [
        {
          id: messages.length + 1,
          sender: 1,
          content: "This is an older message.",
          timestamp: "10:29 AM",
        },
        {
          id: messages.length + 2,
          sender: "me",
          content: "Yes, I remember this.",
          timestamp: "10:28 AM",
        },
      ];

      // Preserve the current scroll position
      if (chatMessagesRef.current) {
        const { scrollTop } = chatMessagesRef.current;
        const isNearTop = scrollTop < 100;
        setShouldScrollToBottom(false);

        if (isNearTop) {
          setMessages((prevMessages) => [...olderMessages, ...prevMessages]);
        }
      }

      setIsLoading(false);

      // Stop loading if there are no more messages
      if (olderMessages.length === 0) {
        setHasMore(false);
      }
    }, 1000); // Simulate a 1-second delay
  }, [isLoading, hasMore, messages.length]);

  // Add a scroll event listener to detect when the user is near the top
  useEffect(() => {
    const chatContainer = chatMessagesRef.current;
    if (!chatContainer) return;

    const handleScroll = () => {
      const { scrollTop } = chatContainer;
      if (scrollTop < 100 && !isLoading && hasMore) {
        loadMoreMessages();
      }
    };

    chatContainer.addEventListener("scroll", handleScroll);
    return () => chatContainer.removeEventListener("scroll", handleScroll);
  }, [isLoading, hasMore, loadMoreMessages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    const newMsg = {
      id: messages.length + 1,
      sender: "me",
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setShouldScrollToBottom(true);

    setMessages([...messages, newMsg]);
    setNewMessage("");
  };

  return (
    <div className="flex h-[calc(100vh-74px)] bg-background [&>div]:min-h-full">
      <SidebarProvider>
        <Sidebar className="border-r" collapsible="none">
          <SidebarHeader>
            <div className="p-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search messages..."
                  className="pl-8"
                />
              </div>
            </div>
          </SidebarHeader>
          <SidebarSeparator />
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Messages</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {inboxData.map((contact) => (
                    <SidebarMenuItem key={contact.id}>
                      <SidebarMenuButton
                        isActive={selectedContact.id === contact.id}
                        onClick={() => setSelectedContact(contact)}
                        className="flex items-center gap-3 h-16"
                      >
                        <div className="relative">
                          <Avatar>
                            <AvatarImage
                              src={contact.avatar}
                              alt={contact.name}
                            />
                            <AvatarFallback>
                              {contact.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          {contact.unread > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                              {contact.unread}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col flex-1 overflow-hidden">
                          <div className="flex justify-between">
                            <span className="font-medium">{contact.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {contact.time}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {contact.lastMessage}
                          </p>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <div className="flex flex-col flex-1">
          {/* Chat header */}
          <div className="flex items-center justify-between border-b p-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage
                  src={selectedContact.avatar}
                  alt={selectedContact.name}
                />
                <AvatarFallback>
                  {selectedContact.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-medium">{selectedContact.name}</h2>
                <p className="text-xs text-muted-foreground">Online</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" title="Voice call">
                <Phone className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" title="Video call">
                <Video className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" title="More options">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Chat messages */}
          <div
            ref={chatMessagesRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
          >
            {isLoading && (
              <p className="text-center">Loading older messages...</p>
            )}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "me" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.sender === "me"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p>{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === "me"
                        ? "text-primary-foreground/70"
                        : "text-muted-foreground"
                    }`}
                  >
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Message input */}
          <div className="border-t p-4">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1"
              />
              <Button type="submit" size="icon">
                <Send className="h-5 w-5" />
              </Button>
            </form>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}
