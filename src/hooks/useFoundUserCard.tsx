"use client";

import { createPrivateChat, getPrivateChatByMembers, sendFriendshipRequest } from "@/lib/api-requests";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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

export const useFoundUserCard = ( 
    foundUser: FoundUser,
    friends: Friend[],
    chats: Chat[],
    friendshipRequests: FriendshipRequest[],
    session: Session,
) => {
    const [isFriendshipRequestSent, setIsFriendshipRequestSent] = useState(false);
    const [isFriend, setIsFriend] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        friends.forEach((friend) => {
            if (foundUser.id === friend.id) {
                setIsFriend(true);
            }
        });

        friendshipRequests.forEach((friendshipRequest) => {
            if (foundUser.id === friendshipRequest.receiverId) {
                setIsFriendshipRequestSent(true);
            }
        });
    }, [friends, chats, friendshipRequests, foundUser, session?.user?.token]);

    const handleStartNewConversation = async () => {
        const firstResult = await getPrivateChatByMembers(
            parseInt(session?.user?.id),
            foundUser.id,
            session?.user?.token
        );

        if (firstResult.success) {
            const chatId = firstResult.data;
            router.push(`/dashboard/private-chat/${chatId}`);
            return;
        }

        const secondResult = await createPrivateChat(
            parseInt(session?.user?.id),
            foundUser.id,
            session?.user?.token
        );

        if (!secondResult.success) {
            setError(secondResult.error);
            return;
        }

        // const thirdResult = await getPrivateChatByMembers(
        //     parseInt(session?.user?.id),
        //     foundUser.id,
        //     session?.user?.token
        // );

        // if (!thirdResult.success) {
        //     setError(thirdResult.error);
        //     return;
        // }

        // setError("");

        // const chatId = thirdResult.data;
        // router.push(`/dashboard/private-chat/${chatId}`);

        setError("");

        const chatId = secondResult.data.id;
        router.push(`/dashboard/private-chat/${chatId}`);
    };

    const handleSendFriendshipRequest = async () => {
        const result = await sendFriendshipRequest(
            parseInt(session?.user?.id),
            foundUser.id,
            session?.user?.token
        );

        if (!result.success) {
            setError(result.error);
        }

        setError("");
        setIsFriendshipRequestSent(true);
    };

    return {
        isFriendshipRequestSent,
        isFriend,
        error,
        handleStartNewConversation,
        handleSendFriendshipRequest,
    };
};
