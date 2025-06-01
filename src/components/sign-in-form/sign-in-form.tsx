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
import { signIn } from "next-auth/react";

const formSchema = z.object({
    login: z.string()
    .min(1, { message: "Email or username cannot be empty" })
    .max(50, { message: "Email or username cannot be longer than 50 characters"}),
    password: z.string()
    .min(1, { message: "Password cannot be empty" })
    .max(32, { message: "Password cannot be longer than 32 characters"}),
});

export default function SignInForm() {
    const [error, setError] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            login: "",
            password: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            const response = await signIn("credentials", {
                redirect: false,
                login: data.login,
                password: data.password,
            });
        
            if (response && response.error) {
                throw new Error("Invalid login or password");
            }

            if (!response || !response.ok) {
                throw new Error("Something went wrong");
            }

            setError("");
            router.push("/dashboard");
        }
        catch (error: unknown) {
            const responseError = error as Error;
            
            console.log(error);
            setError(responseError.message);
        }
    };

    return (
        <div className="flex gap-12 items-center flex-col min-h-screen p-24">
            <div className="flex flex-col justify-center items-center gap-4">
                <div className={"text-4xl font-bold flex items-center justify-center"}>Welcome back</div>
                <div className={"text-lg flex items-center justify-center text-muted-foreground"}>Enter your credentials to access your account</div>
            </div>
            <div className="flex flex-col gap-8 w-full max-w-md">
                <Form {...form}> 
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex flex-col gap-6 max-w-md w-full"
                    >
                        <FormField 
                            control={form.control}
                            name="login"
                            render={({ field }) => {
                                return <FormItem>
                                    <FormLabel className="text-md font-500 text-foreground">
                                        Enter your email or username
                                    </FormLabel>
                                    <FormControl>
                                        <Input 
                                            placeholder="Email or username"
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
                                    <FormLabel className="text-md font-500 text-foreground">
                                        Enter your password
                                    </FormLabel>
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
                                                {showPassword ? <Eye size={20}/> : <EyeOff size={20}/>}
                                            </button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            }}
                        />
                        <Button type="submit" className="w-full">Sign In</Button>
                        {error && <div className="flex justify-center items-center">
                            <div className="text-red-900 font-medium">{error}</div>    
                        </div>}
                    </form>
                </Form>
                <div className="flex justify-center items-center max-w-md w-full">
                    <Link href="/sign-up" className="hover:underline">
                        Don&apos;t have an account? Sign Up
                    </Link>
                </div>
            </div>
        </div>
    );
}
