import { MessageCircleMore } from "lucide-react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { createPrivateChat, getPrivateChatByMembers } from "@/lib/api-requests";

type Friend = {
    id: number;
    username: string;
    profilePictureUrl: string;
    friendshipId: number;
    date: string;
}; 

export default function FriendCard({ friend, userId, token }: { 
    friend: Friend, 
    userId: number, 
    token: string 
}) {
    const router = useRouter();

    const handleStartNewConversation = async () => {
            const firstResult = await getPrivateChatByMembers(
                userId,
                friend.id,
                token
            );
    
            if (firstResult.success) {
                const chatId = firstResult.data;
                router.push(`/dashboard/private-chat/${chatId}`);
                return;
            }
    
            const secondResult = await createPrivateChat(
                userId,
                friend.id,
                token
            );
    
            if (!secondResult.success) {
                return;
            }
    
            const chatId = secondResult.data.id;
            router.push(`/dashboard/private-chat/${chatId}`);
    };
    
    return (
        <div className="flex items-center gap-3 p-2 pr-0 w-full">
            <Avatar>
                <AvatarImage src={friend.profilePictureUrl} alt={friend.username} />
            </Avatar>
            <div className="flex justify-between items-center w-full">
                <div className="flex items-center font-bold text-sm text-foreground">  
                    {friend.username} 
                </div>
                <Button onClick={handleStartNewConversation} variant="ghost" size="icon">
                    <MessageCircleMore />
                </Button> 
            </div>
        </div>
    );
}
