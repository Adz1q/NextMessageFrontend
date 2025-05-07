"use client";

import { getMessages } from "@/lib/api-requests";
import { Dispatch, SetStateAction, useEffect } from "react";

type TMessage = {
    id: number;
    chatId: number;
    senderId: number;
    content: string;
    date: string;
};

const MESSAGE_LIMIT: number = 50;
const MESSAGE_OFFSET: number = 0;

export const useMessages = (setMessages: Dispatch<SetStateAction<TMessage[]>>, chatId: number, userId: number, token: string) => {
    useEffect(() => {
        const handleGetMessages = async () => {
            const messagesResponse = await getMessages(chatId, userId, MESSAGE_OFFSET, MESSAGE_LIMIT, token);

            if (!messagesResponse.success) {
                console.error(messagesResponse.error);
                return;
            }

            setMessages([...messagesResponse.data]);
        };

        handleGetMessages();

        return () => {
            setMessages([]);
        };
    }, [setMessages, chatId, userId, token]);
};
