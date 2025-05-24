"use client";

import { getChat } from "@/lib/api-requests";
import { Client, Message } from "@stomp/stompjs";
import { useEffect, useState } from "react";
import SockJS from "sockjs-client";

type TeamChat = {
    id: number;
    profilePictureUrl: string,
    name: string,
    admin_id: number;
    lastUpdated: string;
}

type TMessage = {
    id: number;
    chatId: number;
    senderId: number;
    senderUsername: string;
    content: string;
    date: string;
};

export const useTeamChat = (chatId: number, userId: number, username: string, token: string) => {
    const [chat, setChat] = useState<TeamChat | null>(null);
    const [error, setError] = useState("");
    const [messages, setMessages] = useState<TMessage[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [stompClient, setStompClient] = useState<Client | null>(null);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false); 

    useEffect(() => {
        const fetchChatDetails = async () => {
            setIsLoadingDetails(true);

            const response = await getChat(chatId, userId, token);

            if (!response.success) {
                setIsLoadingDetails(false);
                setError("Failed with fetching chat");
                return;
            }

            setChat(response.data as TeamChat);
            setIsLoadingDetails(false);
        };

        fetchChatDetails();
    }, []);

    useEffect(() => {
        const client = new Client({
            webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
            connectHeaders: {
                Authorization: `Bearer ${token}`,
            },
            onConnect: () => {
                client.subscribe(`/topic/chat/${chatId}`, (message: Message) => {
                    const receivedMessage: TMessage = JSON.parse(message.body);
                    setMessages((prevMessages: TMessage[]) => [...prevMessages, receivedMessage]);
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
            setMessages([]);
        };
    }, []);

    const sendMessage = (event: React.MouseEvent) => {
        event.preventDefault();
    
        if (newMessage.trim() !== "" && stompClient?.connected) {
            const chatMessage = {
                chatId: chatId,
                senderId: userId,
                senderUsername: username,
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
        chat,
        setChat,
        error,
        setError,
        sendMessage,
        messages,
        setMessages,
        newMessage,
        setNewMessage,
        stompClient,
        setStompClient,
        isLoadingDetails,
        setIsLoadingDetails,
    };
};
