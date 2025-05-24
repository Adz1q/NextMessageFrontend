import TeamChatCard from "@/components/team-chat-card/team-chat-card";
import { auth } from "@/lib/auth";
import { Metadata } from "next";
import { Session } from "next-auth";

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
        throw new Error("Invalid Session");
    }

    return (
        <TeamChatCard 
            chatId={parseInt(id)} 
            userId={parseInt(session?.user?.id)} 
            username={session?.user?.username}
            token={session?.user?.token}
        />
    );
}
