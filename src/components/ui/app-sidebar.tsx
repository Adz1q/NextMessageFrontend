"use client";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { Search, Settings } from "lucide-react"
import Link from "next/link"
import { Button } from "./button"
import UserDropdownMenu from "../user-dropdown-menu/user-dropdown-menu"
import { useState } from "react"
import { Session } from "next-auth"
import { getChats } from "@/lib/api-requests"
import ChatCard from "../chat-card/chat-card";

type Chat = {
    id: number;
    name: string;
    lastUpdated: string;
    profilePictureUrl: string;
    type: string;
};

export function AppSidebar({ session }: { 
    session: Session | null
}) {
    const [chats, setChats] = useState<Chat[] | null>(null);

    useState(async () => {
        const response = await getChats(session?.user?.id as string, session?.user?.token as string);
        
        if (!response.success) {
            throw new Error(response.error);
        }

        setChats(response.data);
    });

    return (
      <Sidebar>
        <SidebarHeader className="pb-4">
            <div className="flex items-center justify-between gap-2 w-full">
                <SidebarTrigger/>
                <div className="text-muted-foreground text-md ml-auto mr-auto font-bold">NextMessage</div>
            </div>
            <div className="flex flex-col gap-2 pt-2 w-full">
                <Link href="/dashboard" className="w-full">
                    <Button variant="ghost" className="flex justify-start text-md w-full">
                        <Search />
                        Search    
                    </Button>
                </Link>
                <Link href="/dashboard/settings" className="w-full">
                    <Button variant="ghost" className="flex justify-start text-md w-full">
                        <Settings />
                        Settings
                    </Button>
                </Link>
            </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
                <div className={"flex flex-col items-center gap-2"}>
                    {chats?.map((chat) => <ChatCard key={chat.id} chat={chat} />)}
                </div>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
            <UserDropdownMenu session={session} />
        </SidebarFooter>
      </Sidebar>
    )
}
