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

type TMessage = {
    id: number;
    chatId: number;
    senderId: number;
    senderUsername: string;
    content: string;
    date: string;
};

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

type FriendshipRequest = {
    id: number;
    senderId: number;
    receiverId: number;
    date: string;
};

type PrivateChat = {
    id: number;
    lastUpdated: string;
};

type TeamChat = {
    id: number;
    lastUpdated: string;
    name: string,
    profilePictureUrl: string,
    adminId: number;
};

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

export const getPrivateChatMember = async (chatId: number, userId: number, token: string): Promise<ApiResponse<ChatMember>> => {
    try {
        const response = await api.get<ChatMember>(`/chat/get/${chatId}/otherMember?userId=${userId}`, {
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

export const getMessages = async (chatId: number, userId: number, offset: number, limit: number, token: string): Promise<ApiResponse<TMessage[]>> => {
    try {
        const response = await api.get<TMessage[]>(`/chat/get/${chatId}/messages?userId=${userId}&offset=${offset}&limit=${limit}`, {
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

export const getUsersBySimilarUsername = async (username: string, token: string): Promise<ApiResponse<FoundUser[]>> => {
    try {
        const response = await api.get<FoundUser[]>(`/user/search/${username}`, {
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

export const getFriends = async (userId: number, token: string): Promise<ApiResponse<Friend[]>> => {
    try {
        const response = await api.get(`/friendship/getAll/${userId}`, {
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

export const getFriendshipRequestsBySenderId = async (senderId: number, token: string): Promise<ApiResponse<FriendshipRequest[]>> => {
    try {
        const response = await api.get<FriendshipRequest[]>(`/friendshipRequest/getAllBySenderId/${senderId}`, {
            headers: { Authorization: `Bearer ${token}`},
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

export const sendFriendshipRequest = async (senderId: number, receiverId: number, token: string): Promise<ApiResponse<null>> => {
    try {
        const DTO = {
            senderId: senderId,
            receiverId: receiverId,
        };

        const response = await api.post("/friendshipRequest/send", DTO, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status !== 200) {
            throw new Error(response.statusText);
        }

        return {
            success: true,
            data: null,
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

export const getPrivateChatByMembers = async (firstUserId: number, secondUserId: number, token: string): Promise<ApiResponse<number>> => {
    try {
        const response = await api.get<number>(`/chat/get/${firstUserId}/${secondUserId}`, {
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

export const createPrivateChat = async (senderId: number, receiverId: number, token: string): Promise<ApiResponse<PrivateChat>> => {
    try {
        const DTO = {
            senderId: senderId,
            receiverId: receiverId,
        };

        const response = await api.post<PrivateChat>("/chat/create/private", DTO, {
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

export const removeFriend = async (friendshipId: number, token: string): Promise<ApiResponse<null>> => {
    try {
        const response = await api.delete(`/friendship/remove/${friendshipId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status !== 200) {
            throw new Error(response.statusText);
        }

        return {
            success: true,
            data: null,
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

export const acceptFriendshipRequest = async (senderId: number, receiverId: number, token: string): Promise<ApiResponse<null>> => {
    try {
        const DTO = {
            senderId: senderId,
            receiverId: receiverId,
        };

        const response = await api.post("/friendshipRequest/accept", DTO, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status !== 200) {
            throw new Error(response.statusText);
        }

        return {
            success: true,
            data: null,
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

export const rejectFriendshipRequest = async (senderId: number, receiverId: number, token: string): Promise<ApiResponse<null>> => {
    try {
        const response = await api.delete(`/friendshipRequest/reject/${senderId}/${receiverId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status !== 200) {
            throw new Error(response.statusText);
        }

        return {
            success: true,
            data: null,
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

export const changeUsername = async (userId: number, newUsername: string, token: string): Promise<ApiResponse<null>> => {
    try {
        const DTO = {
            userId: userId,
            newUsername: newUsername,
        };

        const response = await api.post("/user/change/username", DTO, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status !== 200) {
            throw new Error(response.statusText);
        }

        return {
            success: true,
            data: null,
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

export const changePassword = async (userId: number, oldPassword: string, newPassword: string, token: string): Promise<ApiResponse<null>> => {
    try {
        const DTO = {
            userId: userId,
            oldPassword: oldPassword,
            newPassword: newPassword,
        };

        const response = await api.post("user/change/password", DTO, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status !== 200) {
            throw new Error(response.statusText);
        }

        return {
            success: true,
            data: null,
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

export const changeMessagePreferences = async (userId: number, allowMessagesFromNonFriends: boolean, token: string): Promise<ApiResponse<null>> => {
    try {
        const DTO = {
            userId: userId,
            allowMessagesFromNonFriends: allowMessagesFromNonFriends,
        };

        const response = await api.post("/user/change/messagePreferences", DTO, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status !== 200) {
            throw new Error(response.statusText);
        }

        return {
            success: true,
            data: null,
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

export const deleteAccount = async (userId: number, password: string, token: string): Promise<ApiResponse<null>> => {
    try {
        const response = await api.delete(`/user/delete/${userId}/${password}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status !== 200) {
            throw new Error(response.statusText);
        }

        return {
            success: true,
            data: null,
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

export const createTeamChat = async (name: string, adminId: number, memberIds: number[], token: string): Promise<ApiResponse<null>> => {
    try {
        const DTO = {
            name: name,
            adminId: adminId,
            memberIds: memberIds
        };

        const response = await api.post("/chat/create/team", DTO, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status !== 200) {
            throw new Error(response.statusText);
        }

        return {
            success: true,
            data: null,
        };
    }
    catch (error: unknown) {
        const responseError = error as AxiosError;

        return {
            success: false,
            error: responseError.message
        };
    }
};

export const getChat = async (chatId: number, userId: number, token: string): Promise<ApiResponse<TeamChat | PrivateChat>> => {
    try {
        const response = await api.get<TeamChat | PrivateChat>(`/chat/get/${chatId}?userId=${userId}`, {
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

export const changeTeamChatName = async (chatId: number, userId: number, name: string, token: string): Promise<ApiResponse<null>> => {
    try {
        const DTO = {
            chatId: chatId,
            userId: userId,
            name: name,
        };

        const response = await api.post("/chat/change/name", DTO, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status !== 200) {
            throw new Error(response.statusText);
        }

        return {
            success: true,
            data: null,
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

export const deleteTeamChat = async (chatId: number, userId: number, token: string): Promise<ApiResponse<string>> => {
    try {
        const response = await api.delete(`/chat/delete/${chatId}?userId=${userId}`, {
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

export const removeTeamChatMember = async (chatId: number, memberId: number, adminId: number, token: string): Promise<ApiResponse<string>> => {
    try {
        const response = await api.delete(`/chat/remove/${chatId}/member/${memberId}?adminId=${adminId}`, {
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

export const changeTeamChatAdmin = async (chatId: number, userId: number, newAdminId: number, token: string): Promise<ApiResponse<null>> => {
    try {
        const DTO = {
            chatId: chatId,
            userId: userId,
            newAdminId: newAdminId
        };

        const response = await api.post("/chat/change/admin", DTO, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status !== 200) {
            throw new Error(response.statusText);
        }

        return {
            success: true,
            data: null,
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

export const addTeamChatMembers = async (chatId: number, userId: number, newMemberIds: number[], token: string): Promise<ApiResponse<null>> => {
    try {
        const DTO = {
            chatId: chatId,
            userId: userId,
            newMemberIds: newMemberIds,
        };

        const response = await api.post("/chat/add/member", DTO, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status !== 200) {
            throw new Error(response.statusText);
        }

        return {
            success: true,
            data: null,
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

export const leaveTeamChat = async (chatId: number, userId: number, token: string): Promise<ApiResponse<string>> => {
    try {
        const response = await api.delete(`/chat/${chatId}/leave?userId=${userId}`, {
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

export const isMemberOfChat = async (chatId: number, userId: number, token: string): Promise<ApiResponse<boolean>> => {
    try {
        const response = await api.get<boolean>(`/chat/${chatId}/isMember?userId=${userId}`, {
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
