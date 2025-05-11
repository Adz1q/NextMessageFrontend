"use client";

import { Session } from "next-auth";
import { useTheme } from "next-themes";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarTrigger } from "./sidebar";
import Link from "next/link";
import { Button } from "./button";
import { MessageCircle, MessageCirclePlus, Moon, Search, Settings, Sun, User, UserPlus } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu";
import UserDropdownMenu from "../user-dropdown-menu/user-dropdown-menu";
import { useChangeSidebarList } from "@/hooks/useChangeSidebarList";
import ChatList from "../chat-list/chat-list";
import FriendList from "../friend-list/friend-list";
import FriendshipRequestList from "../friendship-request-list/friendship-request-list";

export function AppSidebar({ session }: { 
    session: Session | null
}) {
    const { setTheme } = useTheme();
    const { 
        isDisplayFriends, 
        isDisplayChats,
        isDisplayFriendshipRequests,
        handleChangeToChats, 
        handleChangeToFriends, 
        handleChangeToFriendshipRequests 
    } = useChangeSidebarList();

    if (!session?.user) {
        throw new Error("Invalid session!");
    } 

    return (
      <Sidebar>
        <SidebarHeader className="pb-2">
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
                <Link href="/dashboard/team-chat/create" className="w-full">
                    <Button variant="ghost" className="flex justify-start text-md w-full">
                        <MessageCirclePlus />
                        Create Team Chat
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
            <div className="flex items-center justify-center mt-1 gap-2">
                <Button className={isDisplayChats ? "bg-muted" : ""} onClick={handleChangeToChats} variant={"ghost"}><MessageCircle /></Button>
                <Button className={isDisplayFriends ? "bg-muted" : ""} onClick={handleChangeToFriends} variant={"ghost"}><User /></Button>
                <Button className={isDisplayFriendshipRequests ? "bg-muted" : ""} onClick={handleChangeToFriendshipRequests} variant={"ghost"}><UserPlus /></Button>
            </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <div>
                {isDisplayChats && <ChatList session={session} />}
                {isDisplayFriends && <FriendList userId={parseInt(session?.user?.id)} token={session?.user?.token} />}
                {isDisplayFriendshipRequests && <FriendshipRequestList userId={parseInt(session?.user?.id)} token={session?.user?.token}/>}
            </div> 
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
            <UserDropdownMenu session={session} />
        </SidebarFooter>
      </Sidebar>
    );
}
