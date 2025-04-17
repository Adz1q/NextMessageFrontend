"use client";

import React, { useEffect, useState } from "react";
import { Client, Frame, Message } from "@stomp/stompjs";
import SockJS from "sockjs-client";

type TMessage = {
    id: number;
    chatId: number;
    senderId: number;
    content: string;
    date: string;
};

export const usePrivateChat = (chatId: number, token: string, userId: number) => {
    const [messages, setMessages] = useState<TMessage[]>([]);
    const [newMessage, setNewMessage] = useState<string>("");
    const [stompClient, setStompClient] = useState<Client | null>(null);

    useEffect(() => {
        const client = new Client({
            webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
            connectHeaders: {
                Authorization: `Bearer ${token}`,
            },
            onConnect: (frame: Frame) => {
                console.log(`Connected: ${frame}`);
                client.subscribe(`/topic/chat/${chatId}`, (message: Message) => {
                    const receivedMessage: TMessage = JSON.parse(message.body);
                    setMessages((prevMessages: TMessage[]) => [...prevMessages, receivedMessage]);
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

        return () => {
            client.deactivate();
        };
    }, [chatId, token]);

    const sendMessage = (event: React.MouseEvent) => {
        event.preventDefault();

        if (newMessage.trim() !== "" && stompClient?.connected) {
            const chatMessage = {
                chatId: chatId,
                senderId: userId,
                content: newMessage,
            };

            stompClient.publish({
                destination: "/app/chat.sendMessage",
                body: JSON.stringify(chatMessage),
                headers: { Authorization: `Bearer ${token}` },
            });

            setNewMessage("");
        }
    };

    return {
        messages,
        setMessages,
        newMessage,
        setNewMessage,
        sendMessage,
    };
};
