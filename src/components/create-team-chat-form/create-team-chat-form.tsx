"use client"; 

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useState } from "react";
import { Input } from "../ui/input";
import { useFetchFriends } from "@/hooks/useFetchFriends";
import { createTeamChat } from "@/lib/api-requests";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { CheckCircle, Loader2, MessageSquarePlus, Users, XCircle } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import SelectFriendCard from "../select-friend-card/select-friend-card";

const formSchema = z.object({
    chatName: z.string()
        .min(1, { message: "Chat name must be between 1 and 16 characters" })
        .max(16, { message: "Chat name must be between 1 and 16 characters" }),
}).refine((data) => {
    return /^[a-zA-Z]/.test(data.chatName);
}, {
    message: "Chat name must start with a letter",
    path: ["chatName"],
});

export default function CreateTeamChatForm({ userId, token }: {
    userId: number,
    token: string,
}) {
    const [selectedFriendIds, setSelectedFriendIds] = useState<Set<number>>(new Set());
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState<{ type: "success" | "error", message: string } | null>(null);

    const { friends } = useFetchFriends(userId, token);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            chatName: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        if (selectedFriendIds.size === 0) {
            setStatus({ type: "error", message: "Please select at least one friend to create a team chat" });
            return;        
        }

        setIsSubmitting(true);
        setStatus(null);

        const memberIds = Array.from(selectedFriendIds);

        const result = await createTeamChat(data.chatName, userId, memberIds, token);

        if (!result.success) {
            setStatus({ type: "error", message: "Failed with creating team chat" });
            return;
        }

        setIsSubmitting(false);
        setStatus({ type: "success", message: "Team chat created successfully" });
        form.reset();
        setSelectedFriendIds(new Set());
    };
    
    return (
        <Card className="w-full max-w-lg mx-auto shadow-2xl mt-12 flex flex-col">
            <CardHeader className="text-center">
                <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-3">
                     <MessageSquarePlus className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl font-bold tracking-tight">Create New Team Chat</CardTitle>
                <CardDescription>
                    Choose a unique name and invite your friends to start collaborating.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <Form {...form}>
                    <form 
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex flex-col gap-8"
                    >
                        <FormField 
                            control={form.control}
                            name="chatName"
                            render={({ field }) => {
                                return <FormItem>
                                    <FormLabel>Chat Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="e.g., Project Team"
                                            className="h-11 text-base focus-visible:ring-primary/80"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            }}
                        />
                        <div className="space-y-3">
                            <FormLabel className="text-sm font-medium">Select Members</FormLabel>
                            {friends.length === 0 && (
                                <p className="text-sm text-muted-foreground py-3 text-center">
                                    You currently have no friends to add.
                                </p>
                            )}
                            {friends.length > 0 && (
                                <ScrollArea className="h-48 w-full rounded-md border p-3 bg-muted/30">
                                    <div className="space-y-3">
                                        {friends.map((friend, index) => (
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
                            Create Chat
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
