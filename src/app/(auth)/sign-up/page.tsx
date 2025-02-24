import SignUpForm from "@/components/sign-up-form/sign-up-form";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign Up | NextMessage",
};

export default function SignUpPage() {
    return <SignUpForm />;
}