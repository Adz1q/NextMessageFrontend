"use client"; 

import { MouseEvent } from "react";
import { Button } from "../ui/button";
import { Loader2, MessageCircle, PhoneCall, Send, UserPlus, Video, X } from "lucide-react";
import { Input } from "../ui/input";
import MessageCard from "../message-card/message-card";
import { Avatar, AvatarImage } from "../ui/avatar";
import { usePrivateChat } from "@/hooks/usePrivateChat";
import { useMessages } from "@/hooks/useMessages";
import { ScrollArea } from "@radix-ui/react-scroll-area";
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
    userId: number;
};

export default function PrivateChatCard({ chatId, otherMember, userId, token }: ChatDetails) {
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
    } = usePrivateChat(chatId, token, userId, otherMember);

    const { 
        isLoading,
        hasMore,
        getMoreMessges,
    } = useMessages(setMessages, chatId, userId, token);

    // This refers to the useRef approach
    // const messagesEndRef = useRef<HTMLDivElement>(null);

    // const scrollToBottom = () => {
    //     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); // can be "smooth" for smooth transition
    // };

    // useEffect(() => {
    //     scrollToBottom();
    // }, [messages]);

    return (
        <div className="flex flex-col h-full bg-background max-h-screen">
            <div className="flex items-center w-full justify-between p-4 border-b">
                <div className="flex items-center justify-center gap-4 ">
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
                <div>
                    <Button variant="ghost"><PhoneCall /></Button>
                    <Button variant="ghost"><Video /></Button>
                </div>
            </div>
            <ScrollArea className="flex-grow max-h-full overflow-y-auto over p-4 flex flex-col-reverse"> {/* flex flex-col-reverse makes items from the ScrollArea append from bottom */}
                <InfiniteScroll
                    className="flex flex-col-reverse"
                    dataLength={messages.length}
                    inverse={true}
                    next={getMoreMessges}
                    hasMore={hasMore}
                    loader={
                        <div className="flex flex-col items-center justify-center flex-grow text-muted-foreground min-h-[200px]">
                            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                            <p>Loading messages...</p>
                        </div>
                    }
                    endMessage={
                            <div className="text-center text-muted-foreground text-xs py-2">
                                No older messages.
                            </div>
                    }
                >
                    <div className="w-full">
                    {messages.sort((a, b) => a.id - b.id).map((message, index) => (
                        <MessageCard key={index} message={message} userId={userId}/>
                    ))}
                    {/* <div ref={messagesEndRef} />
                    The scroll follows this element,
                    so when you receive a new message there can be a smooth animation
                    but new message = scroll to the bottom and you cannot fetch messages 
                    because fetching old messages will trigger the scroll to the bottom */} 
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center flex-grow text-muted-foreground  min-h-[200px]">
                            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                            <p>Loading messages...</p>
                        </div>
                    )}
                    {!isLoading && messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center flex-grow text-muted-foreground  min-h-[200px]">
                            <MessageCircle className="h-12 w-12 text-border mb-4" />
                            <p className="font-medium">No messages yet.</p>
                            <p className="text-xs">Be the first to send a message!</p>
                        </div>
                    )}
                    </div>
                </InfiniteScroll>
            </ScrollArea> 
            <form className="flex gap-4 w-full p-4 border-t">
                <Input
                    value={newMessage}
                    onChange={(event) => setNewMessage(event.target.value)}
                    placeholder="Type a message..."
                    className="flex-grow"
                />
                <Button onClick={(event: MouseEvent) => sendMessage(event)} >
                    <Send size={24}/>
                </Button>
            </form>
        </div>
    ); 
}
