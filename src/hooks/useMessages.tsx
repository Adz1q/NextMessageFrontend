"use client";

import { getMessages } from "@/lib/api-requests";
import { useCallback, useEffect, useRef, useState } from "react";

type TMessage = {
    id: number;
    chatId: number;
    senderId: number;
    content: string;
    date: string;
};

const MESSAGE_LIMIT: number = 50;

export const useMessages = (
    chatId: number,
    userId: number,
    token: string
) => {
    const [messages, setMessages] = useState<TMessage[]>([]);
    const [offset, setOffset] = useState(0);
    const [hasMoreMessages, setHasMoreMessages] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const previousTopMessageRef = useRef<TMessage | null>(null);
    
    const fetchMessages = useCallback(async (currentOffset: number): Promise<TMessage[] | null> => {
        setIsLoading(true);

        if (currentOffset === 0) {
            setIsInitialLoading(true);
            previousTopMessageRef.current = null;
        }

        try {
            const response = await getMessages(
                chatId, 
                userId, 
                currentOffset, 
                MESSAGE_LIMIT, 
                token
            );

            if (!response.success) {
                setHasMoreMessages(false);
                return null;
            }

            const fetchedSortedMessages = response.data.sort((a, b) => a.id - b.id);

            setMessages((prevMessages) => {
                const existingIds = new Set(prevMessages.map(message => message.id));
                const uniqueNewMessages = fetchedSortedMessages.filter(message => !existingIds.has(message.id));
                
                if (currentOffset === 0) {
                    return uniqueNewMessages;
                }
                
                if (prevMessages.length > 0) {
                    previousTopMessageRef.current = prevMessages[0];
                }
                else {
                    previousTopMessageRef.current = null;
                }

                return [...uniqueNewMessages, ...prevMessages];
            });
            
            if (fetchedSortedMessages.length < MESSAGE_LIMIT) {
                setHasMoreMessages(false);
            }
            else {
                setOffset(currentOffset + fetchedSortedMessages.length);
                setHasMoreMessages(true);
            }

            return fetchedSortedMessages;
        }
        catch (error: unknown) {
            console.log(error);
            setHasMoreMessages(false);
            return null;
        }
        finally {
            setIsLoading(false);
            
            if (currentOffset === 0) {
                setIsInitialLoading(false);
            }
        }
    }, [chatId, userId, token]);

    
    useEffect(() => {
        if (!chatId || !userId || !token) {
            setMessages([]);
            setOffset(0);
            setHasMoreMessages(false);
            setIsInitialLoading(false);
            previousTopMessageRef.current = null;
            return;
        } 

        setMessages([]);
        setOffset(0);
        setHasMoreMessages(true);
        setIsInitialLoading(true);
        previousTopMessageRef.current = null;
        fetchMessages(0);
    }, [fetchMessages, chatId, userId, token]);

    const loadMoreMessages = useCallback(async () => {
        if (isLoading || !hasMoreMessages || !chatId) {
            return null;
        }

        return fetchMessages;
    }, [isLoading, hasMoreMessages, chatId, fetchMessages, offset]);

    const addNewMessage = useCallback((newMessage: TMessage) => {
        setMessages((prevMessages) => {
            if (prevMessages.find(message => message.id === newMessage.id)) {
                return prevMessages;
            }

            return [...prevMessages, newMessage].sort((a, b) => a.id - b.id);
        });
    }, []);

    return {
        messages,
        loadMoreMessages,
        hasMoreMessages,
        isLoading,
        isInitialLoading,
        addNewMessage,
        previousTopMessageRef
    };
};
