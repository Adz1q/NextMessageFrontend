"use client"; 

import { useFetchFriendshipRequests } from "@/hooks/useFetchFriendshipRequests";
import FriendshipRequestCard from "../friendship-request-card/friendship-request-card";

export default function FriendshipRequestList({ userId, token }: {
    userId: number,
    token: string
}) {
    const { friendshipRequests } = useFetchFriendshipRequests(userId, token);
    
    return (
        <div className="flex flex-col gap-6">
            {friendshipRequests.sort((a, b) => {
                const firstDate = new Date(a.date).getTime();
                const secondDate = new Date(b.date).getTime();

                return secondDate - firstDate;
            }).map((friendshipRequest, index) => <FriendshipRequestCard key={index} friendshipRequest={friendshipRequest} token={token} />)}
        </div>
    );
}
