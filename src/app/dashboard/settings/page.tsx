import SettingsList from "@/components/settings-list/settings-list";
import { auth } from "@/lib/auth";
import { Metadata } from "next";
import { Session } from "next-auth";

export const metadata: Metadata = {
    title: "Settings | NextMessage",
};

export default async function SettingsPage() {
    const session: Session | null = await auth();

    if (!session?.user?.id || !session?.user?.token) {
        throw new Error("Invalid session");
    }
    
    return <SettingsList userId={parseInt(session?.user?.id)} token={session?.user?.token} allowMessagesFromNonFriends={session?.user?.allowMessagesFromNonFriends}/>;
}
