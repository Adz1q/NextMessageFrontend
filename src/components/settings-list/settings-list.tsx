"use client"; 

import { KeyRound, Settings, ShieldCheck, Trash2, UserCircle } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card } from "../ui/card";
import ProfileSettingsCard from "../profile-settings-card/profile-settings-card";
import SecuritySettingsCard from "../security-settings-card/security-settings-card";
import PrivacySettingsCard from "../privacy-settings-card/privacy-settings-card";
import DeleteAccountSettingsCard from "../delete-account-settings-card/delete-account-settings-card";

export default function SettingsList({ userId, token, allowMessagesFromNonFriends }: {
    userId: number,
    token: string,
    allowMessagesFromNonFriends: boolean
}) {
    const [activeTab, setActiveTab] = useState("profile")

    return (
        <div className="py-10 flex flex-col items-center">
            <h1 className="text-3xl font-bold mb-6 flex gap-2 items-center justify-center">
                Account Settings 
                <Settings />
            </h1>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col items-center justify-center w-full max-w-md-lg">
                <TabsList className="grid grid-cols-4 mb-8 bg-background">
                    <TabsTrigger value="profile" className="flex items-center gap-2">
                        <UserCircle className="h-4 w-4" />
                        <span className="hidden sm:inline">Profile</span>
                    </TabsTrigger>
                    <TabsTrigger value="security" className="flex items-center gap-2">
                        <KeyRound className="h-4 w-4" />
                        <span className="hidden sm:inline">Security</span>
                    </TabsTrigger>
                    <TabsTrigger value="privacy" className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4" />
                        <span className="hidden sm:inline">Privacy</span>
                    </TabsTrigger>
                    <TabsTrigger value="delete" className="flex items-center gap-2">
                        <Trash2 className="h-4 w-4" />
                        <span className="hidden sm:inline">Delete</span>
                    </TabsTrigger>
                </TabsList>
                <Card>
                    <TabsContent value="profile" className="mt-0">
                        <ProfileSettingsCard userId={userId} token={token} />
                    </TabsContent>
                    <TabsContent value="security" className="mt-0">
                        <SecuritySettingsCard userId={userId} token={token} />
                    </TabsContent>
                    <TabsContent value="privacy" className="mt-0">
                        <PrivacySettingsCard userId={userId} token={token} propsAllowMessagesFromNonFriends={allowMessagesFromNonFriends} />
                    </TabsContent>
                    <TabsContent value="delete" className="mt-0">
                        <DeleteAccountSettingsCard userId={userId} token={token} />
                    </TabsContent>
                </Card>
            </Tabs>
        </div>
    );
}
