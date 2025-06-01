import SignInForm from "@/components/sign-in-form/sign-in-form";
import { auth } from "@/lib/auth";
import { Metadata } from "next";
import { Session } from "next-auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Sign In | NextMessage",
};

export default async function SignInPage() {
    const session: Session | null = await auth();

    if (session !== null) {
        redirect("/dashboard");
    }

    return <SignInForm />;
}
