import SignInForm from "@/components/sign-in-form/sign-in-form";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign In | NextMessage",
};

export default function SignInPage() {
    return (
        <SignInForm />
    );
}