"use client"; 

import { useState } from "react"
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, AlertTriangle } from "lucide-react"
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
import { deleteTeamChat } from "@/lib/api-requests";
import { useRouter } from "next/navigation";

type TeamChat = {
    id: number;
    lastUpdated: string;
    name: string,
    profilePictureUrl: string,
    adminId: number;
};

export default function DeleteTeamChat({ chat, userId, token }: {
    chat: TeamChat | null,
    userId: number,
    token: string
}) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    if (chat === null) {
        throw new Error("Failed with fetching chat");
    }

    const handleDeleteChat = async () => {
        const result = await deleteTeamChat(chat.id, userId, token);

        if (!result.success) {
            setError("Invalid password");
            return;
        }

        setError("");
        router.push("/dashboard");
    };

    return (
        <div>
            <CardHeader className="flex flex-col gap-2">
                <CardTitle className="flex items-center gap-2 text-destructive">
                <Trash2 className="h-5 w-5" />
                Delete Chat
                </CardTitle>
                <CardDescription>
                Permanently delete this chat and all associated data. This action cannot be undone.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="rounded-md bg-destructive/10 p-4 border border-destructive/20">
                <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                    <div>
                    <h4 className="font-medium text-destructive">Warning</h4>
                    <p className="text-sm text-destructive/80 mt-1">Deleting the chat will:</p>
                    <ul className="list-disc list-inside text-sm text-destructive/80 mt-2 space-y-1">
                        <li>Permanently remove all chat information</li>
                        <li>Delete all messages</li>
                    </ul>
                    </div>
                </div>
                </div>

            </CardContent>
            <CardFooter>
                <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <div className="flex justify-between items-center"></div>
                        <div className="text-red-900">{error && error}</div>
                        <AlertDialogTrigger asChild>    
                            <Button variant="destructive" className="ml-auto">
                                <span className="flex items-center gap-2">
                                <Trash2 className="h-4 w-4" />
                                Delete Chat
                                </span>
                            </Button>
                        </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. The chat will be permanently deleted along with all data and
                        messages on the platform.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDeleteChat}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        Yes, delete the chat
                    </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
                </AlertDialog>
            </CardFooter>
        </div>
    );
}
