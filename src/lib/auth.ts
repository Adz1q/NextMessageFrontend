import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import axios from "axios";
import { getUser } from "./actions";

type Credentials = {
    login: string;
    password: string;
}

type Token = {
    token: string;
}

type User = {
    id: number;
    username: string;
    email: string;
    password: string;
    profilePictureUrl: string;
    date: string;
    allowMessagesFromNonFriends: boolean;
}

type UserToken = User & Token; 

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Github,
        Credentials({
            credentials: {
                login: { label: "Login", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize({ login, password }: Credentials) {
                try {
                    const api = axios.create({
                        baseURL: "http://localhost:3000/api/v1/user",
                        headers: { "Content-Type": "application/json" },
                    });

                    const response = await api.post<Token>("/login", { 
                        login: login, 
                        password: password, 
                    });

                    if (!response || !response.data) {
                        throw new Error(response.statusText);
                    }

                    const { token } = response.data;
                    const user = await getUser(login, response.data.token);

                    if (!user.success) {
                        throw new Error(user.error);
                    }

                    if (token) {
                        return {
                            id: user.data.id,
                            username: user.username,
                            email: user.email,
                            profilePictureUrl: user.profilePictureUrl,
                            token: token,
                        };
                    }

                    return null;
                }
                catch (error) {
                    console.log(error);
                    return null;
                }
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }: { token: UserToken, user: UserToken }) {
            if (user) {
                token.id = user.id;
                token.username = user.username;
                token.token = user.token;
            }

            return token;
        },
        async session({ session, token }) {
            session.token = token.accessToken;
            session.username = token.username;
            session.userId = token.id;
            
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
});