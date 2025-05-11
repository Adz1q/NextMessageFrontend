"use client"; 

import type React from "react"

import { useState } from "react"
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { KeyRound, Save, EyeOff, Eye } from "lucide-react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { changePassword } from "@/lib/api-requests"
import { signOut } from "next-auth/react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"

const formSchema = z.object({
    currentPassword: z.string()
        .min(5, { message: "Password must be between 5 and 32 characters" })
        .max(32, { message: "Password must be between 5 and 32 characters" }),
    newPassword: z.string()
        .min(5, { message: "Password must be between 5 and 32 characters" })
        .max(32, { message: "Password must be between 5 and 32 characters" }),
    confirmNewPassword: z.string()
        .min(5, { message: "Password must be between 5 and 32 characters" })
        .max(32, { message: "Password must be between 5 and 32 characters" }),
}).refine((data) => {
    return data.currentPassword !== data.newPassword;
}, {
    message: "New password cannot be the same as the old one",
    path: ["newPassword"],
}).refine((data) => {
    return data.newPassword == data.confirmNewPassword;
}, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"], 
});

export default function SecuritySettingsCard({ userId, token }: {
    userId: number,
    token: string
}) {
    const [error, setError] = useState("");
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        const result = await changePassword(userId, data.currentPassword, data.newPassword, token);

        if (!result.success) {
            setError("Invalid password");
            return;
        }
        
        setError("");
        await signOut({ redirectTo: "/sign-in" });
    };

    return (
        <div>
            <CardHeader className="flex flex-col gap-2">
                <CardTitle className="flex items-center gap-2">
                <KeyRound className="h-5 w-5" />
                Security Settings
                </CardTitle>
                <CardDescription>
                    Update your password to keep your account secure.
                    This action will trigger a sign out.
                </CardDescription>
            </CardHeader>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className=""
                >
                    <CardContent className="space-y-4">
                        <FormField
                            control={form.control}
                            name="currentPassword"
                            render={({ field }) => {
                                return <FormItem>
                                    <FormLabel className="text-md font-500 text-foreground">Enter your password</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type={showCurrentPassword ? "text" : "password"}
                                                placeholder="Enter your current password"
                                                {...field}
                                            />
                                            <button 
                                                type="button"
                                                onClick={() => setShowCurrentPassword(s => !s)}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground hover:text-muted-foreground"
                                            >
                                                {showCurrentPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                                            </button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            }}
                        />
                        <FormField
                            control={form.control}
                            name="newPassword"
                            render={({ field }) => {
                                return <FormItem>
                                    <FormLabel className="text-md font-500 text-foreground">Enter your password</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type={showNewPassword ? "text" : "password"}
                                                placeholder="Enter your new password"
                                                {...field}
                                            />
                                            <button 
                                                type="button"
                                                onClick={() => setShowNewPassword(s => !s)}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground hover:text-muted-foreground"
                                            >
                                                {showNewPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                                            </button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            }}
                        /> 
                        <FormField
                            control={form.control}
                            name="confirmNewPassword"
                            render={({ field }) => {
                                return <FormItem>
                                    <FormLabel className="text-md font-500 text-foreground">Enter your password</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type={showConfirmNewPassword ? "text" : "password"}
                                                placeholder="Confirm your new password"
                                                {...field}
                                            />
                                            <button 
                                                type="button"
                                                onClick={() => setShowConfirmNewPassword(s => !s)}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground hover:text-muted-foreground"
                                            >
                                                {showConfirmNewPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                                            </button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            }}
                        />   
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        {error && <div className="text-red-900">{error}</div>}
                        <Button
                            type="submit"
                            disabled={!form.watch("currentPassword")?.trim() || !form.watch("newPassword")?.trim() || !form.watch("confirmNewPassword")?.trim()}
                            className="ml-auto"
                        >
                            <span className="flex items-center gap-2">
                                <Save className="h-4 w-4" />
                                Update Password
                            </span>
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </div>
    );
}
