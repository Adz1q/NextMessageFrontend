import CreateTeamChatForm from "@/components/create-team-chat-form/create-team-chat-form";
import { auth } from "@/lib/auth";
import { Metadata } from "next";
import { Session } from "next-auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Create Team Chat | NextMessage",
};

export default async function CreateTeamChatPage() {
    const session: Session | null = await auth();
    
    if (session === null) {
        redirect("/");
    }

    return <CreateTeamChatForm 
        userId={parseInt(session?.user?.id)} 
        token={session?.user?.token} 
    />;
}
