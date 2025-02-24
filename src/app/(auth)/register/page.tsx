import RegisterForm from "@/components/register-form/register-form";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Register | NextMessage",
};

export default function RegisterPage() {
    return <RegisterForm />;
}