import SearchCard from "@/components/search-card/search-card";
import { auth } from "@/lib/auth";
import { Session } from "next-auth";

export default async function DashboardPage() {
    const session: Session | null = await auth();

    if (!session?.user?.id || !session?.user?.token) {
        throw new Error("Invalid session");
    }

    return (
        <SearchCard session={session} />
    );
}
