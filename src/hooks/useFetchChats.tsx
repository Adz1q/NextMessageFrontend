"use client";

import { Client, Frame, Message } from "@stomp/stompjs";
import { Session } from "next-auth";
import { useEffect, useState } from "react";
import SockJS from "sockjs-client";

type Chat = {
    id: number;
    name: string;
    lastUpdated: string;
    profilePictureUrl: string;
    type: string;
};

export const useFetchChats = (session: Session | null) => {
    const [chats, setChats] = useState<Chat[] | null>(null);
    const [stompClient, setStompClient] = useState<Client | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!session?.user?.id || !session?.user?.token) {
            setChats(null);
            return;
        }

        const userId = Number(session?.user?.id);
        const token = session?.user?.token;

        const client = new Client({
            webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
            connectHeaders: {
                Authorization: `Bearer ${token}`,
            },
            onConnect: () => {
                client.subscribe(`/topic/user/${userId}/chats`, (message: Message) => {
                    setIsLoading(true);
                    const receivedChats: Chat[] = JSON.parse(message.body);
                    setChats(receivedChats);
                    setIsLoading(false);
                });

                const getChatsByUserIdDTO = {
                    userId: userId,
                };
        
                client.publish({
                    destination: "/app/chat.getChatsByUserId",
                    body: JSON.stringify(getChatsByUserIdDTO),
                    headers: { Authorization: `Bearer ${token}` },
                });
            },
            onStompError: (frame: Frame) => {
                console.error(`Broker reported error: ${frame.headers.message}`);
                console.error(`Additional details: ${frame.body}`);
            },
            debug: (str: string) => console.log(str),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        client.activate();
        setStompClient(client);

        if (stompClient?.connected) {
            setStompClient(client);
        }
        
        return () => {
            setChats(null);
            client.deactivate();
        }
    }, [session?.user?.id, session?.user?.token]);

    return {
        chats,
        setChats,
        isLoading,
        setIsLoading,
    };
};
