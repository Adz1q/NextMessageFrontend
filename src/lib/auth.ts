import NextAuth, { Session, User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import axios from "axios";
import { getUser } from "./api-requests";
import { JWT } from "next-auth/jwt";

type Token = {
    token: string;
};

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        username: string;
        email: string;
        date: string;
        profilePictureUrl: string;
        allowMessagesFromNonFriends: boolean;
        token: string;
    }
}

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            username: string;
            email: string;
            date: string;
            profilePictureUrl: string;
            allowMessagesFromNonFriends: boolean;
            token: string;
        };
    }

    interface User {
        id?: string; 
        username: string;
        email?: string | null;
        date: string;
        profilePictureUrl: string;
        allowMessagesFromNonFriends: boolean;
        token: string;
    }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                login: { label: "Login", type: "text" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                try {
                    if (credentials === undefined) {
                        throw new Error("You must provide credentials");
                    }

                    const login: string = credentials.login as string;
                    const password: string = credentials.password as string;

                    const api = axios.create({
                        baseURL: "http://localhost:8080/api/v1/user",
                        headers: { "Content-Type": "application/json" },
                    });

                    const loginResponse = await api.post<Token>("/login", { 
                        login: login, 
                        password: password,
                    });

                    if (!loginResponse || !loginResponse.data) {
                        throw new Error(loginResponse.statusText);
                    }

                    const { token } = loginResponse.data;

                    if (!token) {
                        throw new Error("Token not found in response");
                    }

                    const userResponse = await getUser(login, token);

                    if (!userResponse.success) {
                        throw new Error(userResponse.error);
                    }

                    return {
                        id: String(userResponse.data.id),
                        username: userResponse.data.username,
                        email: userResponse.data.email,
                        date: userResponse.data.date,
                        profilePictureUrl: userResponse.data.profilePictureUrl,
                        allowMessagesFromNonFriends: userResponse.data.allowMessagesFromNonFriends,
                        token: token,
                    };
                }
                catch (error: unknown) {
                    console.log(error);
                    return null;
                }
            },
        }),
    ],
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
    },
    callbacks: {
        jwt: async ({ token, user }: { token: JWT, user: User }) => {
            if (user) {
                token.id = user.id as string;
                token.username = user.username;
                token.email = user.email as string;
                token.date = user.date;
                token.profilePictureUrl = user.profilePictureUrl;
                token.allowMessagesFromNonFriends = user.allowMessagesFromNonFriends;
                token.token = user.token;
            }

            return token;
        },
        session: async ({ session, token }: { session: Session, token: JWT }) => {
            session.user = {
                id: token.id,
                username: token.username,
                email: token.email,
                date: token.date,
                profilePictureUrl: token.profilePictureUrl,
                allowMessagesFromNonFriends: token.allowMessagesFromNonFriends,
                token: token.token,
            };

            return session;
        },
    },
    pages: {
        signIn: "/sign-in",
        signOut: "/dashboard",
    },
});
