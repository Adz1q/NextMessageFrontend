"use client"; 

import { useState } from "react"
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2, AlertTriangle, EyeOff, Eye } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { deleteAccount } from "@/lib/api-requests"
import { signOut } from "next-auth/react";

export default function DeleteAccount({ userId, token }: {
    userId: number,
    token: string
}) {
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [error, setError] = useState("");

    const handleDeleteAccount = async () => {
        const result = await deleteAccount(userId, password, token);

        if (!result.success) {
            setError("Invalid password");
            return;
        }

        setError("");
        await signOut({ redirectTo: "/" });
    };

    return (
        <div>
            <CardHeader className="flex flex-col gap-2">
                <CardTitle className="flex items-center gap-2 text-destructive">
                <Trash2 className="h-5 w-5" />
                Delete Account
                </CardTitle>
                <CardDescription>
                Permanently delete your account and all associated data. This action cannot be undone.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="rounded-md bg-destructive/10 p-4 border border-destructive/20">
                <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                    <div>
                    <h4 className="font-medium text-destructive">Warning</h4>
                    <p className="text-sm text-destructive/80 mt-1">Deleting your account will:</p>
                    <ul className="list-disc list-inside text-sm text-destructive/80 mt-2 space-y-1">
                        <li>Permanently remove all your personal information</li>
                        <li>Delete all your messages and conversations</li>
                        <li>Remove you from all friend lists</li>
                        <li>Cancel any active subscriptions</li>
                    </ul>
                    </div>
                </div>
                </div>
                <div className="space-y-2">
                <Label htmlFor="delete-password">Confirm Password</Label>
                <div className="relative">
                    <Input
                    id="delete-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password to confirm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    />
                    <button 
                        type="button"
                        onClick={() => setShowPassword(s => !s)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground hover:text-muted-foreground"
                    >
                        {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                </div>
                </div>
            </CardContent>
            <CardFooter>
                <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <div className="flex justify-between items-center"></div>
                        <div className="text-red-900">{error && error}</div>
                        <AlertDialogTrigger asChild>    
                            <Button variant="destructive" disabled={!password} className="ml-auto">
                                <span className="flex items-center gap-2">
                                <Trash2 className="h-4 w-4" />
                                Delete Account
                                </span>
                            </Button>
                        </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. Your account will be permanently deleted along with all your data,
                        messages, and relationships on the platform.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDeleteAccount}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        Yes, delete my account
                    </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
                </AlertDialog>
            </CardFooter>
        </div>
    );
}
