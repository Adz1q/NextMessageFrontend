import { auth } from "@/lib/auth";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";

export default async function Home() {
  const session: Session | null = await auth();
  
  return (
      <div>
          <div>{session?.user ? "Logged in" : "Not logged in"}</div>
          <div>{session?.user?.id}</div>
          <div>{session?.user?.username}</div>
          <div>{session?.user?.email}</div>
          <div>{session?.user?.date}</div>
          <div>{session?.user?.profilePictureUrl}</div>
          <div>{session?.user?.allowMessagesFromNonFriends}</div>
          <div>{session?.user?.token}</div>
          {session?.user?.token && 
            <button onClick={signOut}>Logout</button>
          }
      </div>
  );
}