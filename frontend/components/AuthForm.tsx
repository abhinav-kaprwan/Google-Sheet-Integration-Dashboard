"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";

export default function AuthForm({type}: {type: "login" | "register"}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const auth = useAuth();
    
    if (!auth) return null;

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (type === "login") {
                await auth.login(email, password);
            } else {
                const res = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
                    { email, password },
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        withCredentials: true
                    }
                );
                if(res.status === 201) {
                    await auth.login(email, password);
                }
            }
        } catch(err) {
            console.error('Authentication error:', err);
            alert(type === 'login' ? 'Login failed. Please try again.' : 'Registration failed. Please try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6 border rounded-lg max-w-sm mx-auto">
            <h2 className="text-xl font-bold">{type === "login" ? "Login" : "Sign Up"}</h2>
            <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <Button type="submit" variant="default">
                {type === "login" ? "Login" : "Sign Up"}
            </Button>
        </form>
    );
} 