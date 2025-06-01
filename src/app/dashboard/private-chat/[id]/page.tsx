import PrivateChatCard from "@/components/private-chat-card/private-chat-card";
import { getPrivateChatMember, isMemberOfChat } from "@/lib/api-requests";
import { auth } from "@/lib/auth";
import { Metadata } from "next";
import { Session } from "next-auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Private Chat | NextMessage",
};

export default async function PrivateChatPage({ params }: {
    params: {
        id: string;
    }
}) {
    const { id } = await params;
    const session: Session | null = await auth(); 

    if (!session?.user?.id || !session?.user?.token) {
        redirect("/");
    }

    const isMember = await isMemberOfChat(
        parseInt(id),
        parseInt(session?.user?.id),
        session?.user?.token
    );

    if (!isMember.success) {
        throw new Error("Cannot resolve if the user is a member of this chat");
    }

    if (!isMember.data) {
        redirect("/dashboard");
    }

    const otherMember = await getPrivateChatMember(
        parseInt(id), 
        parseInt(session?.user?.id), 
        session?.user?.token
    );

    if (!otherMember.success) {
        throw new Error("Cannot fetch the second user");
    }    
    
    return <PrivateChatCard 
        chatId={parseInt(id)} 
        username={session?.user?.username} 
        otherMember={otherMember.data} 
        token={session?.user?.token} 
        userId={parseInt(session?.user?.id)} 
    />;
}
