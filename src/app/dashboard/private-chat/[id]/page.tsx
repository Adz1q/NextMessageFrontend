import PrivateChatCard from "@/components/private-chat-card/private-chat-card";
import { getPrivateChatMember } from "@/lib/api-requests";
import { auth } from "@/lib/auth";
import { Session } from "next-auth";

export default async function PrivateChatPage({ params }: {
    params: {
        id: string;
    }
}) {
    const session: Session | null = await auth(); 

    if (!session?.user?.id || !session?.user?.token) {
        throw new Error("Invalid session");
    }

    const { id } = await params;
    const otherMember = await getPrivateChatMember(parseInt(id), parseInt(session?.user?.id), session?.user?.token);

    if (!otherMember.success) {
        throw new Error(otherMember.error);
    }

    return (
        <PrivateChatCard chatId={parseInt(id)} otherMember={otherMember.data} token={session?.user?.token} userId={parseInt(session?.user?.id)} />
    );
}