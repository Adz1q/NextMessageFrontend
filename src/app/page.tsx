import LandingPage from "@/components/landing-page/landing-page";
import { auth } from "@/lib/auth";
import { Metadata } from "next";
import { Session } from "next-auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "NextMessage | Homepage",
  description: "Best messaging and video call app in the world!",
};

export default async function HomePage() {
    const session: Session | null = await auth();

    if (session !== null) {
        redirect("/dashboard");
    }

    return <LandingPage />;
}
