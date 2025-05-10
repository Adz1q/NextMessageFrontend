"use client";

import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Search, Users } from "lucide-react";
import { Button } from "../ui/button";
import { getChats, getFriends, getFriendshipRequestsBySenderId, getUsersBySimilarUsername } from "@/lib/api-requests";
import { useEffect, useState } from "react";
import FoundUserCard from "../found-user-card/found-user-card";
import { Session } from "next-auth";

type FoundUser = {
    id: number;
    username: string;
    profilePictureUrl: string;
    date: string;
    allowMessagesFromNonFriends: boolean;
};

type Friend = {
    id: number;
    username: string;
    profilePictureUrl: string;
    friendshipId: number;
    date: string;
};

type Chat = {
    id: number;
    name: string;
    lastUpdated: string;
    profilePictureUrl: string;
    type: string;
};

type FriendshipRequest = {
    id: number;
    senderId: number;
    receiverId: number;
    date: string;
};

const formSchema = z.object({
    username: z.string().min(1, { message: "Type at least one letter" }),
});

export default function SearchCard({ session }: { session: Session }) {
    const [error, setError] = useState("");
    const [foundUsers, setFoundUsers] = useState<FoundUser[] | null>(null);
    const [friends, setFriends] = useState<Friend[]>([]);
    const [chats, setChats] = useState<Chat[]>([]);
    const [friendshipRequests, setFriendshipRequests] = useState<FriendshipRequest[]>([]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
        },
    });

    useEffect(() => {
        const fetchData = async () => {
            const friendsResult = await getFriends(parseInt(session?.user?.id), session?.user?.token);
            const chatsResult = await getChats(session?.user?.id, session?.user?.token);
            const friendshipRequestsResult = await getFriendshipRequestsBySenderId(parseInt(session?.user?.id), session?.user?.token);

            if (!friendsResult.success || !chatsResult.success || !friendshipRequestsResult.success) {
                setError("Failed with fetching friends, chats or friendship requests");
                return;
            }
    
            setFriends(friendsResult.data);
            setChats(chatsResult.data);
            setFriendshipRequests(friendshipRequestsResult.data);
        };

        fetchData();        
    }, [foundUsers, friends, chats, session?.user?.token, session?.user?.id]);

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        const result = await getUsersBySimilarUsername(data.username, session?.user?.token);

        if (!result.success) {
            setError(result.error);
            return;
        }

        setError("");
        setFoundUsers(result.data);
    };

    return (
        <div className="flex flex-col mt-2">
            <div className="flex flex-col items-center text-center mb-8">
                <div className="flex items-center justify-center text-3xl sm:text-4xl gap-3 font-semibold text-foreground mb-2">
                    <Users className="h-8 w-8 text-primary" />
                    <div>Find New Friends</div>
                </div>
                <div className="text-muted-foreground text-sm sm:text-base">
                    Search for users by their username to add them and message.
                </div>
            </div>
            <div className="items-center flex flex-col border-b pb-6">
                <Form {...form}>
                    <form 
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex gap-4 justify-center items-start w-full"
                    >
                        <FormField 
                            control={form.control}
                            name="username"
                            render={({ field }) => {
                                return <FormItem className="flex flex-col w-full max-w-md">
                                    <FormControl>
                                        <Input 
                                            type="text"
                                            placeholder="Username"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-sm"/>
                                </FormItem>
                            }}
                        />
                        <Button> 
                            <Search/>
                            Search
                        </Button>
                    </form>
                </Form>          
            </div>
            <div className="flex flex-col gap-6 p-6">
                {error && <div className="text-2xl w-full text-center">{error}</div>}
                {foundUsers && <div className="flex items-center justify-center gap-3 text-3xl w-full font-500">Search Result <Search /></div>}
                {foundUsers?.map((foundUser) => <FoundUserCard key={foundUser.id} foundUser={foundUser} chats={chats} friends={friends} friendshipRequests={friendshipRequests} session={session}/>)}
            </div>
        </div>
    );
}
