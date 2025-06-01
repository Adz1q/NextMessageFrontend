"use client"; 

import { useRef } from "react";
import { Button } from "../ui/button";
import { Loader2, MessageCircle, Send, UserPlus, X } from "lucide-react";
import { Input } from "../ui/input";
import MessageCard from "../message-card/message-card";
import { Avatar, AvatarImage } from "../ui/avatar";
import { usePrivateChat } from "@/hooks/usePrivateChat";
import { useMessages } from "@/hooks/useMessages";
import InfiniteScroll from 'react-infinite-scroll-component';

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
    username: string;
    userId: number;
};

export default function PrivateChatCard({ chatId, otherMember, userId, username, token }: ChatDetails) {
    const { 
        messages,
        setMessages,
        newMessage, 
        setNewMessage, 
        sendMessage,
        isFriendshipRequestSent,
        handleSendFriendshipRequest,
        error,
        isFriend,
        handleRemoveFriend
    } = usePrivateChat(chatId, token, userId, username, otherMember);

    const { 
        isLoading,
        hasMore,
        getMoreMessages,
    } = useMessages(setMessages, chatId, userId, token);

    const scrollableRef = useRef<HTMLDivElement>(null);


    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center justify-center gap-4">
                    <Avatar>
                        <AvatarImage src={otherMember.profilePictureUrl} className="w-25 h-25" alt="User"/>
                    </Avatar>
                    <div className="font-medium">
                        {otherMember.username}
                    </div>
                    <Button onClick={handleSendFriendshipRequest} variant="ghost" className={isFriend || isFriendshipRequestSent ? "hidden" : "inline"}>
                        <UserPlus />
                    </Button>
                    <Button onClick={handleRemoveFriend} variant="ghost" className={isFriend ? "inline" : "hidden"}>
                        <X />
                    </Button>
                    {error && <div className="text-red-900">{error}</div>}
                </div>
            </div>
            <div
                id="scrollableDiv"
                ref={scrollableRef}
                className="h-[45rem] overflow-y-auto flex flex-col-reverse p-3"           
            >
                <InfiniteScroll
                    dataLength={messages.length}
                    style={{ 
                        display: "flex", 
                        flexDirection: "column-reverse"
                    }}
                    inverse={true}
                    next={getMoreMessages}
                    hasMore={hasMore}
                    scrollableTarget="scrollableDiv"
                    loader={
                        // <div className="flex flex-col items-center justify-center flex-grow text-muted-foreground min-h-[200px]">
                        //     <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                        //     <p>Loading messages...</p>
                        // </div>
                        null
                    }
                    endMessage={
                        <div className="text-center text-muted-foreground text-xs py-2">
                            No older messages.
                        </div>
                    }
                >
                    {messages.sort((a, b) => b.id - a.id).map((message, index) => (
                        <MessageCard key={index} message={message} userId={userId}/>
                    ))}
                </InfiniteScroll>
                {!isLoading && messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center flex-grow text-muted-foreground  min-h-[200px]">
                            <MessageCircle className="h-12 w-12 text-border mb-4" />
                            <p className="font-medium">No messages yet.</p>
                            <p className="text-xs">Be the first to send a message!</p>
                        </div>
                )}
                {isLoading && (
                        <div className="flex flex-col items-center justify-center flex-grow text-muted-foreground  min-h-[200px]">
                            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                            <p>Loading messages...</p>
                        </div>
                )}
            </div>
            <form className="flex gap-4 p-4 border-t">
                <Input
                    value={newMessage}
                    onChange={(event) => setNewMessage(event.target.value)}
                    placeholder="Type a message..."
                    className="flex-grow"
                />
                <Button onClick={(event: React.MouseEvent) => sendMessage(event)} >
                    <Send size={24}/>
                </Button>
            </form>
        </div>
    ); 
}
