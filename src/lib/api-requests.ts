import axios, { AxiosError } from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/api/v1",
    headers: {
        "Content-Type": "application/json",
    },
});

type ApiResponse<T> = { success: true; data: T; } | { success: false; error: string; }; 

type User = {
    id: number;
    username: string;
    email: string;
    password: string;
    profilePictureUrl: string;
    date: string;
    allowMessagesFromNonFriends: boolean;
};

type Chat = {
    id: number;
    name: string;
    lastUpdated: string;
    profilePictureUrl: string;
    type: string;
};

type ChatMember = {
    id: number;
    username: string;
    profilePictureUrl: string;
    date: string;
    isFriend: boolean;
}

export const getUser = async (login: string, token: string): Promise<ApiResponse<User>> => {
    try {
        const response = await api.get<User>(`/user/get/${login}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return {
            success: true,
            data: response.data,
        };
    }
    catch (error: unknown) {
        const responseError = error as AxiosError;

        return {
            success: false,
            error: responseError.message,
        };
    } 
};

export const getChats = async (userId: string, token: string): Promise<ApiResponse<Chat[]>> => {
    try {
        const response = await api.get<Chat[]>(`/chat/getAll/${parseInt(userId)}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return {
            success: true,
            data: response.data,
        }
    }
    catch (error: unknown) {
        const responseError = error as AxiosError;

        return {
            success: false,
            error: responseError.message,
        }
    }
};

export const getPrivateChatMember = async (chatId: number, userId: number, token: string): Promise<ApiResponse<ChatMember>> => {
    try {
        const response = await api.get<ChatMember>(`/chat/get/${chatId}/otherMember?userId=${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return {
            success: true,
            data: response.data,
        }
    }
    catch (error: unknown) {
        const responseError = error as AxiosError;

        return {
            success: false,
            error: responseError.message,
        }
    }
};
