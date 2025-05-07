"use client";

import { Session } from "next-auth";
import { useTheme } from "next-themes";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarTrigger } from "./sidebar";
import Link from "next/link";
import { Button } from "./button";
import { MessageCircle, Moon, Search, Settings, Sun, User } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu";
import ChatCard from "../chat-card/chat-card";
import UserDropdownMenu from "../user-dropdown-menu/user-dropdown-menu";
import { useFetchChats } from "@/hooks/useFetchChats";

export function AppSidebar({ session }: { 
    session: Session | null
}) {
    const { chats } = useFetchChats(session);
    const { setTheme } = useTheme();

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
                <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="flex justify-start text-md w-full">
                            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" /> Theme
                            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                            <span className="sr-only">Toggle theme</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setTheme("light")}>
                            Light
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme("dark")}>
                            Dark
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme("system")}>
                            System
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
            </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <div>
                {/* <div>
                    <Button><MessageCircle /></Button>
                    <Button><User /></Button>
                </div> */}
                <div className={"flex flex-col items-center gap-2"}>
                    {chats?.sort((a, b) => {
                        const dateOne = new Date(a.lastUpdated).getTime();
                        const dateTwo = new Date(b.lastUpdated).getTime();
                        
                        return dateTwo - dateOne;  
                    }).map((chat) => <ChatCard key={chat.id} chat={chat} />)}
                </div>
            </div> 
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
            <UserDropdownMenu session={session} />
        </SidebarFooter>
      </Sidebar>
    );
}
