"use client";

import { Client, Frame, Message } from "@stomp/stompjs";
import { useEffect, useState } from "react";
import SockJS from "sockjs-client";

type FriendshipRequest = {
    id: number;
    senderId: number;
    receiverId: number;
    date: string;
    senderUsername: string;
    senderProfilePictureUrl: string;
};

export const useFetchFriendshipRequests = (userId: number, token: string) => {
    const [friendshipRequests, setFriendshipRequests] = useState<FriendshipRequest[]>([]);

    useEffect(() => {
        const client = new Client({
            webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
            connectHeaders: { Authorization: `Bearer ${token}` },
            onConnect: () => {
                client.subscribe(`/topic/user/${userId}/friendshipRequests`, (message: Message) => {
                    const receivedFriendshipRequests: FriendshipRequest[] = JSON.parse(message.body);
                    setFriendshipRequests([...receivedFriendshipRequests]);
                });

                const getFriendshipRequestsByUserIdDTO = {
                    userId: userId,
                };

                client.publish({
                    destination: "/app/friendshipRequest.getFriendshipRequestsByUserId",
                    body: JSON.stringify(getFriendshipRequestsByUserIdDTO),
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

        return () => {
            client.deactivate();
        };
    }, [userId, token]);

    return {
        friendshipRequests,
        setFriendshipRequests,
    };
};
