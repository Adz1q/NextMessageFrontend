"use client";

import { useTeamChatMembers } from "@/hooks/useTeamChatMembers";
import { ScrollArea } from "../ui/scroll-area";
import ChatMember from "../chat-member/chat-member";
import { useFetchFriendshipRequests } from "@/hooks/useFetchFriendshipRequests";
import { Users } from "lucide-react";

type TeamChat = {
    id: number;
    lastUpdated: string;
    name: string,
    profilePictureUrl: string,
    adminId: number;
};

export default function ChatMembers({ 
    chat,
    userId,
    token
}: {
    chat: TeamChat,
    userId: number,
    token: string  
}) {
    const { members } = useTeamChatMembers(chat.id, userId, token);
    const { friendshipRequests } = useFetchFriendshipRequests(userId, token);

    return (
        <div className="flex flex-col">
            <div className="w-full rounded-md p-3  pt-5 text-2xl flex items-center justify-center gap-2"><Users /> Chat Members</div>
            {members.length <= 0 && 
                <p className="text-sm text-muted-foreground py-3 text-center">
                    Your chat has currently no members.
                </p>
            }
            {members.length > 0 && (
                <ScrollArea className="h-[40rem] w-full rounded-md rounded-t-none p-3 flex flex-col gap-8">
                    <div className="space-y-3">
                        {members.map((member, index) => (
                            <ChatMember key={index} chatId={chat?.id} member={member} adminId={chat?.adminId} userId={userId} token={token} friendshipRequests={friendshipRequests}/>
                        ))}
                    </div>
                </ScrollArea>
            )}
        </div>
    );
}
