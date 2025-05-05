"use client";

import { Dispatch, SetStateAction } from "react";

type TMessage = {
    id: number;
    chatId: number;
    senderId: number;
    content: string;
    date: string;
};

export const useFetchOldMessages = (setMessages: Dispatch<SetStateAction<TMessage[]>>) => { 
    const [offset, setOffset] = useState(50);
    
};