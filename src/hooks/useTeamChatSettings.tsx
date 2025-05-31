"use client";

import { Client, Message } from "@stomp/stompjs";
import { useEffect, useState } from "react";
import SockJS from "sockjs-client";

type TeamChat = {
    id: number;
    lastUpdated: string;
    name: string,
    profilePictureUrl: string,
    adminId: number;
};

export const useTeamChatSettings = (chatId: number, userId: number, token: string) => {
    const [error, setError] = useState<string | null>(null);
    const [chat, setChat] = useState<TeamChat | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [stompClient, setStompClient] = useState<Client | null>(null);

    useEffect(() => {
        const client = new Client({
            webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
            connectHeaders: { Authorization: `Bearer ${token}` },
            onConnect: () => {
                client.subscribe(`/topic/chat/${chatId}/details`, (message: Message) => {
                    const receivedMessage: TeamChat = JSON.parse(message.body);
                    setChat(receivedMessage);
                });

                const DTO = {
                    chatId: chatId,
                };

                client.publish({
                    destination: "/app/chat.getTeamChat",
                    body: JSON.stringify(DTO),
                    headers: { Authorization: `Bearer ${token}` },
                });
            },
            debug: (str: string) => console.log(str),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        client.activate();
        setStompClient(client);

        return () => {
            client.deactivate();
            setStompClient(null);
        };
    }, [userId, chatId, token]);

    return {
        error,
        setError,
        chat,
        setChat,
        isLoading,
        setIsLoading,
        stompClient,
        setStompClient,
    };
};
