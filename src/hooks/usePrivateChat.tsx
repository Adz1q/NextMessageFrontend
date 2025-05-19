"use client";

import React, { useEffect, useRef, useState } from "react";
import { Client, Frame, Message, StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { getFriendshipRequestsBySenderId, removeFriend, sendFriendshipRequest } from "@/lib/api-requests";
import { useFetchFriends } from "./useFetchFriends";

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

export const usePrivateChat = (
    chatId: number,
    token: string,
    userId: number, 
    otherMember: ChatMember,
    addNewMessage: (message: TMessage) => void
) => {  
    const [newMessage, setNewMessage] = useState("");
    const stompClientRef = useRef<Client | null>(null);
    const subscriptionRef = useRef<StompSubscription | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    const [isFriendshipRequestSent, setIsFriendshipRequestSent] = useState(false);
    const [isFriend, setIsFriend] = useState(otherMember?.isFriend || false);
    const [friendshipId, setFriendshipId] = useState<number | undefined>(undefined);
    const [error, setError] = useState("");

    const { friends } = useFetchFriends(userId, token);

    useEffect(() => {
        setIsFriend(otherMember?.isFriend || false); 
    }, [otherMember]);

    useEffect(() => {
        if (!chatId || !token || !userId || !addNewMessage) {
            if (stompClientRef.current?.connected) {
                stompClientRef.current.deactivate();
            }
            stompClientRef.current = null;
            setIsConnected(false);
            return;
        }
    
        const client = new Client({
            webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
            connectHeaders: {
                Authorization: `Bearer ${token}`,
            },
            onConnect: () => {
                setIsConnected(true);
                subscriptionRef.current = client.subscribe(`/topic/chat/${chatId}`, (message: Message) => {
                    const receivedMessage: TMessage = JSON.parse(message.body);
                    addNewMessage(receivedMessage);
                });
            },
            onDisconnect: () => {
                console.log(`usePrivateChat: Disconnected STOMP for chat ${chatId}`);
                setIsConnected(false);
            },
            onStompError: (frame: Frame) => {
                console.error(`usePrivateChat: Broker error chat ${chatId}: ${frame.headers['message']}`);
                setIsConnected(false);
            },
            debug: (str: string) => console.log(`STOMP_CHAT_${chatId}:`, str),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        stompClientRef.current = client;
        client.activate();

        return () => {
            subscriptionRef.current?.unsubscribe();
            stompClientRef.current?.deactivate();
            stompClientRef.current = null;
            setIsConnected(false);
        };
    }, []); // chatId, token, isFriendshipRequestSent, otherMember, userId - could be as deps but when you click the same chat, the messages disappear

    useEffect(() => {
        const checkFriendshipRequestStatus = async () => {
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

        checkFriendshipRequestStatus();
    }, [userId, token, otherMember]);

    useEffect(() => {
        friends.forEach((friend) => {
            if (otherMember.id === friend.id) {
                setIsFriend(true);
                setFriendshipId(friend.friendshipId);
            }
        });      
    }, [friends, otherMember]);

    const handleSendFriendshipRequest = async () => {
        const result = await sendFriendshipRequest(
            userId,
            otherMember.id,
            token
        );

        if (!result.success) {
            setError(result.error);
            return;
        }

        setError("");
        setIsFriendshipRequestSent(true);
    };

    const handleRemoveFriend = async () => {
        if (friendshipId === undefined) {
            setError("Friendship id is undefined");
            return;
        }

        const result = await removeFriend(friendshipId, token);

        if (!result.success) {
            setError(result.error);
            return;
        }

        setIsFriend(false);
    };

    const sendMessage = (event: React.MouseEvent | React.KeyboardEvent) => {
        event.preventDefault();

        if (newMessage.trim() !== "" && stompClientRef.current?.connected && chatId && userId) {
            const chatMessage = {
                chatId: chatId,
                senderId: userId,
                content: newMessage.trim(),
            };

            stompClientRef.current.publish({
                destination: "/app/chat.sendMessage",
                body: JSON.stringify(chatMessage),
                headers: { Authorization: `Bearer ${token}` },
            });

            setNewMessage("");
        }
    };

    return {
        newMessage,
        setNewMessage,
        sendMessage,
        isFriendshipRequestSent,
        handleSendFriendshipRequest,
        error,
        isFriend,
        handleRemoveFriend,
        isConnected
    };
};
