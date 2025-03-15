import Link from "next/link";
import { Avatar, AvatarImage } from "../ui/avatar";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

type Chat = {
    id: number;
    name: string;
    lastUpdated: string;
    profilePictureUrl: string;
    type: string;
};

export default function ChatCard({ chat }: {
    chat: Chat;
}) {
    const [displayedDate, setDisplayedDate] = useState<string>("");

    useEffect(() => {
        const today = new Date();
        const lastUpdated = new Date(chat.lastUpdated);
        const month = lastUpdated.getMonth();
        let nameOfMonth = "";

        switch (month) {
            case 0:
                nameOfMonth = "Jan";
                break;
            case 1:
                nameOfMonth = "Feb";
                break;
            case 2:
                nameOfMonth = "Mar";
                break;
            case 3:
                nameOfMonth = "Apr";
                break;
            case 4:
                nameOfMonth = "May";
                break;
            case 5:
                nameOfMonth = "Jun";
                break;
            case 6:
                nameOfMonth = "Jul";
                break;
            case 7:
                nameOfMonth = "Aug";
                break;
            case 8:
                nameOfMonth = "Sept";
                break;
            case 9:
                nameOfMonth = "Oct";
                break;
            case 10:
                nameOfMonth = "Nov";
                break;
            case 11:
                nameOfMonth = "Dec";
                break;
            default:
                nameOfMonth = "Invalid month";
        }

        if (
            today.getDate() === lastUpdated.getDate()
            &&
            today.getMonth() === lastUpdated.getMonth()
            &&
            today.getFullYear() === lastUpdated.getFullYear()
        ) {
            const hours: string = lastUpdated.getHours() < 10 ? `0${lastUpdated.getHours()}` : `${lastUpdated.getHours()}`;
            const minutes: string = lastUpdated.getMinutes() < 10 ? `0${lastUpdated.getMinutes()}` : `${lastUpdated.getMinutes()}`;

            setDisplayedDate(`${hours}:${minutes}`);
        }
        else if (
            (today.getDate() !== lastUpdated.getDate() || today.getMonth() !== lastUpdated.getMonth())
            &&
            today.getFullYear() === lastUpdated.getFullYear()
        ) {
            const hours: string = lastUpdated.getHours() < 10 ? `0${lastUpdated.getHours()}` : `${lastUpdated.getHours()}`;
            const minutes: string = lastUpdated.getMinutes() < 10 ? `0${lastUpdated.getMinutes()}` : `${lastUpdated.getMinutes()}`;

            setDisplayedDate(`${lastUpdated.getDate()} ${nameOfMonth} ${hours}:${minutes}`);
        }
        else if (today.getFullYear() !== lastUpdated.getFullYear()) {
            setDisplayedDate(`${lastUpdated.getDate()} ${nameOfMonth} ${lastUpdated.getFullYear()}`);
        }
    }, []);

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
