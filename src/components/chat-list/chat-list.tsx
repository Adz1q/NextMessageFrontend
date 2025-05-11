import { useFetchChats } from "@/hooks/useFetchChats";
import { Session } from "next-auth";
import ChatCard from "../chat-card/chat-card";

export default function ChatList({ session }: { session: Session | null }) {
    const { chats } = useFetchChats(session);

    return (
        <div className={"flex flex-col items-center gap-2"}>
            {chats?.sort((a, b) => {
                const dateOne = new Date(a.lastUpdated).getTime();
                const dateTwo = new Date(b.lastUpdated).getTime();
                
                return dateTwo - dateOne;  
            }).map((chat) => <ChatCard key={chat.id} chat={chat} />)}
        </div>
    ); 
}
