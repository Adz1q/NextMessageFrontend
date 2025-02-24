import LoginForm from "@/components/login-form/login-form";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Login | NextMessage",
};

export default function LoginPage() {
    return (
        <LoginForm />
    );
}