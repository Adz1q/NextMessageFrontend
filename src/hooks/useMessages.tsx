"use client";

import { getMessages } from "@/lib/api-requests";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

type TMessage = {
    id: number;
    chatId: number;
    senderId: number;
    senderUsername: string;
    content: string;
    date: string;
};

const MESSAGE_LIMIT = 50;
const MESSAGE_OFFSET = 50;

export const useMessages = (setMessages: Dispatch<SetStateAction<TMessage[]>>, chatId: number, userId: number, token: string) => {
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [offset, setOffset] = useState(0);

    const getMoreMessages = async () => {
        const messagesResponse = await getMessages(chatId, userId, offset, MESSAGE_LIMIT, token);

        if (!messagesResponse.success) {
            console.error(messagesResponse.error);
            return;
        }

        if (messagesResponse.data.length < MESSAGE_LIMIT) {
            setHasMore(false);
        }

        setOffset(o => o += MESSAGE_OFFSET);
        setMessages((prevMessages) => [...prevMessages, ...messagesResponse.data]);
    };

    useEffect(() => {
        const handleGetMessages = async () => {
            setIsLoading(true);

            const messagesResponse = await getMessages(chatId, userId, offset, MESSAGE_LIMIT, token);

            if (!messagesResponse.success) {
                console.error(messagesResponse.error);
                return;
            }

            setOffset(o => o += MESSAGE_OFFSET);
            setIsLoading(false);
            setMessages([...messagesResponse.data]);
        };

        handleGetMessages();

        return () => {
            setMessages([]);
            setOffset(0);
            setHasMore(true);
        };
    }, [chatId, userId, token]);

    return {
        isLoading,
        setIsLoading,
        hasMore,
        setHasMore,
        getMoreMessages,
    };
};
