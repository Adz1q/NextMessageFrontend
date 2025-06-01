"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { DoorOpen, Edit, Settings, Trash2, UserPen, UserPlus } from "lucide-react";
import { Card } from "../ui/card";
import { TabsContent } from "@radix-ui/react-tabs";
import ChangeTeamChatName from "../change-team-chat-name/change-team-chat-name";
import { useTeamChatSettings } from "@/hooks/useTeamChatSettings";
import DeleteTeamChat from "../delete-team-chat/delete-team-chat";
import ChatMembers from "../chat-members/chat-members";
import LeaveTeamChat from "../leave-team-chat/leave-team-chat";
import AddTeamChatMembers from "../add-team-chat-members/add-team-chat-members";

export default function TeamChatSettingsCard({ 
    chatId,
    userId,
    token
}: {
    chatId: number,
    userId: number,
    token: string,
}) {
    const [activeTab, setActiveTab] = useState("manageMembers");

    const { 
        chat, 
        error,
    } = useTeamChatSettings(chatId, userId, token);

    return (
        <div className="py-10 flex flex-col items-center">
            <h1 className="text-3xl font-bold mb-6 flex gap-2 items-center justify-center">
                Team Chat Settings
                <Settings />
            </h1>
            {error && <h3 className="text-red-900 pb-4 text-lg">{error}</h3>}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col items-center  w-full max-w-md-lg">
                <TabsList className="flex mb-8 bg-background justify-center">
                    <TabsTrigger value="manageMembers" className="flex items-center gap-2">
                        <UserPen className="h-4 w-4" />
                        <span className="hidden sm:inline">Chat Members</span>
                    </TabsTrigger>
                    <TabsTrigger value="addMembers" className="flex items-center gap-2">
                        <UserPlus className="h-4 w-4" />
                        <span className="hidden sm:inline">Add Members</span>
                    </TabsTrigger>
                    <TabsTrigger value="leaveChat" className="flex items-center gap-2">
                        <DoorOpen className="h-4 w-4" />
                        <span className="hidden sm:inline">Leave Chat</span>
                    </TabsTrigger>
                    {chat?.adminId === userId && <TabsTrigger value="changeName" className="flex items-center gap-2">
                        <Edit className="h-4 w-4" />
                        <span className="hidden sm:inline">Chat Name</span>
                    </TabsTrigger>}
                    {chat?.adminId === userId && <TabsTrigger value="deleteChat" className="flex items-center gap-2">
                        <Trash2 className="h-4 w-4" />
                        <span className="hidden sm:inline">Delete Chat</span>
                    </TabsTrigger>}
                </TabsList>
                <Card>
                    <TabsContent value="changeName" className="mt-0">
                        <ChangeTeamChatName userId={userId} token={token} chatId={chatId}/>
                    </TabsContent>
                    <TabsContent value="addMembers" className="mt-0">
                        <AddTeamChatMembers chatId={chatId} userId={userId} token={token}/>
                    </TabsContent>
                    <TabsContent value="manageMembers" className="mt-0">
                        {chat && <ChatMembers chat={chat} userId={userId} token={token}/>}
                    </TabsContent>
                    <TabsContent value="leaveChat" className="mt-0">
                        <LeaveTeamChat chatId={chatId} userId={userId} token={token}/>
                    </TabsContent>
                    <TabsContent value="deleteChat" className="mt-0">
                        <DeleteTeamChat chat={chat} userId={userId} token={token}/>
                    </TabsContent>
                </Card>
            </Tabs>
        </div>
    );
}
