import TeamChatCard from "@/components/team-chat-card/team-chat-card";
import { isMemberOfChat } from "@/lib/api-requests";
import { auth } from "@/lib/auth";
import { Metadata } from "next";
import { Session } from "next-auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Team Chat | NextMessage",
};

export default async function TeamChatPage({ params }: {
    params: {
        id: string;
    }
}) {
    const { id } = await params;
    const session: Session | null = await auth();

    if (!session || !session?.user) {
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

    return <TeamChatCard 
        chatId={parseInt(id)} 
        userId={parseInt(session?.user?.id)} 
        username={session?.user?.username}
        token={session?.user?.token}
    />;
}
