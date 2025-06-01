"use client";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { useChatMember } from "@/hooks/useChatMember";
import { Crown, MessageCircleMore, UserMinus, UserPlus } from "lucide-react";

type TeamChatMember = {
    id: number;
    userId: number;
    chatId: number;
    username: string;
    profilePictureUrl: string;
    allowMessagesFromNonFriends: boolean;
    friend: boolean
};

type FriendshipRequest = {
    id: number;
    senderId: number;
    receiverId: number;
    date: string;
};

export default function ChatMember({
    userId,
    token,
    member,
    adminId,
    chatId,
    friendshipRequests
}: {
    userId: number;
    token: string;
    member: TeamChatMember;
    adminId: number,
    chatId: number,
    friendshipRequests: FriendshipRequest[];
}) {
    const { error, isFriendshipRequestSent, handleChangeTeamChatAdmin, handleRemoveTeamChatMember, handleStartNewConversation, handleSendFriendshipRequest } = useChatMember(userId, token, member, chatId, friendshipRequests);

    const getAvatarFallback = (username: string) => {
        return username?.substring(0, 2)?.toUpperCase() || "??";
    };

    return (
        <div className="flex flex-col bg-muted/30 rounded-md">
            <div
                className="flex items-center gap-8 justify-between p-2.5 rounded-md transition-colors cursor-pointer hover:bg-accent"
            >
                <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={member.profilePictureUrl} alt={member?.username} />
                        <AvatarFallback>{getAvatarFallback(member.username)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-sm">
                        {member.username}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <Button onClick={handleChangeTeamChatAdmin} variant="outline" size="sm" className={userId === adminId  && member?.userId !== adminId ? "visible" : "invisible"}>
                        <Crown /> Make Admin
                    </Button>
                    <Button onClick={handleRemoveTeamChatMember} variant="outline" size="sm" className={userId === adminId && member?.userId !== adminId ? "visible" : "invisible"}>
                        <UserMinus /> Remove
                    </Button>
                    <Button onClick={handleStartNewConversation} size="sm" variant="outline" className={(member?.allowMessagesFromNonFriends || member?.friend) && member?.userId !== userId ? "visible" : "invisible"}>
                        <MessageCircleMore /> Message
                    </Button>
                    <Button onClick={handleSendFriendshipRequest} size="sm" variant="outline" className={member?.friend || isFriendshipRequestSent || member?.userId === userId ? "invisible" : "visible"}>
                        <UserPlus /> Add Friend
                    </Button>
                </div>
            </div>
            {error && <div className="ml-4 text-red-900">{error}</div>}
        </div>
        
    );
}
