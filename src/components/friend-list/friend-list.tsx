import { useFetchFriends } from "@/hooks/useFetchFriends";
import FriendCard from "../friend-card/friend-card";

export default function FriendList({ userId, token }: { userId: number, token: string }) {
    const { friends } = useFetchFriends(userId, token);

    return (
        <div className="flex flex-col gap-2">
            {friends.sort((a, b) => a.username.localeCompare(b.username)).map((friend, index) => <FriendCard key={index} friend={friend} userId={userId} token={token} />)}
        </div>
    );
}
