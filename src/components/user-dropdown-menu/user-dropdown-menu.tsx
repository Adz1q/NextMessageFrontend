import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";

import { signOut } from "next-auth/react";
import { LogOutIcon } from "lucide-react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Session } from "next-auth";

export default function UserDropdownMenu({ session }: {
    session: Session | null;
}) {
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton className={"flex gap-2.5 h-14 text-md text-foreground"}>
                            <Avatar>
                                <AvatarImage src={session?.user?.profilePictureUrl} alt="Profile Picture" className="w-25 h-25"/>
                            </Avatar>
                            {session?.user?.username}
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="top" className="bg-background w-[--radix-popper-anchor-width] p-0 border-none">
                        <DropdownMenuItem>
                            <div onClick={() => signOut()} className="flex gap-2 items-center p-2 text-foreground">
                                <LogOutIcon size={20}/>
                                 Sign Out
                            </div>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
