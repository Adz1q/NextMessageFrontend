"use client";

import { MouseEvent } from "react";
import { Button } from "../ui/button";
import { Send } from "lucide-react";
import { Input } from "../ui/input";
import MessageCard from "../message-card/message-card";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Avatar, AvatarImage } from "../ui/avatar";
import { usePrivateChat } from "@/hooks/usePrivateChat";
import { useMessages } from "@/hooks/useMessages";

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

export default function PrivateChatCard({ chatId, otherMember, userId, token }: ChatDetails) {
    const { 
        messages,
        setMessages,
        newMessage, 
        setNewMessage, 
        sendMessage 
    } = usePrivateChat(chatId, token, userId);

    useMessages(setMessages, chatId, userId, token);

    return (
        <div className="flex flex-col h-full bg-background max-h-screen">
            <div className="flex items-center w-full justify-start p-4 border-b">
                <div className="flex items-center justify-center gap-4 ">
                    <Avatar>
                        <AvatarImage src={otherMember.profilePictureUrl} className="w-25 h-25" alt="User"/>
                    </Avatar>
                    <div className="font-medium">
                        {otherMember.username}
                    </div>
                </div>
            </div>
            <ScrollArea className="flex flex-grow max-h-full overflow-y-auto p-4">
                <div className="w-full">
                    {messages.sort((a, b) => a.id - b.id).map((message, index) => (
                        <MessageCard key={index} message={message} userId={userId}/>
                    ))}
                </div>
            </ScrollArea> 
            <form className="flex gap-4 w-full p-4 border-t">
                <Input
                    value={newMessage}
                    onChange={(event) => setNewMessage(event.target.value)}
                    placeholder="Type a message..."
                    className="flex grow"
                />
                <Button onClick={(event: MouseEvent) => sendMessage(event)} >
                    <Send size={24}/>
                </Button>
            </form>
        </div>
    ); 
}

// add loading state to messages
// add fetching messages on scroll up (increasing offset to get older messages)
// repair layout, so it doesn't overflow the screen when there are too many messages
