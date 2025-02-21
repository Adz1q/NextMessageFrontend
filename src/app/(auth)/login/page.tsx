"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function Login() {
    const [login, setLogin] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const response = await signIn("credentials", {
            login,
            password,
            redirect: false,
        });

        if (response?.error) {
            console.error(response.error);
        }

        router.push("/");
    }
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={login}
                    onChange={(event) => setLogin(event.target.value)}
                    className="bg-slate-700"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="bg-slate-700"
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}