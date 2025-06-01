"use client"; 

import { CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { CheckCircle, Loader2, MessageSquarePlus, Users, XCircle } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import SelectFriendCard from "../select-friend-card/select-friend-card";
import { useAddTeamChatMembers } from "@/hooks/useAddTeamChatMembers";
import { useTeamChatMembers } from "@/hooks/useTeamChatMembers";
import { useFetchFriends } from "@/hooks/useFetchFriends";

export default function AddTeamChatMembers({ chatId, userId, token }: {
    chatId: number,
    userId: number,
    token: string,
}) {
    const { members } = useTeamChatMembers(chatId, userId, token);
    const { friends } = useFetchFriends(userId, token);
    const { 
        selectedFriendIds, 
        setSelectedFriendIds, 
        handleAddTeamChatMembers,
        status,
        isSubmitting,
        notAddedFriends,
    } = useAddTeamChatMembers(chatId, userId, token, members, friends);
      
    return (
        <div className="w-full max-w-lg mx-auto shadow-2xl flex flex-col">
            <CardHeader className="text-center">
                <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-3">
                     <MessageSquarePlus className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl font-bold tracking-tight">Add More Chat Members</CardTitle>
                <CardDescription>
                    Invite your friends who are not already in your team chat to start collaborating.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <form onSubmit={handleAddTeamChatMembers} className="flex flex-col gap-8">
                        <div className="space-y-3">
                            <div className="text-sm font-medium">Select members to add</div>
                            {notAddedFriends.length === 0 && (
                                <p className="text-sm text-muted-foreground py-3 text-center">
                                    You currently have no friends to add.
                                </p>
                            )}
                            {notAddedFriends.length > 0 && (
                                <ScrollArea className="h-48 w-full rounded-md border p-3 bg-muted/30">
                                    <div className="space-y-3">
                                        {notAddedFriends.map((friend, index) => (
                                            <SelectFriendCard 
                                                key={index} 
                                                selectedFriendIds={selectedFriendIds} 
                                                setSelectedFriendIds={setSelectedFriendIds}
                                                friend={friend} 
                                            />
                                        ))}
                                    </div>
                                </ScrollArea>
                            )}
                            {selectedFriendIds.size > 0 && (
                                <div className="text-xs text-muted-foreground pt-1">
                                    Selected members: {selectedFriendIds.size}
                                </div>
                            )}
                        </div>
                        {status && (
                            <div className={cn(         
                                "p-3 rounded-md text-sm",
                                status.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                            )}> {/* cn makes that there can be js code and you don't need to write it in a single line*/}
                                {status.type === "success" ? <CheckCircle className="inline h-4 w-4 mr-2" /> : <XCircle className="inline h-4 w-4 mr-2" />}
                                {status.message}
                            </div>
                        )}
                        <Button type="submit" className="w-full h-11 text-base bg-primary hover:bg-primary/90" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            ) : (
                                <Users className="mr-2 h-5 w-5" />
                            )}
                            Add members
                        </Button>
                </form>
            </CardContent>
        </div>
    );
}
