"use client";

import React, { useEffect, useState } from "react";
import { Client, Frame, Message } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { getFriendshipRequestsBySenderId, sendFriendshipRequest } from "@/lib/api-requests";

type TMessage = {
    id: number;
    chatId: number;
    senderId: number;
    content: string;
    date: string;
};

type ChatMember = {
    id: number;
    username: string;
    profilePictureUrl: string;
    date: string;
    isFriend: boolean;
};

export const usePrivateChat = (chatId: number, token: string, userId: number, otherMember: ChatMember) => {
    const [messages, setMessages] = useState<TMessage[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [stompClient, setStompClient] = useState<Client | null>(null);
    const [isFriendshipRequestSent, setIsFriendshipRequestSent] = useState(false);
    const [error, setError] = useState("");

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
        
        const fetchData = async () => {
            const friendshipRequestsResult = await getFriendshipRequestsBySenderId(userId, token);
            
            if (!friendshipRequestsResult.success) {
               setError(friendshipRequestsResult.error);
               return;
            }

            const friendshipRequests = friendshipRequestsResult.data;

            friendshipRequests.forEach((friendshipRequest) => {
                if (otherMember.id === friendshipRequest.receiverId) {
                    setIsFriendshipRequestSent(true);
                }
            });
        };

        fetchData();

        return () => {
            setStompClient(null);
            client.deactivate();
            setMessages([]);
        };
    }, [chatId, token, isFriendshipRequestSent, otherMember, userId]);

    const handleSendFriendshipRequest = async () => {
        const result = await sendFriendshipRequest(
            userId,
            otherMember.id,
            token
        );

        if (!result.success) {
            setError(result.error);
        }

        setError("");
        setIsFriendshipRequestSent(true);
    };

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
        isFriendshipRequestSent,
        handleSendFriendshipRequest,
        error,
    };
};
