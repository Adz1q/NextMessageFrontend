import TeamChatSettingsCard from "@/components/team-chat-settings-card/team-chat-settings-card";
import { auth } from "@/lib/auth";
import { Metadata } from "next";
import { Session } from "next-auth";

export const metadata: Metadata = {
    title: "Team Chat Setting | NextMessage",
};

export default async function TeamChatSettings({ params }: {
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
        <TeamChatSettingsCard
            chatId={parseInt(id)} 
            userId={parseInt(session?.user?.id)} 
            token={session?.user?.token}
        />
    );
}
