"use client"; 

import Image from "next/image";
import { Button } from "../ui/button";
import { MessageCircleMore, UserPlus } from "lucide-react";
import { Session } from "next-auth";
import { useFoundUserCard } from "@/hooks/useFoundUserCard";

type FoundUser = {
    id: number;
    username: string;
    profilePictureUrl: string;
    date: string;
    allowMessagesFromNonFriends: boolean;
};

type Friend = {
    id: number;
    username: string;
    profilePictureUrl: string;
    friendshipId: number;
    date: string;
};

type Chat = {
    id: number;
    name: string;
    lastUpdated: string;
    profilePictureUrl: string;
    type: string;
};

type FriendshipRequest = {
    id: number;
    senderId: number;
    receiverId: number;
    date: string;
};

export default function FoundUserCard({ foundUser, friends, chats, friendshipRequests, session }: { 
    foundUser: FoundUser,
    friends: Friend[],
    chats: Chat[],
    friendshipRequests: FriendshipRequest[],
    session: Session,
}) {
    const { 
        isFriendshipRequestSent,
        isFriend, 
        error, 
        handleStartNewConversation, 
        handleSendFriendshipRequest 
    } = useFoundUserCard(foundUser, friends, chats, friendshipRequests, session);

    return (
        <div className="flex items-center justify-between max-w-md">
            <div className="flex items-center font-500">
                <Image src={foundUser.profilePictureUrl} width={50} height={50} alt="Profile picture"/>
                <div>{foundUser.username}</div>
            </div>
            <div className="flex items-center gap-2">
                <Button onClick={handleStartNewConversation} variant="outline" className={foundUser.allowMessagesFromNonFriends || isFriend ? "visible" : "invisible"}>
                    <MessageCircleMore /> Message
                </Button>
                <Button onClick={handleSendFriendshipRequest} variant="outline" className={isFriend || isFriendshipRequestSent ? "invisible" : "visible"}>
                    <UserPlus /> Add Friend
                </Button>
                {error && <div className="text-red-900">{error}</div>}
            </div>
        </div>
    );
}
