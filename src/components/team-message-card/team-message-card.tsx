"use client"; 

import { useFormatFullDate } from "@/hooks/useFormatFullDate";

type TeamMessageDetails = {
    message: {
        id: number;
        chatId: number;
        senderId: number;
        senderUsername: string;
        content: string;
        date: string;
    };
    userId: number;
}

export default function TeamMessageCard({ message, userId }: TeamMessageDetails) {
    const { displayedDate, isDisplayed, setIsDisplayed } = useFormatFullDate(message.date);

    return (
        <div onClick={() => setIsDisplayed(prevState => !prevState)} className={`mb-2 w-full flex flex-col justify-center ${message.senderId === userId ? "items-end" : "items-start"}`}>
            {isDisplayed && <div className="flex w-full items-center justify-center text-foreground">
                {displayedDate}
            </div>}
            <div className={`${message.senderId === userId ? "pr-1" : "pl-1"} flex items-center justify-center text-foreground`}>{message.senderUsername}</div>
            <div className="bg-foreground rounded-md text-muted pr-3 pl-3 pt-1 pb-1 text-md">
                {message.content}
            </div>
        </div>
    );
}
