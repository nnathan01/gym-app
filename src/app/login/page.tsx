"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleLogin = async (e: any) => {
        e.preventDefault();

        const res = await fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        if (res.ok) {
            router.push("/");
        } else {
            alert("Login gagal");
        }
    };

    return (
        <div className="flex h-screen items-center justify-center">
            <form onSubmit={handleLogin} className="space-y-4 border p-6">
                <h1 className="text-xl font-bold">Login Admin</h1>

                <input
                    type="email"
                    placeholder="Email"
                    className="border p-2 w-full"
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="border p-2 w-full"
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button className="bg-blue-500 text-white px-4 py-2 w-full">
                    Login
                </button>
            </form>
        </div>
    );
}