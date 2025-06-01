"use client"; 

import { useState } from "react"
import { CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DoorOpen } from "lucide-react"
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
import { leaveTeamChat } from "@/lib/api-requests";
import { useRouter } from "next/navigation";

export default function LeaveTeamChat({ chatId, userId, token }: {
    chatId: number,
    userId: number,
    token: string
}) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLeaveChat = async () => {
        const result = await leaveTeamChat(chatId, userId, token);

        if (!result.success) {
            setError("Failed with leaving chat");
            return;
        }

        setError("");
        router.push("/dashboard");
    };

    return (
        <div>
            <CardHeader className="flex flex-col gap-2">
                <CardTitle className="flex items-center gap-2 text-destructive">
                    <DoorOpen className="h-5 w-5" />
                        Leave Chat
                    </CardTitle>
                <CardDescription>
                    Leaving a chat is an action that cannot be undone.
                </CardDescription>
            </CardHeader>
            <CardFooter>
                <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <div className="flex justify-between items-center"></div>
                        <div className="text-red-900">{error && error}</div>
                        <AlertDialogTrigger asChild>    
                            <Button variant="destructive" className="ml-auto">
                                <span className="flex items-center gap-2">
                                <DoorOpen className="h-4 w-4" />
                                Leave Chat
                                </span>
                            </Button>
                        </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. The chat will be deleted from your chat list.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleLeaveChat}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        Yes, leave the chat
                    </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
                </AlertDialog>
            </CardFooter>
        </div>
    );
}
