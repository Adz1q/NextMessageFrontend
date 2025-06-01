import { auth } from "@/lib/auth";
import { Session } from "next-auth";
import Link from "next/link";

export default async function NotFound() {
    const session: Session | null = await auth();

    if (session === null) {
        return (
            <div className="flex flex-col mt-64 gap-6 items-center justify-center">
                <h2 className="text-4xl font-bold">Not found</h2>
                <p className="text-xl">Sorry, the page you are looking for does not exist.</p>
                <Link href="/" className="hover:underline text-xl">Return to homepage</Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col mt-64 gap-6 items-center justify-center">
            <h2 className="text-4xl font-bold">Not found</h2>
            <p className="text-xl">Sorry, the page you are looking for does not exist.</p>
            <Link href="/dashboard" className="hover:underline text-xl">Return to dashboard</Link>
        </div>
    );
}
