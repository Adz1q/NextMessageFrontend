import axios, { AxiosError } from "axios";

type User = {
    id: number;
    username: string;
    email: string;
    password: string;
    profilePictureUrl: string;
    date: string;
    allowMessagesFromNonFriends: boolean;
}

type ApiResponse<T> = {
    success: boolean;
    data?: T;
    error?: string;
}

export const getUser = async <User>(login: string, token: string): Promise<ApiResponse<User>> => {
    try {
        const response = await axios.get<User>(`http://localhost:3000/api/v1/user/${login}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return {
            success: true,
            data: response.data,
        };
    }
    catch (error) {
        const responseError = error as AxiosError;

        return {
            success: false,
            error: responseError.message,
        };
    } 
};