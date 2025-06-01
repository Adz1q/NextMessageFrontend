import SignUpForm from "@/components/sign-up-form/sign-up-form";
import { auth } from "@/lib/auth";
import { Metadata } from "next";
import { Session } from "next-auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Sign Up | NextMessage",
};

export default async function SignUpPage() {
    const session: Session | null = await auth();

    if (session !== null) {
        redirect("/dashboard");
    }

    return <SignUpForm />;
}
