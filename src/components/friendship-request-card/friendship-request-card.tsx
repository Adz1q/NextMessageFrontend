"use client"; 

import { useFormatShortDate } from "@/hooks/useFormatShortDate";
import Image from "next/image";
import { Button } from "../ui/button";
import { Check, X } from "lucide-react";
import { acceptFriendshipRequest, rejectFriendshipRequest } from "@/lib/api-requests";

type FriendshipRequest = {
    id: number;
    senderId: number;
    receiverId: number;
    date: string;
    senderUsername: string;
    senderProfilePictureUrl: string;
};

export default function FriendshipRequestCard({ friendshipRequest, token }: {
    friendshipRequest: FriendshipRequest,
    token: string 
}) {
    const { displayedDate } = useFormatShortDate(friendshipRequest.date);
    
    const handleAcceptFriendshipRequest = async () => {
        const result = await acceptFriendshipRequest(friendshipRequest.senderId, friendshipRequest.receiverId, token);

        if (!result.success) {
            return;
        }
    };

    const handleRejectFriendshipRequest = async () => {
        const result = await rejectFriendshipRequest(friendshipRequest.senderId, friendshipRequest.receiverId, token);

        if (!result.success) {
            return;
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center justify-center gap-2">
                <Image src={friendshipRequest.senderProfilePictureUrl} height={40} width={40} alt={friendshipRequest.senderUsername}/>
                <div>{friendshipRequest.senderUsername}</div>
            </div>
            <div>
                <div className="flex items-center justify-center text-muted-foreground">
                    {displayedDate}
                </div>
            </div>
            <div className="flex justify-center items-center gap-2">
                <Button onClick={handleAcceptFriendshipRequest} className="w-full max-w-1/2" variant="secondary">
                    <Check /> Accept
                </Button>
                <Button onClick={handleRejectFriendshipRequest} className="w-full max-w-1/2" variant="secondary">
                    <X /> Reject
                </Button>
            </div>
        </div>
    );
}
