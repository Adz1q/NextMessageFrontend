import axios, { AxiosError } from "axios";

type User = {
    id: number;
    username: string;
    email: string;
    password: string;
    profilePictureUrl: string;
    date: string;
    allowMessagesFromNonFriends: boolean;
};

type ApiResponse<T> = { success: true; data: T; } | { success: false; error: string; }; 

export const getUser = async (login: string, token: string): Promise<ApiResponse<User>> => {
    try {
        const response = await axios.get<User>(`http://localhost:8080/api/v1/user/get/${login}`, {
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