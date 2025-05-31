"use client";

import { Client, Message } from "@stomp/stompjs";
import { useEffect, useState } from "react";
import SockJS from "sockjs-client";

type TeamChatMember = {
    id: number;
    userId: number;
    chatId: number;
    username: string;
    profilePictureUrl: string;
    allowMessagesFromNonFriends: boolean;
    friend: boolean;
};

export const useTeamChatMembers = (chatId: number, userId: number, token: string) => {
    const [members, setMembers] = useState<TeamChatMember[]>([]);
    const [stompClient, setStompClient] = useState<Client | null>(null);

    useEffect(() => {
        const client = new Client({
            webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
            connectHeaders: { Authorization: `Bearer ${token}` },
            onConnect: () => {
                client.subscribe(`/topic/chat/${chatId}/members`, (message: Message) => {
                    const receivedMessage: TeamChatMember[] = JSON.parse(message.body);
                    setMembers(receivedMessage);
                });

                const DTO = {
                    chatId: chatId,
                    userId: userId,
                };

                client.publish({
                    destination: "/app/chat.getTeamChatMembers",
                    headers: { Authorization: `Bearer ${token}` },
                    body: JSON.stringify(DTO),
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
    }, [chatId, userId, token]);

    return {
        members,
        setMembers,
        stompClient,
        setStompClient
    };
};
