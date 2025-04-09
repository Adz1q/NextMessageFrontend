import Link from "next/link";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { useFormatShortDate } from "@/hooks/useFormatShortDate";

type Chat = {
    id: number;
    name: string;
    lastUpdated: string;
    profilePictureUrl: string;
    type: string;
};

type ChatDetails = {
    chat: Chat;
};

export default function ChatCard({ chat }: ChatDetails) {
    const { displayedDate } = useFormatShortDate(chat.lastUpdated);

    return (
        <Link href={`/dashboard/${chat.type}-chat/${chat.id}`} className="w-full rounded">
            <Button variant="ghost" className="flex justify-start p-2 h-full w-full">
                <div className="flex items-center justify-start gap-4">
                    <Avatar>
                        <AvatarImage src={chat.profilePictureUrl} alt={chat.name} />
                    </Avatar>
                    <div className="flex flex-col gap-1">
                        <div className="flex justify-start font-bold text-md text-foreground">{chat.name}</div>
                        <div className="flex justify-start text-sm text-muted-foreground">{displayedDate}</div>
                    </div>
                </div>
            </Button>
        </Link>
    );
}
