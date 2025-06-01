"use client"; 

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signUp } from "@/lib/actions";
import { signIn } from "next-auth/react";

const formSchema = z.object({
    username: z.string()
        .min(4, { message: "Username must be between 4 and 12 characters" })
        .max(12, { message: "Username must be between 4 and 12 characters" }),
    email: z.string()
        .min(4, { message: "Email must be between 4 and 50 characters" })
        .max(50, { message: "Email must be between 4 and 50 characters" }),
    password: z.string()
        .min(5, { message: "Password must be between 5 and 32 characters" })
        .max(32, { message: "Password must be between 5 and 32 characters" }),
    confirmPassword: z.string()
        .min(5, { message: "Password must be between 5 and 32 characters" })
        .max(32, { message: "Password must be between 5 and 32 characters" }),
}).refine((data) => {
    return /^[a-zA-Z]/.test(data.username);
}, {
    message: "Username must start with a letter",
    path: ["username"],
}).refine((data) => {
    return data.password === data.confirmPassword;
}, {
    message: "Passwords do not match",
    path: ["confirmPassword"], 
});


export default function SignUpForm() {
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        const registerResponse = await signUp(data.username, data.email, data.password);

        if (!registerResponse.success) {
            setError(registerResponse.error);
            return;
        }

        try {
            const loginResponse = await signIn("credentials", {
                redirect: false,
                login: data.email,
                password: data.password,
            });

            if (!loginResponse || !loginResponse.ok) {
                throw new Error("Something went wrong with auto-login, please sign in manually");
            }

            setError("");
            router.push("/dashboard");
        }
        catch (error: unknown) {
            const responseError = error as Error;

            console.log(responseError);
            setSuccess("Account created, please sign in to continue");
            router.push("/sign-in");
        }
    };

    return (
        <div className="flex gap-12 items-center flex-col min-h-screen p-24">
            <div className="flex flex-col justify-center items-center gap-4">
                <div className={"text-4xl font-bold flex items-center justify-center"}>
                    Welcome
                </div>
                <div className={"text-lg flex items-center justify-center text-muted-foreground"}>
                    Enter your credentials to register your account
                </div>
            </div>
            <div className="max-w-md w-full flex flex-col gap-8">
                <Form {...form}>
                    <form 
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="max-w-md w-full flex flex-col gap-6"
                    >
                        <FormField 
                            control={form.control}
                            name="username"
                            render={({ field }) => {
                                return <FormItem>
                                    <FormLabel className="text-md font-500 text-foreground">Enter your username</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            placeholder="Username"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            }}
                        />
                        <FormField 
                            control={form.control}
                            name="email"
                            render={({ field }) => {
                                return <FormItem>
                                    <FormLabel className="text-md font-500 text-foreground">Enter your email</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="Email"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            }}
                        />
                        <FormField 
                            control={form.control}
                            name="password"
                            render={({ field }) => {
                                return <FormItem>
                                    <FormLabel className="text-md font-500 text-foreground">Enter your password</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Password"
                                                {...field}
                                            />
                                            <button 
                                                type="button"
                                                onClick={() => setShowPassword(s => !s)}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground hover:text-muted-foreground"
                                            >
                                                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                                            </button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            }}
                        />
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => {
                                return <FormItem>
                                    <FormLabel className="text-md font-500 text-foreground">Confirm your password</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type={showConfirmPassword ? "text" : "password"}
                                                placeholder="Confirm password"
                                                {...field}
                                            />
                                            <button 
                                                type="button"
                                                onClick={() => setShowConfirmPassword(s => !s)}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground hover:text-muted-foreground"
                                            >
                                                {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                                            </button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            }}
                        />
                        <Button type="submit" className="w-full">Sign Up</Button>
                        {error && <div className="flex justify-center items-center">
                            <div className="text-red-900 font-medium">{error}</div>
                        </div>}
                        {success && <div className="flex justify-center items-center">
                            <div className="text-green-700 font-medium">{success}</div>
                        </div>}
                    </form>
                </Form>
                <div className={"flex justify-center items-center max-w-md w-full"}>
                    <Link href="/sign-in" className="hover:underline">Already have an account? Sign In</Link>
                </div>
            </div>
        </div>
    );
}
