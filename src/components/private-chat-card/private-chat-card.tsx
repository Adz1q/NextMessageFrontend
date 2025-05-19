"use client"; 

import { useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { Loader2, MessageCircle, Send, UserMinus, UserPlus } from "lucide-react";
import { Input } from "../ui/input";
import MessageCard from "../message-card/message-card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { usePrivateChat } from "@/hooks/usePrivateChat";
import { useMessages } from "@/hooks/useMessages";
import { ScrollBar } from "../ui/scroll-area";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { cn } from "@/lib/utils";

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

const SCROLL_NEAR_BOTTOM_THRESHOLD_REVERSE = 50;

export default function PrivateChatCard({ chatId, otherMember, userId, token }: ChatDetails) {
    const {
        messages,
        loadMoreMessages,
        hasMoreMessages,
        isLoading: isLoadingOlderMessages,
        isInitialLoading,
        addNewMessage,
        previousTopMessageRef
    } = useMessages(chatId, userId, token);

    const { 
        newMessage, 
        setNewMessage, 
        sendMessage,
        isFriendshipRequestSent,
        handleSendFriendshipRequest,
        error,
        isFriend,
        handleRemoveFriend,
        isConnected
    } = usePrivateChat(chatId, token, userId, otherMember, addNewMessage);

    const scrollAreaViewportRef = useRef<HTMLDivElement>(null);
    const bottomSentinelRef = useRef<HTMLDivElement>(null);
    const topSentinelRef = useRef<HTMLDivElement>(null);
    const wasNearBottomRef = useRef(true);
    const prevScrollHeightRef = useRef<number>(0);

    const getAvatarFallback = (username?: string) => {
        return username?.substring(0, 2)?.toUpperCase() || "??";
    };

    useEffect(() => {
        const viewport = scrollAreaViewportRef.current;
        if (!viewport || messages.length === 0) return;

        if (wasNearBottomRef.current) {
            bottomSentinelRef.current?.scrollIntoView({ behavior: "auto", block: "end" });
        }

        const timerId = setTimeout(() => {
            if (scrollAreaViewportRef.current) {
                wasNearBottomRef.current = scrollAreaViewportRef.current.scrollTop < SCROLL_NEAR_BOTTOM_THRESHOLD_REVERSE;
            }
        }, 50);
        return () => clearTimeout(timerId);
    }, [messages]);

    useEffect(() => {
        const viewport = scrollAreaViewportRef.current;
        const prevTopMessage = previousTopMessageRef.current;

        if (prevTopMessage && viewport && messages.some(m => m.id === prevTopMessage.id) && prevScrollHeightRef.current > 0) {
            const currentScrollHeight = viewport.scrollHeight;
            const scrollHeightDiff = currentScrollHeight - prevScrollHeightRef.current;

            if (scrollHeightDiff > 0) { 
                 console.log("PrivateChatCard: Restoring scroll. Diff:", scrollHeightDiff, "Current scrollTop:", viewport.scrollTop);
                viewport.scrollTop += scrollHeightDiff;
                console.log("PrivateChatCard: Scroll position restored. New scrollTop:", viewport.scrollTop);
            }
            previousTopMessageRef.current = null; 
            prevScrollHeightRef.current = 0; 
        }
    }, [messages, previousTopMessageRef]);

    useEffect(() => {
        const viewport = scrollAreaViewportRef.current;
        if (!viewport || !hasMoreMessages || isLoadingOlderMessages) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const firstEntry = entries[0];
                if (firstEntry.isIntersecting && hasMoreMessages && !isLoadingOlderMessages) {
                    console.log("PrivateChatCard: Top sentinel intersecting, loading more messages...");
                    if (scrollAreaViewportRef.current) {
                        prevScrollHeightRef.current = scrollAreaViewportRef.current.scrollHeight; 
                    }
                    loadMoreMessages();
                }
            },
            { root: viewport, threshold: 0.1 }
        );

        const sentinel = topSentinelRef.current;
        if (sentinel) observer.observe(sentinel);
        return () => { if (sentinel) observer.unobserve(sentinel); };
    }, [hasMoreMessages, isLoadingOlderMessages, loadMoreMessages]);

    useEffect(() => {
        const viewport = scrollAreaViewportRef.current;
        if (!viewport) return;
        let scrollTimeoutId: NodeJS.Timeout;
        const handleScroll = () => {
            clearTimeout(scrollTimeoutId);
            scrollTimeoutId = setTimeout(() => {
                if (scrollAreaViewportRef.current) {
                    wasNearBottomRef.current = scrollAreaViewportRef.current.scrollTop < SCROLL_NEAR_BOTTOM_THRESHOLD_REVERSE;
                }
            }, 150);
        };
        viewport.addEventListener('scroll', handleScroll, { passive: true });
        if (viewport.scrollHeight > 0) { 
            wasNearBottomRef.current = viewport.scrollTop < SCROLL_NEAR_BOTTOM_THRESHOLD_REVERSE;
        }
        return () => {
            clearTimeout(scrollTimeoutId);
            if (viewport) viewport.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // This refers to the useRef approach
    // const messagesEndRef = useRef<HTMLDivElement>(null);

    // const scrollToBottom = () => {
    //     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); // can be "smooth" for smooth transition
    // };

    // useEffect(() => {
    //     scrollToBottom();
    // }, [messages]);

    if (!chatId || !otherMember || !userId || !token) {
        return (
            <div className="flex flex-col h-full items-center justify-center bg-background p-8 text-center">
                <MessageCircle className="h-16 w-16 text-muted-foreground/50 mb-6" strokeWidth={1.5} />
                <h2 className="text-2xl font-semibold text-foreground mb-2">Select a Chat</h2>
                <p className="text-muted-foreground">Choose a conversation from the sidebar to start messaging.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-background max-h-screen">
            <div className="flex items-center w-full justify-between p-3.5 border-b border-border shrink-0">
                <div className="flex items-center justify-center gap-3">
                    <Avatar className="h-10 w-10 border">
                        <AvatarImage src={otherMember.profilePictureUrl} alt={otherMember.username} />
                        <AvatarFallback>{getAvatarFallback(otherMember.username)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="font-semibold text-sm text-foreground">{otherMember.username}</span>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    {error && <p className="text-xs text-destructive mr-2">{error}</p>}
                    {!isFriend && (
                        <Button
                            onClick={handleSendFriendshipRequest}
                            variant="ghost"
                            size="icon"
                            className={cn("h-8 w-8", isFriendshipRequestSent && "opacity-50 cursor-not-allowed")}
                            disabled={isFriendshipRequestSent}
                            title={isFriendshipRequestSent ? "Friend request sent" : "Send friend request"}
                        >
                            <UserPlus className="h-4 w-4" />
                        </Button>
                    )}
                    {isFriend && (
                        <Button
                            onClick={handleRemoveFriend}
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                            title="Remove friend"
                        >
                            <UserMinus className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>

            <ScrollAreaPrimitive.Root className="flex-grow data-[orientation=vertical]:flex-shrink-0 overflow-hidden">
                <ScrollAreaPrimitive.Viewport ref={scrollAreaViewportRef} className="h-full w-full rounded-[inherit]">
                    <div className="flex flex-col-reverse p-4 pt-2 space-y-1 space-y-reverse">
                        <div ref={bottomSentinelRef} style={{ height: '1px' }} aria-hidden="true" />
                        {messages.map((message) => (
                            <div key={message.id} data-message-id={message.id.toString()}>
                                <MessageCard message={message} userId={userId} />
                            </div>
                        ))}
                        {isLoadingOlderMessages && (
                            <div className="flex justify-center items-center py-3">
                                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                            </div>
                        )}
                        {!isLoadingOlderMessages && !hasMoreMessages && messages.length > 0 && (
                            <div className="text-center text-muted-foreground text-xs py-2">
                                No older messages.
                            </div>
                        )}
                        {isInitialLoading && messages.length === 0 && !isLoadingOlderMessages && (
                            <div className="flex flex-col items-center justify-center flex-grow text-muted-foreground py-10 min-h-[200px]">
                                <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                                <p>Loading messages...</p>
                            </div>
                        )}
                        {!isInitialLoading && messages.length === 0 && !isLoadingOlderMessages && (
                            <div className="flex flex-col items-center justify-center flex-grow text-muted-foreground py-10 min-h-[200px]">
                                <MessageCircle className="h-12 w-12 text-border mb-4" />
                                <p className="font-medium">No messages yet.</p>
                                <p className="text-xs">Be the first to send a message!</p>
                            </div>
                        )}
                        <div ref={topSentinelRef} style={{ height: '1px' }} aria-hidden="true" />
                    </div>
                </ScrollAreaPrimitive.Viewport>
                <ScrollBar orientation="vertical" />
            </ScrollAreaPrimitive.Root>

            <form className="flex gap-2 w-full p-3 border-t border-border shrink-0 bg-background">
                <Input
                    value={newMessage}
                    onChange={(event) => setNewMessage(event.target.value)}
                    placeholder="Type a message..."
                    className="flex-grow h-10 text-sm focus-visible:ring-primary/80 focus-visible:ring-offset-1"
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(e); }}}
                    disabled={!isConnected || !chatId}
                />
                <Button
                    type="submit"
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || !isConnected || !chatId}
                    className="h-10 px-4"
                >
                    <Send size={18} />
                </Button>
            </form>
        </div>
    );
}
