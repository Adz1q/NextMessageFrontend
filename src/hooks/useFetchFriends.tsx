"use state";

import { Client, Frame, Message } from "@stomp/stompjs";
import { useEffect, useState } from "react";
import SockJS from "sockjs-client";

type Friend = {
    id: number;
    username: string;
    profilePictureUrl: string;
    friendshipId: number;
    date: string;
};

export const useFetchFriends = (userId: number, token: string) => {
    const [friends, setFriends] = useState<Friend[]>([]);

    useEffect(() => {
        const client = new Client({
            webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
            connectHeaders: { Authorization: `Bearer ${token}` },
            onConnect: () => {
                client.subscribe(`/topic/user/${userId}/friends`, (message: Message) => {
                    const receivedFriends: Friend[] = JSON.parse(message.body);
                    setFriends([...receivedFriends]);
                });

                const getFriendsByUserIdDTO = {
                    userId: userId,
                };

                client.publish({
                    destination: "/app/friend.getFriendsByUserId",
                    headers: { Authorization: `Bearer ${token}` },
                    body: JSON.stringify(getFriendsByUserIdDTO)
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
        friends,
        setFriends,
    };
};
