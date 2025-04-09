"use client";

import SockJS from "sockjs-client";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Menu, Send } from "lucide-react";
import { Input } from "../ui/input";
import MessageCard from "../message-card/message-card";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Client, Frame, Message } from "@stomp/stompjs";

type ChatMember = {
    id: number;
    username: string;
    profilePictureUrl: string;
    date: string;
    isFriend: boolean;
};

type ChatDetails = {
    chatId: number;
    otherMember: ChatMember;
    token: string;
    userId: number;
};

type TMessage = {
    id: number;
    chatId: number;
    senderId: number;
    content: string;
    date: string;
};

export default function PrivateChatCard({ chatId, otherMember, userId, token }: ChatDetails) {
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
    }, [chatId, otherMember, token]);

    const sendMessage = (event: Event) => {
        event.preventDefault();

        if (newMessage.trim() !== "" && stompClient?.connected) {
            const chatMessage = {
                chatId: chatId,
                senderId: userId,
                content: newMessage,
            };

            stompClient.publish({
                destination: `/app/chat.sendMessage`,
                body: JSON.stringify(chatMessage),
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log(messages);
            setNewMessage("");
        }
    };

    return (
        <div className="flex flex-col bg-background">
            <div className="flex items-center w-full justify-between p-4 border-b">
                <div className="flex items-center justify-center gap-4 ">
                    <Avatar>
                        <AvatarImage src={otherMember.profilePictureUrl} className="w-25 h-25" alt="User"/>
                    </Avatar>
                    <div className="font-medium">
                        {otherMember.username}
                    </div>
                </div>
                <Button variant="ghost" size="icon">
                    <Menu size={24}/>
                </Button>
            </div>
            <ScrollArea className="flex flex-grow max-h-full overflow-y-auto p-4">
                <div className="w-full">
                    {messages.sort((a, b) => a.id - b.id).map((message, index) => (
                        <MessageCard key={index} message={message} userId={userId}/>
                    ))}
                </div>
            </ScrollArea>
            <div className="w-full p-4 border-t flex gap-4">
                <Input
                    value={newMessage}
                    onChange={(event) => setNewMessage(event.target.value)}
                    placeholder="Type a message..."
                    className="flex-grow"
                />
                <Button onClick={sendMessage}>
                    <Send size={24}/>
                </Button>
            </div>
        </div>
    );
}
