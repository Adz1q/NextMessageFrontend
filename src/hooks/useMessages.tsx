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

export const useMessages = (setMessages: Dispatch<SetStateAction<TMessage[]>>, chatId: number, userId: number, token: string) => {
    useEffect(() => {
        const handleGetMessages = async () => {
            const messagesResponse = await getMessages(chatId, userId, 0, 50, token);

            if (!messagesResponse.success) {
                console.error(messagesResponse.error);
                return;
            }

            setMessages((prevMessages: TMessage[]) => [...messagesResponse.data, ...prevMessages]);
        };

        handleGetMessages();
    }, [setMessages, chatId, userId, token]);
};
