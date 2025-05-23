"use client"; 

import { useFormatFullDate } from "@/hooks/useFormatFullDate";

type MessageDetails = {
    message: {
        id: number;
        chatId: number;
        senderId: number;
        content: string;
        date: string;
    };
    userId: number;
}

export default function MessageCard({ message, userId }: MessageDetails) {
    const { displayedDate, isDisplayed, setIsDisplayed } = useFormatFullDate(message.date);

    return (
        <div onClick={() => setIsDisplayed(prevState => !prevState)} className={`mb-1 w-full flex flex-col justify-center ${message.senderId === userId ? "items-end" : "items-start"}`}>
            {isDisplayed && <div className="flex w-full items-center justify-center text-foreground">
                {displayedDate}
            </div>}
            <div className="bg-foreground rounded-md text-muted pr-3 pl-3 pt-1 pb-1 text-md">
                {message.content}
            </div>
        </div>
    );
}
