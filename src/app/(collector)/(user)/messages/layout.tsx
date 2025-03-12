"use client";
import { Input } from "@/components/ui/input";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { useGetAllInboxByAccount } from "@/hooks/api/useChatMessage";
import { GlobalContext } from "@/provider/global-provider";
import { Search } from "lucide-react";
import { useContext, useEffect } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useContext(GlobalContext);
  const { data, refetch } = useGetAllInboxByAccount(user?.id || "", 1, 100);

  console.log({ user });

  useEffect(() => {
    refetch();
  }, [user?.id]);

  return (
    <div className="flex h-[calc(100vh-74px)] bg-background [&>div]:min-h-full">
      <SidebarProvider>
        <Sidebar className="border-r max-md:hidden" collapsible="none">
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
                  {/* {inboxData.map((contact) => (
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
                  ))} */}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        {children}
      </SidebarProvider>
    </div>
  );
}
