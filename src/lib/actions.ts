"use server";

import axios, { AxiosError } from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/api/v1",
    headers: {
        "Content-Type": "application/json",
    },
});

type ApiResponse<T> = { success: true; data: T; } | { success: false; error: string; };

// export const login = async (login: string, password: string): Promise<ApiResponse<null>> => {
//     try {
//         const response = await signIn("credentials", {
//             redirect: false,
//             login: login,
//             password: password,
//         });

//         if (response && response.error) {
//             throw new Error(response.error);
//         }

//         return {
//             success: true,
//             data: null,
//         }
//     }
//     catch (error: unknown) {
//         console.log(error);

//         return {
//             success: false,
//             error: "Invalid login or password",
//         } 
//     }
// };

export const signUp = async (username: string, email: string, password: string): Promise<ApiResponse<null>> => {
    try {
        const response = await api.post("/user/register", {
            username: username,
            email: email,
            password: password,
        });

        if (response.status !== 200) {
            throw new Error(response.statusText);
        }

        return {
            success: true,
            data: null,
        }
    }
    catch (error: unknown) {
        const responseError = error as AxiosError;
        
        return {
            success: false,
            error: String(responseError.response?.data) || responseError.message,
        }
    }
};
