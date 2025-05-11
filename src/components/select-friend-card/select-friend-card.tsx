"use client"; 

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { UserMinus, UserPlus } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

type Friend = {
    id: number;
    username: string;
    profilePictureUrl: string;
    friendshipId: number;
    date: string;
};

export default function SelectFriendCard({
    selectedFriendIds,
    setSelectedFriendIds,
    friend,
}: {
    selectedFriendIds: Set<number>;
    setSelectedFriendIds: Dispatch<SetStateAction<Set<number>>>;
    friend: Friend;
}) {
    const handleToggleFriendSelection = () => {
        setSelectedFriendIds((prevState: Set<number>) => {
            const selected = new Set(prevState);
    
            if (!selected.has(friend.id)) {
                selected.add(friend.id);
                return selected;
            }
    
            selected.delete(friend.id);
            return selected;
        });
    };

    const getAvatarFallback = (username: string) => {
        return username?.substring(0, 2)?.toUpperCase() || "??";
    };

    return (
        <div
            className={cn(
            "flex items-center justify-between p-2.5 rounded-md transition-colors cursor-pointer hover:bg-accent",
            selectedFriendIds.has(friend.id) && "bg-primary/10 hover:bg-primary/20"
            )}
            onClick={() => handleToggleFriendSelection()}
        >
            <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                    <AvatarImage src={friend.profilePictureUrl} alt={friend.username} />
                    <AvatarFallback>{getAvatarFallback(friend.username)}</AvatarFallback>
                </Avatar>
                <span
                    className={cn(
                    "font-medium text-sm",
                    selectedFriendIds.has(friend.id) && "text-primary"
                    )}
                > {/* cn makes that there can be js code and you don't need to write it in a single line*/}
                {friend.username}
            </span>
            </div>
            <Button
                type="button"
                variant={selectedFriendIds.has(friend.id) ? "destructive" : "outline"}
                size="sm"
                className="px-2.5 py-1 h-auto text-xs"
                onClick={(e) => {
                    e.stopPropagation();
                    handleToggleFriendSelection();
                }}
            >
                {selectedFriendIds.has(friend.id) ? (
                    <UserMinus className="h-3.5 w-3.5 mr-1.5" />
                ) : (
                    <UserPlus className="h-3.5 w-3.5 mr-1.5" />
                )}
                {selectedFriendIds.has(friend.id) ? "Remove" : "Add"}
            </Button>
        </div>
    );
}
