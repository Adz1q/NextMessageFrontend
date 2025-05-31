"use client";

import { changeTeamChatAdmin, createPrivateChat, getPrivateChatByMembers, removeTeamChatMember, sendFriendshipRequest } from "@/lib/api-requests";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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

export const useChatMember = ( 
    userId: number,
    token: string,
    member: TeamChatMember,
    chatId: number,
    friendshipRequests: FriendshipRequest[],
) => {
    const [isFriendshipRequestSent, setIsFriendshipRequestSent] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        friendshipRequests.forEach((friendshipRequest) => {
            if (friendshipRequest.receiverId == member?.id) {
                setIsFriendshipRequestSent(true);
            }
        });
    }, [friendshipRequests, member]);

    const handleStartNewConversation = async () => {
        const firstResult = await getPrivateChatByMembers(
            userId,
            member?.userId,
            token
        );

        if (firstResult.success) {
            const chatId = firstResult.data;
            router.push(`/dashboard/private-chat/${chatId}`);
            return;
        }

        const secondResult = await createPrivateChat(
            userId,
            member?.id,
            token
        );

        if (!secondResult.success) {
            setError(secondResult.error);
            return;
        }

        setError("");

        const chatId = secondResult.data.id;
        router.push(`/dashboard/private-chat/${chatId}`);
    };

    const handleSendFriendshipRequest = async () => {
        const result = await sendFriendshipRequest(
            userId,
            member.id,
            token
        );

        if (!result.success) {
            setError(result.error);
            return;
        }

        setError("");
        setIsFriendshipRequestSent(true);
    };

    const handleRemoveTeamChatMember = async () => {
        const result = await removeTeamChatMember(
            chatId,
            member?.userId,
            userId,
            token
        );

        if (!result.success) {
            setError(result.error);
            return;
        }

        setError("");
    };

    const handleChangeTeamChatAdmin = async () => {
        const result = await changeTeamChatAdmin(
            chatId,
            userId,
            member?.userId,
            token
        );

        if (!result.success) {
            setError(result.error);
            return; 
        }

        setError("");
    };

    return {
        isFriendshipRequestSent,
        setIsFriendshipRequestSent,
        error,
        setError,
        handleStartNewConversation,
        handleSendFriendshipRequest,
        handleRemoveTeamChatMember,
        handleChangeTeamChatAdmin,
    };
};
