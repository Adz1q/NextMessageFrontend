"use client"; 

import type React from "react"

import { useState } from "react"
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ShieldCheck, MessageCircle, Save } from "lucide-react"
import { signOut } from "next-auth/react";
import { changeMessagePreferences } from "@/lib/api-requests";

export default function PrivacySettingsCard({ userId, token, propsAllowMessagesFromNonFriends }: {
    userId: number,
    token: string,
    propsAllowMessagesFromNonFriends: boolean
}) {
    const [allowMessagesFromNonFriends, setAllowMessagesFromNonFriends] = useState(propsAllowMessagesFromNonFriends);
    const [hasChanges, setHasChanges] = useState(false);
    const [error, setError] = useState("");

    const handleToggleChange = (checked: boolean) => {
        setAllowMessagesFromNonFriends(checked);
        setHasChanges(h => !h);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()

        if (!hasChanges) return;

        const result = await changeMessagePreferences(userId, allowMessagesFromNonFriends, token);

        if (!result.success) {
            setError("Message preferences are already set to this value");
            return;
        } 

        setError("");
        await signOut({ redirectTo: "/sign-in" });
    };

    return (
        <div>
            <CardHeader className="flex flex-col gap-2">
                <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5" />
                Privacy Settings
                </CardTitle>
                <CardDescription>
                    Control who can interact with you on the platform. This action will trigger a sign out.
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between space-x-2">
                    <div className="space-y-0.5">
                    <Label htmlFor="message-privacy" className="text-base">
                        <span className="flex items-center gap-2">
                        <MessageCircle className="h-4 w-4" />
                        Direct Message Privacy
                        </span>
                    </Label>
                    <p className="text-sm text-muted-foreground">
                        Allow users who are not in your friends list to send you direct messages.
                    </p>
                    </div>
                    <Switch
                        id="message-privacy"
                        checked={allowMessagesFromNonFriends}
                        onCheckedChange={handleToggleChange}
                    />
                </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                {error && <div className="text-red-900">{error}</div>}
                <Button type="submit" disabled={!hasChanges} className="ml-auto">
                    <span className="flex items-center gap-2">
                        <Save className="h-4 w-4" />
                        Save Changes
                    </span>
                </Button>
                </CardFooter>
            </form>
        </div>
    );
}
